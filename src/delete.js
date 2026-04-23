const { createREST, validateEnv, fetchAllCommands, deleteCommand, saveBackup } = require('../lib/discord');
const { select, checkbox, confirm } = require('@inquirer/prompts');

/**
 * 解析刪除選項字串為索引陣列
 */
function parseDeleteInput(input, total) {
    const normalized = input.toLowerCase().trim();
    if (normalized === 'all') {
        return Array.from({ length: total }, (_, i) => i);
    }
    if (normalized.includes('-')) {
        const [start, end] = normalized.split('-').map(n => parseInt(n.trim()));
        if (isNaN(start) || isNaN(end) || start < 1 || end > total || start > end) {
            throw new Error('無效的範圍');
        }
        return Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
    }
    if (normalized.includes(',')) {
        const nums = normalized.split(',').map(n => parseInt(n.trim()));
        if (nums.some(n => isNaN(n) || n < 1 || n > total)) {
            throw new Error('無效的數字');
        }
        return [...new Set(nums.map(n => n - 1))].sort((a, b) => a - b);
    }
    const num = parseInt(normalized);
    if (isNaN(num) || num < 1 || num > total) {
        throw new Error('無效的數字');
    }
    return [num - 1];
}

/**
 * 執行刪除
 */
async function executeDelete(rest, clientId, commands, indices, isGlobal, guildId, noBackup) {
    if (!noBackup && indices.length > 0) {
        const scope = isGlobal ? 'global' : `guild-${guildId}`;
        const backupPath = saveBackup(
            indices.map(i => commands[i]),
            scope
        );
        console.log(`💾 已備份至: ${backupPath}\n`);
    }

    console.log('🗑️ 開始刪除...\n');
    for (const i of indices) {
        const cmd = commands[i];
        try {
            await deleteCommand(rest, clientId, cmd.id, isGlobal, guildId);
            console.log(`✅ 已刪除: ${cmd.name}`);
        } catch (err) {
            console.error(`❌ 刪除失敗 (${cmd.name}): ${err.message}`);
        }
    }
    console.log('\n✅ 刪除完成！');
}

/**
 * TUI 互動式刪除（方向鍵 + 數字鍵選擇）
 */
async function deleteCommandsInteractive(options = {}) {
    const rest = createREST();
    const { clientId, guildId } = validateEnv(false);

    console.log('🔍 正在檢查已註冊的指令...\n');

    const { global, guild } = await fetchAllCommands(rest, clientId, guildId);

    if (global.length === 0 && guild.length === 0) {
        console.log('✨ 沒有需要刪除的指令！');
        return;
    }

    // 步驟 1：選擇指令類型
    const scopeChoices = [
        { name: `📋 全域指令 (${global.length} 個)`, value: 'global', disabled: global.length === 0 },
        { name: `🏠 公會指令 (${guild.length} 個)`, value: 'guild', disabled: guild.length === 0 || !guildId }
    ];

    const scope = await select({
        message: '請選擇要刪除的指令類型：',
        choices: scopeChoices
    });

    const commandsToDelete = scope === 'global' ? global : guild;
    const isGlobal = scope === 'global';
    const targetGuildId = isGlobal ? null : guildId;

    if (commandsToDelete.length === 0) {
        console.log('❌ 沒有指令可以刪除');
        return;
    }

    // 步驟 2：用 checkbox 多選要刪的指令
    const cmdChoices = commandsToDelete.map((cmd, i) => ({
        name: `${cmd.name} — ${cmd.description || '無描述'}`,
        value: i
    }));

    // 加一個「全部」選項在最上面
    cmdChoices.unshift({
        name: '⚠️ 全部刪除',
        value: 'all'
    });

    const selectedIndices = await checkbox({
        message: '請選擇要刪除的指令（空格勾選，Enter 確認）：',
        choices: cmdChoices,
        instructions: false,
        required: true
    });

    let indices;
    if (selectedIndices.includes('all')) {
        indices = Array.from({ length: commandsToDelete.length }, (_, i) => i);
    } else {
        indices = selectedIndices;
    }

    if (indices.length === 0) {
        console.log('❌ 未選擇任何指令');
        return;
    }

    // 步驟 3：確認刪除
    const namesToDelete = indices.map(i => commandsToDelete[i].name);
    console.log('\n將刪除以下指令：');
    namesToDelete.forEach(n => console.log(`   • ${n}`));

    const ok = await confirm({
        message: `確定要刪除這 ${indices.length} 個指令嗎？`,
        default: false
    });

    if (!ok) {
        console.log('❌ 已取消');
        return;
    }

    await executeDelete(rest, clientId, commandsToDelete, indices, isGlobal, targetGuildId, options.noBackup);
}

/**
 * 非互動式刪除（一鍵執行）
 */
async function deleteCommandsDirect(options = {}) {
    const rest = createREST();
    const { clientId, guildId } = validateEnv(options.scope === 'guild');

    const { global, guild } = await fetchAllCommands(rest, clientId, guildId);

    let commandsToDelete = [];
    let isGlobal = false;
    let targetGuildId = null;

    if (options.scope === 'global' || !options.scope) {
        commandsToDelete = global;
        isGlobal = true;
    } else if (options.scope === 'guild') {
        if (!guildId) {
            throw new Error('刪除公會指令需要提供 GUILD_ID');
        }
        commandsToDelete = guild;
        isGlobal = false;
        targetGuildId = guildId;
    }

    if (commandsToDelete.length === 0) {
        console.log('✨ 沒有需要刪除的指令！');
        return;
    }

    const select = options.select || 'all';
    let indices;
    try {
        indices = parseDeleteInput(select, commandsToDelete.length);
    } catch (err) {
        throw new Error(`刪除選項解析失敗: ${err.message}`);
    }

    console.log('將刪除以下指令：');
    indices.forEach(i => console.log(`   • ${commandsToDelete[i].name}`));

    if (!options.yes) {
        const readline = require('readline');
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const answer = await new Promise(resolve => rl.question('\n確認刪除？(yes/no): ', resolve));
        rl.close();
        if (answer.toLowerCase() !== 'yes') {
            console.log('❌ 已取消');
            return;
        }
    }

    await executeDelete(rest, clientId, commandsToDelete, indices, isGlobal, targetGuildId, options.noBackup);
}

// 直接執行時
if (require.main === module) {
    const args = process.argv.slice(2);
    const options = {
        noBackup: args.includes('--no-backup'),
        yes: args.includes('--yes') || args.includes('-y'),
        all: args.includes('--all') || args.includes('-a'),
        scope: null,
        select: null
    };

    const scopeIdx = args.findIndex(a => a === '--scope' || a === '-s');
    if (scopeIdx !== -1 && args[scopeIdx + 1]) {
        options.scope = args[scopeIdx + 1];
    }

    const selectIdx = args.findIndex(a => a === '--select');
    if (selectIdx !== -1 && args[selectIdx + 1]) {
        options.select = args[selectIdx + 1];
    }

    if (options.all || options.scope || options.select) {
        if (!options.scope) options.scope = 'global';
        if (!options.select) options.select = 'all';
        deleteCommandsDirect(options).catch(err => {
            console.error(err.message);
            process.exit(1);
        });
    } else {
        deleteCommandsInteractive(options).catch(err => {
            console.error(err.message);
            process.exit(1);
        });
    }
}

module.exports = { deleteCommandsInteractive, deleteCommandsDirect };
