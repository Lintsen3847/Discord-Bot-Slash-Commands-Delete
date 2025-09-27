const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

// List of old commands to remove globally
const oldCommandsToRegister = [
    { name: 'clear', description: 'Clear the music queue' },
    { name: 'disconnect', description: 'Disconnect the bot from voice channel' },
    { name: 'fseek', description: 'Fast seek in current track' },
    { name: 'loop-queue', description: 'Loop the entire queue' },
    { name: 'move', description: 'Move a track in the queue' },
    { name: 'now-playing', description: 'Show currently playing track' },
    { name: 'play', description: 'Play a song' },
    { name: 'remove', description: 'Remove a track from queue' },
    { name: 'resume', description: 'Resume playback' },
    { name: 'shuffle', description: 'Shuffle the queue' },
    { name: 'stop', description: 'Stop playback' },
    { name: 'volume', description: 'Set playback volume' },
    { name: 'config', description: 'Bot configuration' },
    { name: 'favorites', description: 'Manage favorite tracks' },
    { name: 'loop', description: 'Loop current track' },
    { name: 'next', description: 'Skip to next track' },
    { name: 'pause', description: 'Pause playback' },
    { name: 'queue', description: 'Show music queue' },
    { name: 'replay', description: 'Replay current track' },
    { name: 'seek', description: 'Seek in current track' },
    { name: 'skip', description: 'Skip current track' },
    { name: 'unskip', description: 'Go back to previous track' }
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        if (!process.env.CLIENT_ID) {
            console.error('❌ CLIENT_ID not found in .env file!');
            process.exit(1);
        }

        console.log('🌍 GLOBAL COMMAND CLEANUP');
        console.log('=' .repeat(50));

        // Step 1: Register old commands globally
        console.log(`🔧 Step 1: Registering ${oldCommandsToRegister.length} old commands GLOBALLY...`);
        
        const commandsToRegister = oldCommandsToRegister.map(cmd => 
            new SlashCommandBuilder()
                .setName(cmd.name)
                .setDescription(cmd.description)
                .toJSON()
        );

        // Register globally
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commandsToRegister }
        );

        console.log(`✅ Successfully registered ${commandsToRegister.length} old commands GLOBALLY.`);
        console.log('⏳ Waiting 3 seconds for propagation...\n');
        
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Step 2: Remove global commands
        console.log(`🗑️  Step 2: Removing old commands GLOBALLY...`);

        const globalCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
        console.log(`📋 Found ${globalCommands.length} global commands`);

        const globalCommandsToDelete = globalCommands.filter(cmd => 
            oldCommandsToRegister.some(oldCmd => oldCmd.name === cmd.name)
        );

        console.log(`🎯 Deleting ${globalCommandsToDelete.length} global commands:`);
        for (const command of globalCommandsToDelete) {
            try {
                await rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, command.id));
                console.log(`✅ Globally deleted: ${command.name}`);
            } catch (error) {
                console.error(`❌ Failed to delete globally ${command.name}:`, error.message);
            }
        }

        // Step 3: Clear ALL commands globally (nuclear option)
        console.log('\n🚀 Step 3: Ensuring ALL global commands are cleared...');
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
        console.log('✅ ALL global commands cleared!');

        // Step 4: Also clear guild commands if GUILD_ID provided
        if (process.env.GUILD_ID) {
            console.log('\n🏠 GUILD COMMAND CLEANUP');
            console.log('=' .repeat(50));
            
            try {
                // Register in guild
                console.log('🔧 Registering old commands in guild...');
                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                    { body: commandsToRegister }
                );
                
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Clear guild commands
                console.log('🗑️  Clearing ALL guild commands...');
                await rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                    { body: [] }
                );
                console.log('✅ ALL guild commands cleared!');
                
            } catch (error) {
                console.log('⚠️  Guild cleanup failed (maybe invalid GUILD_ID):', error.message);
            }
        } else {
            console.log('\n💡 Add GUILD_ID to .env to also clean guild-specific commands');
        }

        console.log('\n🎉 COMPLETE GLOBAL CLEANUP FINISHED!');
        console.log('✅ All old commands removed from EVERYWHERE');
        console.log('💡 Your bot now has a completely clean slate worldwide');
        
    } catch (error) {
        console.error('❌ Error in global cleanup process:', error);
    }
})();