const { createREST, validateEnv, clearGlobalCommands, clearGuildCommands, saveBackup, fetchAllCommands } = require('../lib/discord');

/**
 * 清空所有指令
 * @param {Object} options
 * @param {boolean} options.yes - 是否跳過確認
 * @param {boolean} options.guildOnly - 是否只清空公會指令
 * @param {boolean} options.globalOnly - 是否只清空全域指令
 */
async function nukeCommands(options = {}) {
    const rest = createREST();
    const { clientId, guildId } = validateEnv(options.guildOnly);

    // 先抓取目前指令做備份
    const { global, guild } = await fetchAllCommands(rest, clientId, guildId);

    if (options.guildOnly && !guildId) {
        throw new Error('❌ 使用 --guild 時必須在 .env 中設定 GUILD_ID');
    }

    if (!options.yes) {
        console.log('⚠️  警告：這將刪除以下指令！\n');
        if (!options.guildOnly && global.length > 0) {
            console.log(`📋 全域指令 (${global.length} 個)`);
            global.forEach(cmd => console.log(`   - ${cmd.name}`));
        }
        if (!options.globalOnly && guildId && guild.length > 0) {
            console.log(`\n🏠 公會指令 (${guild.length} 個)`);
            guild.forEach(cmd => console.log(`   - ${cmd.name}`));
        }
        if (global.length === 0 && guild.length === 0) {
            console.log('✨ 沒有已註冊的指令，無需清理');
            return;
        }

        // 簡單的終端確認（不需要 readline）
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        const answer = await new Promise(resolve => {
            rl.question('\n確定要全部刪除嗎？輸入 "yes" 確認: ', resolve);
        });
        rl.close();

        if (answer.trim().toLowerCase() !== 'yes') {
            console.log('❌ 已取消操作');
            return;
        }
    }

    // 備份
    if (global.length > 0) {
        const backupPath = saveBackup(global, 'global');
        console.log(`💾 全域指令已備份: ${backupPath}`);
    }
    if (guild.length > 0) {
        const backupPath = saveBackup(guild, 'guild');
        console.log(`💾 公會指令已備份: ${backupPath}`);
    }

    // 執行刪除
    if (!options.guildOnly) {
        await clearGlobalCommands(rest, clientId);
        console.log('✅ 已清空所有全域指令');
    }
    if (!options.globalOnly && guildId) {
        await clearGuildCommands(rest, clientId, guildId);
        console.log('✅ 已清空所有公會指令');
    }

    console.log('\n🎉 清理完成！');
}

// 直接執行時
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        yes: args.includes('--yes') || args.includes('-y'),
        guildOnly: args.includes('--guild') || args.includes('-g'),
        globalOnly: args.includes('--global') || args.includes('--global-only')
    };

    nukeCommands(options).catch(err => {
        console.error(err.message);
        process.exit(1);
    });
}

module.exports = { nukeCommands };
