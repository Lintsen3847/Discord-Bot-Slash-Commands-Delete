# Discord 指令清理工具

[English](README.en.md) | **繁體中文**

一個簡單的工具程式，幫助 Discord 機器人開發者在遷移專案或重複使用 bot token 時，檢查和清理舊的斜線指令。

## 為什麼需要這個工具？

當你繼承一個 Discord bot token 或從一個專案遷移到另一個專案時，舊的斜線指令通常會保留在 Discord 的 API 中。這些「幽靈指令」可能會：
- 使你的機器人指令列表變得混亂
- 讓使用者感到困惑
- 與新指令產生衝突
- 難以手動移除

## 快速開始

```bash
npm install
npm run check          # 檢查指令
npm run delete         # 互動式刪除（方向鍵選單）
npm run nuke -- --yes  # 一鍵清空全部
```

**更短指令：**
```bash
npm run c    # = check
npm run d    # = delete
npm run n    # = nuke
```

## 可用工具

### 1. `check` — 指令檢查器
```bash
npm run check
# 或
node index.js check
```

**選項：**
- `-j, --json` JSON 格式輸出

### 2. `delete` — 互動式刪除 ⭐

**新版 TUI 選單（推薦）：**
```bash
npm run delete
# 或
node index.js delete
```

用 **方向鍵 + 空格 + Enter** 操作：
1. 選擇「全域指令」或「公會指令」
2. 用 **空格** 勾選要刪的指令（或勾「⚠️ 全部刪除」）
3. 按 **Enter** 確認選擇
4. 最後按 **y / Enter** 確認刪除

**非互動模式（一鍵刪除）：**
```bash
# 刪除全部全域指令
node index.js delete --all --yes

# 刪除全部公會指令
node index.js delete --all --yes --scope guild

# 刪除指定範圍
node index.js delete --scope global --select 1,3,5 --yes
```

### 3. `nuke` — 核彈選項 ⚠️
```bash
npm run nuke -- --yes
# 或
node index.js nuke --yes
```

**選項：**
- `-y, --yes` 跳過確認
- `-g, --guild` 只清空公會指令
- `--global-only` 只清空全域指令

## 需求

- **Node.js** v16.11.0+

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

3. **取得憑證：**
   - **BOT_TOKEN**：Discord 開發者平台 → Bot → Token
   - **CLIENT_ID**：Discord 開發者平台 → General Information → Application ID
   - **GUILD_ID**：右鍵 Discord 伺服器 → 複製伺服器 ID

## 全域安裝（可選）

如果你不想每次都在專案目錄執行：

```bash
npm install -g .
# 之後在任何地方都能用：
discord-cleanup check
discord-cleanup delete --all --yes
discord-cleanup nuke --yes
```

## 備份機制

執行 `delete` 和 `nuke` 時，工具會自動在 `backups/` 目錄儲存刪除前的指令列表，方便需要時手動還原。

## 檔案結構

```
lib/discord.js       # 共用 Discord REST 工具
src/check.js         # 檢查指令
src/delete.js        # 互動式刪除（TUI 選單）
src/nuke.js          # 清空指令
index.js             # 統一 CLI 入口
check.js             # 舊用法 wrapper
delete.js            # 舊用法 wrapper
nuke.js              # 舊用法 wrapper
```

## 開發

```bash
npm run lint       # 檢查程式碼風格
npm run lint:fix   # 自動修復
npm run format     # 格式化
```

## 授權

MIT License

---

*Created by Lin_tsen • 2026*
