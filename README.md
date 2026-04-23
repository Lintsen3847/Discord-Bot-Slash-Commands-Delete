# Discord 指令清理工具

[English](README.en.md) | **繁體中文**

一個簡單的工具程式，幫助 Discord 機器人開發者在遷移專案或重複使用 bot token 時，檢查和清理舊的斜線指令。

## 為什麼需要這個工具？

當你繼承一個 Discord bot token 或從一個專案遷移到另一個專案時，舊的斜線指令通常會保留在 Discord 的 API 中。這些「幽靈指令」可能會：
- 使你的機器人指令列表變得混亂
- 讓使用者感到困惑
- 與新指令產生衝突
- 難以手動移除

## 可用工具

### 1. `check` - 指令檢查器
查看目前在你的機器人上註冊的所有指令。
```bash
node index.js check
# 或舊用法
node check.js
```

**新功能：**
- `-j, --json` 以 JSON 格式輸出（方便腳本整合）

### 2. `delete` - 互動式指令刪除 ⭐
以互動方式選擇並刪除指令，支援多種刪除選項。
```bash
node index.js delete
# 或舊用法
node delete.js
```

**功能：**
- 查看所有全域和公會指令
- 刪除單一指令（例如：`3`）
- 刪除多個指令（例如：`1,3,5`）
- 刪除範圍內的指令（例如：`1-10`）
- 刪除所有指令（輸入 `all`）
- 雙重確認保護機制
- **自動備份**刪除前的指令列表

### 3. `nuke` - 核彈選項 ⚠️
**警告：這將刪除所有指令！** 直接清空所有已註冊的指令。
```bash
node index.js nuke
# 或舊用法
node nuke.js
```

**新功能：**
- `-y, --yes` 跳過確認提示（自動化腳本用）
- `-g, --guild` 只清空公會指令
- `--global-only` 只清空全域指令
- **自動備份**刪除前的指令列表

## 需求

1. **Node.js** (v16.11.0 或更高版本)

## 設定

1. **安裝相依套件：**
```bash
npm install
```

2. **建立 `.env` 檔案：**
```env
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here

# 選填 - 用於公會專屬清理
# GUILD_ID=your_server_id_here
```

3. **取得你的憑證：**
   - **BOT_TOKEN**：Discord 開發者平台 → 你的應用程式 → Bot → Token
   - **CLIENT_ID**：Discord 開發者平台 → 你的應用程式 → General Information → Application ID
   - **GUILD_ID**：右鍵點擊你的 Discord 伺服器 → 複製伺服器 ID（選填）

## 使用範例

### 1. 檢查目前已註冊的指令：
```bash
node index.js check
```

JSON 輸出（方便腳本解析）：
```bash
node index.js check --json
```

### 2. 互動式刪除（推薦 ⭐）：
```bash
node index.js delete
```
然後按照提示操作：
- 選擇指令類型（全域/公會）
- 輸入刪除選項：
  - `all` - 刪除所有指令
  - `5` - 刪除第 5 個指令
  - `1,3,5` - 刪除第 1、3、5 個指令
  - `1-10` - 刪除第 1 到第 10 個指令

### 3. 核彈刪除（清空所有）：
```bash
# 有確認提示
node index.js nuke

# 跳過確認（自動化腳本用）
node index.js nuke --yes

# 只清空公會指令
node index.js nuke --yes --guild

# 只清空全域指令
node index.js nuke --yes --global-only
```

## 備份機制

執行 `delete` 和 `nuke` 時，工具會在 `backups/` 目錄自動儲存刪除前的指令列表，方便需要時手動還原。

備份檔案命名格式：
```
backups/backup-global-2025-01-15T10-30-00-000Z.json
backups/backup-guild-123456789-2025-01-15T10-30-00-000Z.json
```

## 專案結構

```
.
├── lib/
│   └── discord.js       # 共用 Discord REST 工具
├── src/
│   ├── check.js         # 檢查指令
│   ├── delete.js        # 互動式刪除
│   └── nuke.js          # 清空指令
├── index.js             # 統一 CLI 入口
├── check.js             # 舊用法相容 wrapper
├── delete.js            # 舊用法相容 wrapper
├── nuke.js              # 舊用法相容 wrapper
├── .env.example         # 環境變數範例
└── README.md            # 本文件
```

## 開發

```bash
# 檢查程式碼風格
npm run lint

# 自動修復風格問題
npm run lint:fix

# 格式化程式碼
npm run format
```

## 授權

MIT License

---

*Created by Lin_tsen • 2025*
