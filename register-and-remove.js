const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

// List of old commands to register and then remove
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

        console.log(`🔧 Step 1: Registering ${oldCommandsToRegister.length} old commands...`);
        
        // Create SlashCommandBuilder objects for old commands
        const commandsToRegister = oldCommandsToRegister.map(cmd => 
            new SlashCommandBuilder()
                .setName(cmd.name)
                .setDescription(cmd.description)
                .toJSON()
        );

        // Register all old commands globally
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commandsToRegister }
        );

        console.log(`✅ Successfully registered ${commandsToRegister.length} old commands.`);
        console.log('⏳ Waiting 2 seconds...\n');
        
        // Wait a moment for registration to complete
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log(`🗑️  Step 2: Now removing these old commands...`);

        // Get all currently registered commands
        const registeredCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
        console.log(`📋 Found ${registeredCommands.length} registered commands`);

        // Filter and delete the old commands we just registered
        const commandsToDelete = registeredCommands.filter(cmd => 
            oldCommandsToRegister.some(oldCmd => oldCmd.name === cmd.name)
        );

        console.log(`🎯 Targeting ${commandsToDelete.length} commands for deletion:`);
        commandsToDelete.forEach(cmd => console.log(`   - ${cmd.name}`));

        // Delete each old command
        for (const command of commandsToDelete) {
            try {
                await rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, command.id));
                console.log(`✅ Deleted: ${command.name}`);
            } catch (error) {
                console.error(`❌ Failed to delete ${command.name}:`, error.message);
            }
        }

        console.log('\n🎉 Successfully cleaned up all old commands!');
        console.log('💡 Now you can deploy your current commands safely.');
        
    } catch (error) {
        console.error('❌ Error in cleanup process:', error);
    }
})();