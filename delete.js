const { REST, Routes } = require('discord.js');
const readline = require('readline');
require('dotenv').config();

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// 提示用戶輸入
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// 刪除指定的指令
async function deleteCommands(commands, indices, isGlobal) {
    const clientId = process.env.CLIENT_ID;
    const guildId = process.env.GUILD_ID;
    
    for (const index of indices) {
        if (index >= 0 && index < commands.length) {
            const cmd = commands[index];
            try {
                if (isGlobal) {
                    await rest.delete(Routes.applicationCommand(clientId, cmd.id));
                } else {
                    await rest.delete(Routes.applicationGuildCommand(clientId, guildId, cmd.id));
                }
                console.log(`✅ 已刪除: ${cmd.name}`);
            } catch (error) {
                console.error(`❌ 刪除失敗 (${cmd.name}):`, error.message);
            }
        }
    }
}

// 主程式
(async () => {
    try {
        if (!process.env.CLIENT_ID) {
            console.error('❌ CLIENT_ID 未在 .env 文件中找到！');
            process.exit(1);
        }

        console.log('🔍 正在檢查已註冊的指令...\n');
        
        // 獲取全域指令
        const globalCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
        
        // 獲取公會指令（如果有提供 GUILD_ID）
        let guildCommands = [];
        if (process.env.GUILD_ID) {
            try {
                guildCommands = await rest.get(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID)
                );
            } catch (error) {
                console.log('⚠️ 無法獲取公會指令（可能 GUILD_ID 無效）\n');
            }
        }

        // 顯示全域指令
        console.log(`📋 全域指令 (${globalCommands.length} 個):`);
        if (globalCommands.length === 0) {
            console.log('   (沒有已註冊的全域指令)');
        } else {
            globalCommands.forEach((cmd, index) => {
                console.log(`   ${index + 1}. ${cmd.name} - ${cmd.description || '無描述'}`);
            });
        }

        // 顯示公會指令
        if (process.env.GUILD_ID) {
            console.log(`\n🏠 公會指令 (${guildCommands.length} 個):`);
            if (guildCommands.length === 0) {
                console.log('   (沒有已註冊的公會指令)');
            } else {
                guildCommands.forEach((cmd, index) => {
                    console.log(`   ${index + 1}. ${cmd.name} - ${cmd.description || '無描述'}`);
                });
            }
        }

        // 如果沒有任何指令，退出
        if (globalCommands.length === 0 && guildCommands.length === 0) {
            console.log('\n✨ 沒有需要刪除的指令！');
            rl.close();
            return;
        }

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('請選擇要刪除的指令類型：');
        console.log('1. 全域指令');
        console.log('2. 公會指令');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const typeChoice = await askQuestion('\n請輸入選項 (1 或 2): ');
        
        let commandsToDelete = [];
        let isGlobal = false;
        
        if (typeChoice === '1') {
            if (globalCommands.length === 0) {
                console.log('\n❌ 沒有全域指令可以刪除！');
                rl.close();
                return;
            }
            commandsToDelete = globalCommands;
            isGlobal = true;
            console.log('\n📋 全域指令列表：');
        } else if (typeChoice === '2') {
            if (!process.env.GUILD_ID) {
                console.log('\n❌ 請在 .env 文件中設定 GUILD_ID！');
                rl.close();
                return;
            }
            if (guildCommands.length === 0) {
                console.log('\n❌ 沒有公會指令可以刪除！');
                rl.close();
                return;
            }
            commandsToDelete = guildCommands;
            isGlobal = false;
            console.log('\n🏠 公會指令列表：');
        } else {
            console.log('\n❌ 無效的選項！');
            rl.close();
            return;
        }

        // 顯示要操作的指令列表
        commandsToDelete.forEach((cmd, index) => {
            console.log(`   ${index + 1}. ${cmd.name} - ${cmd.description || '無描述'}`);
        });

        console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('刪除選項：');
        console.log('• 輸入 "all" - 刪除全部指令');
        console.log('• 輸入數字 - 刪除單一指令（例如：1）');
        console.log('• 輸入多個數字 - 刪除多個指令（例如：1,3,5）');
        console.log('• 輸入範圍 - 刪除範圍內的指令（例如：1-5）');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
        const input = await askQuestion('\n請輸入要刪除的指令: ');
        
        let indicesToDelete = [];
        
        if (input.toLowerCase() === 'all') {
            // 刪除全部
            const confirm = await askQuestion(`\n⚠️  確定要刪除所有 ${commandsToDelete.length} 個指令嗎？(yes/no): `);
            if (confirm.toLowerCase() !== 'yes') {
                console.log('\n❌ 已取消操作');
                rl.close();
                return;
            }
            indicesToDelete = Array.from({ length: commandsToDelete.length }, (_, i) => i);
        } else if (input.includes('-')) {
            // 範圍選擇（例如：1-5）
            const [start, end] = input.split('-').map(num => parseInt(num.trim()));
            if (isNaN(start) || isNaN(end) || start < 1 || end > commandsToDelete.length || start > end) {
                console.log('\n❌ 無效的範圍！');
                rl.close();
                return;
            }
            indicesToDelete = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
        } else if (input.includes(',')) {
            // 多個選擇（例如：1,3,5）
            const numbers = input.split(',').map(num => parseInt(num.trim()));
            if (numbers.some(num => isNaN(num) || num < 1 || num > commandsToDelete.length)) {
                console.log('\n❌ 無效的數字！');
                rl.close();
                return;
            }
            indicesToDelete = numbers.map(num => num - 1);
        } else {
            // 單一選擇
            const num = parseInt(input);
            if (isNaN(num) || num < 1 || num > commandsToDelete.length) {
                console.log('\n❌ 無效的數字！');
                rl.close();
                return;
            }
            indicesToDelete = [num - 1];
        }

        // 顯示將要刪除的指令
        console.log('\n將刪除以下指令：');
        indicesToDelete.forEach(index => {
            console.log(`   • ${commandsToDelete[index].name}`);
        });

        const finalConfirm = await askQuestion('\n確認刪除？(yes/no): ');
        if (finalConfirm.toLowerCase() !== 'yes') {
            console.log('\n❌ 已取消操作');
            rl.close();
            return;
        }

        console.log('\n🗑️  開始刪除指令...\n');
        await deleteCommands(commandsToDelete, indicesToDelete, isGlobal);
        
        console.log('\n✅ 刪除完成！');
        
    } catch (error) {
        console.error('\n❌ 發生錯誤:', error);
    } finally {
        rl.close();
    }
})();
