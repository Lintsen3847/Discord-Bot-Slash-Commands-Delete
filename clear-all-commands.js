const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        console.log('🗑️  Started deleting ALL application (/) commands...');

        if (!process.env.CLIENT_ID) {
            console.error('❌ CLIENT_ID not found in .env file!');
            process.exit(1);
        }

        // Delete all global commands
        await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), { body: [] });
        console.log('✅ Successfully deleted all GLOBAL slash commands.');

        // Delete all guild commands (if GUILD_ID is provided)
        if (process.env.GUILD_ID) {
            await rest.put(
                Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), 
                { body: [] }
            );
            console.log('✅ Successfully deleted all GUILD slash commands.');
        }

        console.log('🎉 All commands have been removed!');
    } catch (error) {
        console.error('❌ Error deleting commands:', error);
    }
})();