const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

// Create backups directory if it doesn't exist
const backupsDir = path.join(__dirname, 'backups');
if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir);
}

async function createBackup(commands, type) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `commands-backup-${type}-${timestamp}.json`;
    const filepath = path.join(backupsDir, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(commands, null, 2));
    console.log(`💾 Backup created: ${filename}`);
    return filepath;
}

(async () => {
    try {
        if (!process.env.CLIENT_ID || !process.env.BOT_TOKEN) {
            console.error('❌ Missing CLIENT_ID or BOT_TOKEN in .env file!');
            console.log('💡 Make sure your .env file contains:');
            console.log('   BOT_TOKEN=your_bot_token');
            console.log('   CLIENT_ID=your_client_id');
            process.exit(1);
        }

        console.log('🔍 Discord Command Inspector');
        console.log('=' .repeat(50));
        
        // Check global commands
        console.log('🌍 Checking GLOBAL commands...');
        try {
            const globalCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
            console.log(`📋 Found ${globalCommands.length} global commands:`);
            
            if (globalCommands.length === 0) {
                console.log('   ✅ No global commands registered');
            } else {
                globalCommands.forEach((cmd, index) => {
                    console.log(`   ${index + 1}. /${cmd.name} - ${cmd.description || 'No description'}`);
                });
                
                // Create backup
                await createBackup(globalCommands, 'global');
            }
        } catch (error) {
            console.error('❌ Error fetching global commands:', error.message);
        }

        // Check guild commands if GUILD_ID is provided
        if (process.env.GUILD_ID) {
            console.log('\n🏠 Checking GUILD commands...');
            try {
                const guildCommands = await rest.get(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
                );
                console.log(`📋 Found ${guildCommands.length} guild commands:`);
                
                if (guildCommands.length === 0) {
                    console.log('   ✅ No guild commands registered');
                } else {
                    guildCommands.forEach((cmd, index) => {
                        console.log(`   ${index + 1}. /${cmd.name} - ${cmd.description || 'No description'}`);
                    });
                    
                    // Create backup
                    await createBackup(guildCommands, 'guild');
                }
            } catch (error) {
                console.error('❌ Error fetching guild commands:', error.message);
                console.log('💡 Make sure GUILD_ID is correct and bot is in that server');
            }
        } else {
            console.log('\n💡 Add GUILD_ID to .env to check guild-specific commands');
        }

        console.log('\n📊 Summary:');
        console.log(`   • Global commands affect ALL servers where your bot is invited`);
        console.log(`   • Guild commands only affect the specific server (GUILD_ID)`);
        console.log(`   • Backups are saved in the 'backups' folder`);
        
    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
})();