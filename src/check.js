const { createREST, validateEnv, fetchAllCommands, formatCommandList } = require('../lib/discord');

/**
 * 檢查目前已註冊的指令
 * @param {Object} options
 * @param {boolean} options.json - 是否輸出 JSON 格式
 * @param {boolean} options.save - 是否儲存備份
 */
async function checkCommands(options = {}) {
    const rest = createREST();
    const { clientId, guildId } = validateEnv(false);

    const { global, guild } = await fetchAllCommands(rest, clientId, guildId);

    if (options.json) {
        const output = {
            global: global.map(cmd => ({
                id: cmd.id,
                name: cmd.name,
                description: cmd.description,
                type: cmd.type || 1
            })),
            guild: guild.map(cmd => ({
                id: cmd.id,
                name: cmd.name,
                description: cmd.description,
                type: cmd.type || 1,
                guild_id: guildId
            })),
            timestamp: new Date().toISOString()
        };
        console.log(JSON.stringify(output, null, 2));
        return output;
    }

    console.log('🔍 已註冊的指令列表\n');
    console.log(formatCommandList(global, '全域指令'));

    if (guildId) {
        console.log('');
        console.log(formatCommandList(guild, '公會指令'));
    } else {
        console.log('\n💡 在 .env 中加入 GUILD_ID 以檢查公會專屬指令');
    }

    return { global, guild };
}

// 直接執行時
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        json: args.includes('--json') || args.includes('-j')
    };

    checkCommands(options).catch(err => {
        console.error(err.message);
        process.exit(1);
    });
}

module.exports = { checkCommands };
