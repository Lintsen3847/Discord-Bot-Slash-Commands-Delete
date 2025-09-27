const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

// list your old commands to overwrite and then remove
const oldCommandsToRegister = [
    { name: 'clear', description: 'Clear the music queue' },
    { name: 'disconnect', description: 'Disconnect the bot from voice channel' },
    { name: 'example', description: 'This is an example command' },
    
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

        console.log(`🗑️  Step 2: Now removing these listed commands...`);

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

        console.log('\n🎉 Successfully cleaned up listed commands!');
        
    } catch (error) {
        console.error('❌ Error in cleanup process:', error);
    }
})();