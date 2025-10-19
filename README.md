# Discord Command Cleanup Tool

A simple utility to help Discord bot developers inspect and clean up old slash commands when migrating projects or reusing bot tokens.

## Why Do You Need This?

When you inherit a Discord bot token or migrate from one project to another, old slash commands often remain registered with Discord's API. These "ghost commands" can:
- Clutter your bot's command list
- Confuse users
- Cause conflicts with new commands
- Be difficult to remove manually

## Available Tools

### 1. `check.js` - Command Inspector
See what commands are currently registered with your bot.
```bash
node check.js
```

### 2. `delete.js` - Interactive Command Deletion 🆕
Interactively select and delete commands with multiple deletion options.
```bash
node delete.js
```

**Features:**
- View all global and guild commands
- Delete single command (e.g., `3`)
- Delete multiple commands (e.g., `1,3,5`)
- Delete range of commands (e.g., `1-10`)
- Delete all commands (type `all`)
- Safe with double confirmation

### 3. `nuke.js` - Targeted Cleanup
Register specific old commands and immediately remove them (useful when you know exact command names).
```bash
node nuke.js
```

## Requirements

1. **Node.js** (v16.11.0 or higher)

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create `.env` file:**
```env
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here

# Optional - for guild-specific cleanup
# GUILD_ID=your_server_id_here
```

3. **Get your credentials:**
   - **BOT_TOKEN**: Discord Developer Portal → Your App → Bot → Token
   - **CLIENT_ID**: Discord Developer Portal → Your App → General Information → Application ID
   - **GUILD_ID**: Right-click your Discord server → Copy Server ID (optional)

## Usage Examples

### 1. Check what's currently registered:
```bash
node check.js
```

### 2. Interactive deletion (Recommended):
```bash
node delete.js
```
Then follow the prompts:
- Choose command type (global/guild)
- Enter deletion option:
  - `all` - Delete all commands
  - `5` - Delete command #5
  - `1,3,5` - Delete commands #1, #3, and #5
  - `1-10` - Delete commands #1 through #10

### 3. Pre-configured deletion:
Edit the `oldCommandsToRemove` array in `nuke.js`, then:
```bash
node nuke.js
```

## License

MIT License

---

*Created by Lin_tsen • 2025/9/28*