const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');

require('dotenv').config();

// 備份目錄
const BACKUP_DIR = path.join(process.cwd(), 'backups');

/**
 * 建立並回傳 Discord REST client
 */
function createREST() {
    const token = process.env.BOT_TOKEN;
    if (!token) {
        throw new Error('❌ 找不到 BOT_TOKEN，請確認 .env 已正確設定');
    }
    return new REST({ version: '10' }).setToken(token);
}

/**
 * 驗證必要環境變數
 */
function validateEnv(requireGuild = false) {
    const clientId = process.env.CLIENT_ID;
    if (!clientId) {
        throw new Error('❌ 找不到 CLIENT_ID，請確認 .env 已正確設定');
    }
    if (requireGuild && !process.env.GUILD_ID) {
        throw new Error('❌ 找不到 GUILD_ID，請確認 .env 已正確設定');
    }
    return { clientId, guildId: process.env.GUILD_ID };
}

/**
 * 取得所有指令（全域 + 公會）
 */
async function fetchAllCommands(rest, clientId, guildId) {
    const global = await rest.get(Routes.applicationCommands(clientId));
    let guild = [];
    if (guildId) {
        try {
            guild = await rest.get(Routes.applicationGuildCommands(clientId, guildId));
        } catch {
            guild = [];
        }
    }
    return { global, guild };
}

/**
 * 刪除單一指令
 */
async function deleteCommand(rest, clientId, commandId, isGlobal, guildId) {
    if (isGlobal) {
        await rest.delete(Routes.applicationCommand(clientId, commandId));
    } else {
        await rest.delete(Routes.applicationGuildCommand(clientId, guildId, commandId));
    }
}

/**
 * 清空所有全域指令（直接覆蓋為空陣列）
 */
async function clearGlobalCommands(rest, clientId) {
    await rest.put(Routes.applicationCommands(clientId), { body: [] });
}

/**
 * 清空所有公會指令
 */
async function clearGuildCommands(rest, clientId, guildId) {
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
}

/**
 * 建立備份目錄
 */
function ensureBackupDir() {
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
}

/**
 * 儲存備份
 */
function saveBackup(commands, scope) {
    ensureBackupDir();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `backup-${scope}-${timestamp}.json`;
    const filepath = path.join(BACKUP_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(commands, null, 2), 'utf8');
    return filepath;
}

/**
 * 列出所有備份
 */
function listBackups() {
    ensureBackupDir();
    return fs.readdirSync(BACKUP_DIR)
        .filter(f => f.endsWith('.json'))
        .map(f => ({
            name: f,
            path: path.join(BACKUP_DIR, f),
            time: fs.statSync(path.join(BACKUP_DIR, f)).mtime
        }))
        .sort((a, b) => b.time - a.time);
}

/**
 * 讀取備份
 */
function loadBackup(filepath) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

/**
 * 格式化指令列表供顯示
 */
function formatCommandList(commands, title) {
    const lines = [`📋 ${title} (${commands.length} 個):`];
    if (commands.length === 0) {
        lines.push('   (沒有已註冊的指令)');
    } else {
        commands.forEach((cmd, index) => {
            lines.push(`   ${index + 1}. ${cmd.name} - ${cmd.description || '無描述'}`);
        });
    }
    return lines.join('\n');
}

module.exports = {
    createREST,
    validateEnv,
    fetchAllCommands,
    deleteCommand,
    clearGlobalCommands,
    clearGuildCommands,
    saveBackup,
    listBackups,
    loadBackup,
    formatCommandList,
    BACKUP_DIR
};
