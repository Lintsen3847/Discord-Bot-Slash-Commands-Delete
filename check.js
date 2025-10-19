const { REST, Routes } = require('discord.js');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        if (!process.env.CLIENT_ID) {
            console.error('❌ 在 .env 文件中找不到 CLIENT_ID！');
            process.exit(1);
        }

        console.log('🔍 正在檢查已註冊的指令...\n');
        
        // 檢查全域指令
        const globalCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
        console.log(`📋 全域指令 (${globalCommands.length} 個):`);
        if (globalCommands.length === 0) {
            console.log('   (沒有已註冊的全域指令)');
        } else {
            globalCommands.forEach((cmd, index) => {
                console.log(`   ${index + 1}. ${cmd.name} - ${cmd.description || '無描述'}`);
            });
        }

        // 如果提供了 GUILD_ID，檢查公會指令
        if (process.env.GUILD_ID) {
            console.log('\n🏠 公會指令:');
            try {
                const guildCommands = await rest.get(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
                );
                console.log(`📋 公會指令 (${guildCommands.length} 個):`);
                if (guildCommands.length === 0) {
                    console.log('   (沒有已註冊的公會指令)');
                } else {
                    guildCommands.forEach((cmd, index) => {
                        console.log(`   ${index + 1}. ${cmd.name} - ${cmd.description || '無描述'}`);
                    });
                }
            } catch (error) {
                console.log('   (沒有公會指令或 GUILD_ID 無效)');
            }
        } else {
            console.log('\n💡 在 .env 中加入 GUILD_ID 以檢查公會專屬指令');
        }
        
    } catch (error) {
        console.error('❌ 檢查指令時發生錯誤:', error);
    }
})();