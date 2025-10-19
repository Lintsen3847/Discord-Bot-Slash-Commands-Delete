# Discord 指令清理工具

一個簡單的工具程式，幫助 Discord 機器人開發者在遷移專案或重複使用 bot token 時，檢查和清理舊的斜線指令。

## 為什麼需要這個工具？

當你繼承一個 Discord bot token 或從一個專案遷移到另一個專案時，舊的斜線指令通常會保留在 Discord 的 API 中。這些「幽靈指令」可能會：
- 使你的機器人指令列表變得混亂
- 讓使用者感到困惑
- 與新指令產生衝突
- 難以手動移除

## 可用工具

### 1. `check.js` - 指令檢查器
查看目前在你的機器人上註冊的所有指令。
```bash
node check.js
```

### 2. `delete.js` - 互動式指令刪除 🆕
以互動方式選擇並刪除指令，支援多種刪除選項。
```bash
node delete.js
```

**功能：**
- 查看所有全域和公會指令
- 刪除單一指令（例如：`3`）
- 刪除多個指令（例如：`1,3,5`）
- 刪除範圍內的指令（例如：`1-10`）
- 刪除所有指令（輸入 `all`）
- 雙重確認保護機制

### 3. `nuke.js` - 核彈選項 ⚠️
**警告：這將刪除所有全域指令！** 使用 `rest.put()` 覆蓋所有現有指令，然後移除它們。
```bash
node nuke.js
```

**此腳本的作用：**
- 用 `oldCommandsToRegister` 陣列中的指令替換所有當前指令
- 然後刪除這些指令
- **結果：所有指令都會被移除**
- ⚠️ 請極度謹慎使用！

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
node check.js
```

### 2. 互動式刪除（推薦 ⭐）：
```bash
node delete.js
```
然後按照提示操作：
- 選擇指令類型（全域/公會）
- 輸入刪除選項：
  - `all` - 刪除所有指令
  - `5` - 刪除第 5 個指令
  - `1,3,5` - 刪除第 1、3、5 個指令
  - `1-10` - 刪除第 1 到第 10 個指令

### 3. 核彈刪除（刪除所有）：
⚠️ **警告：這會在沒有確認的情況下刪除所有全域指令！**
```bash
node nuke.js
```
只有在你想要完全清除所有指令時才使用此選項。

## 授權

MIT License

---

*Created by Lin_tsen • 2025/9/28*