const { REST, Routes, SlashCommandBuilder } = require('discord.js');
require('dotenv').config();

// ⚠️ 警告：此腳本會刪除所有全域指令！
// 它使用 rest.put() 會覆蓋所有現有指令，
// 然後刪除它們。下面的陣列內容無關緊要 - 所有指令都會被移除。
// 
// 要進行更安全的選擇性刪除，請使用 delete.js！

// 列出要覆蓋然後移除的舊指令
const oldCommandsToRegister = [
    { name: 'clear', description: '清除音樂佇列' },
    { name: 'disconnect', description: '中斷機器人的語音頻道連接' },
    { name: 'ping', description: '這是一個範例指令' },
    
];

const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

(async () => {
    try {
        if (!process.env.CLIENT_ID) {
            console.error('❌ 在 .env 文件中找不到 CLIENT_ID!');
            process.exit(1);
        }

        console.log('⚠️  警告 : 這將刪除所有全域指令！');
        console.log('⚠️  使用 delete.js 進行更安全的選擇性刪除。\n');

        console.log(`🔧 步驟 1:正在註冊 ${oldCommandsToRegister.length} 個舊指令...`);
        
        // 為舊指令創建 SlashCommandBuilder 物件
        const commandsToRegister = oldCommandsToRegister.map(cmd => 
            new SlashCommandBuilder()
                .setName(cmd.name)
                .setDescription(cmd.description)
                .toJSON()
        );

        // 全域註冊所有舊指令
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commandsToRegister }
        );

        console.log(`✅ 成功註冊 ${commandsToRegister.length} 個舊指令。`);
        console.log('⏳ 等待 2 秒...\n');
        
        // 等待一下讓註冊完成
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log(`🗑️  步驟 2:現在移除這些列出的指令...`);

        // 獲取所有目前已註冊的指令
        const registeredCommands = await rest.get(Routes.applicationCommands(process.env.CLIENT_ID));
        console.log(`📋 找到 ${registeredCommands.length} 個已註冊的指令`);

        // 篩選並刪除我們剛註冊的舊指令
        const commandsToDelete = registeredCommands.filter(cmd => 
            oldCommandsToRegister.some(oldCmd => oldCmd.name === cmd.name)
        );

        console.log(`🎯 目標刪除 ${commandsToDelete.length} 個指令：`);
        commandsToDelete.forEach(cmd => console.log(`   - ${cmd.name}`));

        // 刪除每個舊指令
        for (const command of commandsToDelete) {
            try {
                await rest.delete(Routes.applicationCommand(process.env.CLIENT_ID, command.id));
                console.log(`✅ 已刪除: ${command.name}`);
            } catch (error) {
                console.error(`❌ 刪除失敗 (${command.name}):`, error.message);
            }
        }

        console.log('\n🎉 成功清理列出的指令！');
        
    } catch (error) {
        console.error('❌ 清理過程中發生錯誤:', error);
    }
})();