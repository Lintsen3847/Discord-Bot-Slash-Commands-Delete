const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        if (!process.env.CLIENT_ID) {
            console.error('❌ CLIENT_ID not found in .env file!');
            process.exit(1);
        }

        console.log('🔍 Checking currently registered commands...\n');
        
        // Check global commands
        const globalCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
        console.log(`📋 Global Commands (${globalCommands.length}):`);
        if (globalCommands.length === 0) {
            console.log('   (No global commands registered)');
        } else {
            globalCommands.forEach((cmd, index) => {
                console.log(`   ${index + 1}. ${cmd.name} - ${cmd.description || 'No description'}`);
            });
        }

        // Check guild commands if GUILD_ID is provided
        if (process.env.GUILD_ID) {
            console.log('\n🏠 Guild Commands:');
            try {
                const guildCommands = await rest.get(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
                );
                console.log(`📋 Guild Commands (${guildCommands.length}):`);
                if (guildCommands.length === 0) {
                    console.log('   (No guild commands registered)');
                } else {
                    guildCommands.forEach((cmd, index) => {
                        console.log(`   ${index + 1}. ${cmd.name} - ${cmd.description || 'No description'}`);
                    });
                }
            } catch (error) {
                console.log('   (No guild commands or invalid GUILD_ID)');
            }
        } else {
            console.log('\n💡 Add GUILD_ID to .env to check guild-specific commands');
        }
        
    } catch (error) {
        console.error('❌ Error checking commands:', error);
    }
})();