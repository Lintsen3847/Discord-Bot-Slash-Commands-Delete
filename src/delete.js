const { createREST, validateEnv, fetchAllCommands, deleteCommand, saveBackup } = require('../lib/discord');

const readline = require('readline');

function askQuestion(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer);
        });
    });
}

/**
 * 互動式刪除指令
 * @param {Object} options
 * @param {boolean} options.noBackup - 跳過備份
 */
async function deleteCommandsInteractive(options = {}) {
    const rest = createREST();
    const { clientId, guildId } = validateEnv(false);

    console.log('🔍 正在檢查已註冊的指令...\n');

    const { global, guild } = await fetchAllCommands(rest, clientId, guildId);

    // 顯示指令
    if (global.length === 0 && guild.length === 0) {
        console.log('✨ 沒有需要刪除的指令！');
        return;
    }

    console.log(`📋 全域指令 (${global.length} 個):`);
    global.forEach((cmd, i) => console.log(`   ${i + 1}. ${cmd.name} - ${cmd.description || '無描述'}`));

    if (guildId && guild.length > 0) {
        console.log(`\n🏠 公會指令 (${guild.length} 個):`);
        guild.forEach((cmd, i) => console.log(`   ${i + 1}. ${cmd.name} - ${cmd.description || '無描述'}`));
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('請選擇要刪除的指令類型：');
    console.log('1. 全域指令');
    if (guildId) console.log('2. 公會指令');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    const typeChoice = await askQuestion('\n請輸入選項: ');

    let commandsToDelete = [];
    let isGlobal = false;
    let targetGuildId = null;

    if (typeChoice === '1') {
        if (global.length === 0) {
            console.log('❌ 沒有全域指令可以刪除');
            return;
        }
        commandsToDelete = global;
        isGlobal = true;
    } else if (typeChoice === '2' && guildId) {
        if (guild.length === 0) {
            console.log('❌ 沒有公會指令可以刪除');
            return;
        }
        commandsToDelete = guild;
        isGlobal = false;
        targetGuildId = guildId;
    } else {
        console.log('❌ 無效的選項');
        return;
    }

    console.log('\n刪除選項：');
    console.log('• 輸入 "all" - 刪除全部指令');
    console.log('• 輸入數字 - 刪除單一指令（例如：1）');
    console.log('• 輸入多個數字 - 刪除多個指令（例如：1,3,5）');
    console.log('• 輸入範圍 - 刪除範圍內的指令（例如：1-5）');

    const input = await askQuestion('\n請輸入要刪除的指令: ');

    let indices = [];
    const total = commandsToDelete.length;

    if (input.toLowerCase() === 'all') {
        const confirm = await askQuestion(`\n⚠️ 確定要刪除所有 ${total} 個指令嗎？(yes/no): `);
        if (confirm.toLowerCase() !== 'yes') {
            console.log('❌ 已取消');
            return;
        }
        indices = Array.from({ length: total }, (_, i) => i);
    } else if (input.includes('-')) {
        const [start, end] = input.split('-').map(n => parseInt(n.trim()));
        if (isNaN(start) || isNaN(end) || start < 1 || end > total || start > end) {
            console.log('❌ 無效的範圍');
            return;
        }
        indices = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
    } else if (input.includes(',')) {
        const nums = input.split(',').map(n => parseInt(n.trim()));
        if (nums.some(n => isNaN(n) || n < 1 || n > total)) {
            console.log('❌ 無效的數字');
            return;
        }
        indices = nums.map(n => n - 1);
    } else {
        const num = parseInt(input);
        if (isNaN(num) || num < 1 || num > total) {
            console.log('❌ 無效的數字');
            return;
        }
        indices = [num - 1];
    }

    // 顯示將要刪除的指令
    console.log('\n將刪除以下指令：');
    indices.forEach(i => console.log(`   • ${commandsToDelete[i].name}`));

    const finalConfirm = await askQuestion('\n確認刪除？(yes/no): ');
    if (finalConfirm.toLowerCase() !== 'yes') {
        console.log('❌ 已取消');
        return;
    }

    // 備份（除非指定不備份）
    if (!options.noBackup && commandsToDelete.length > 0) {
        const scope = isGlobal ? 'global' : `guild-${targetGuildId}`;
        const backupPath = saveBackup(
            indices.map(i => commandsToDelete[i]),
            scope
        );
        console.log(`\n💾 已備份至: ${backupPath}`);
    }

    // 執行刪除
    console.log('\n🗑️ 開始刪除...\n');
    for (const i of indices) {
        const cmd = commandsToDelete[i];
        try {
            await deleteCommand(rest, clientId, cmd.id, isGlobal, targetGuildId);
            console.log(`✅ 已刪除: ${cmd.name}`);
        } catch (err) {
            console.error(`❌ 刪除失敗 (${cmd.name}): ${err.message}`);
        }
    }

    console.log('\n✅ 刪除完成！');
}

// 直接執行時
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        noBackup: args.includes('--no-backup')
    };

    deleteCommandsInteractive(options).catch(err => {
        console.error(err.message);
        process.exit(1);
    });
}

module.exports = { deleteCommandsInteractive };
