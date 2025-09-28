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

### 2. `nuke.js` - Targeted Cleanup
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

### Check what's currently registered:
```bash
node check.js
```

### Remove specific old commands:
Edit the `oldCommandsToRemove` array in `nuke.js`, then:
```bash
node nuke.js
```

## License

MIT License - See LICENSE file for details

---

*Created by Lin_tsen • 2025/9/28*