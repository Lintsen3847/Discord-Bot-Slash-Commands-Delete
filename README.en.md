# Discord Command Cleanup Tool

**English** | [繁體中文](README.zh-TW.md)

A simple utility to help Discord bot developers inspect and clean up old slash commands when migrating projects or reusing bot tokens.

## Why Do You Need This?

When you inherit a Discord bot token or migrate from one project to another, old slash commands often remain registered with Discord's API. These "ghost commands" can:
- Clutter your bot's command list
- Confuse users
- Cause conflicts with new commands
- Be difficult to remove manually

## Quick Start

```bash
npm install
npm run check          # Inspect commands
npm run delete         # Interactive deletion (arrow keys menu)
npm run nuke -- --yes  # One-click clear all
```

**Shorthand commands:**
```bash
npm run c    # = check
npm run d    # = delete
npm run n    # = nuke
```

## Available Tools

### 1. `check` — Command Inspector
```bash
npm run check
# or
node index.js check
```

**Options:**
- `-j, --json` Output in JSON format

### 2. `delete` — Interactive Command Deletion ⭐

**New TUI menu (recommended):**
```bash
npm run delete
# or
node index.js delete
```

Use **arrow keys + space + Enter**:
1. Choose "Global commands" or "Guild commands"
2. Press **space** to select commands to delete (or check "⚠️ Delete all")
3. Press **Enter** to confirm selection
4. Finally press **y / Enter** to confirm deletion

**Non-interactive mode (one-click):**
```bash
# Delete all global commands
node index.js delete --all --yes

# Delete all guild commands
node index.js delete --all --yes --scope guild

# Delete specific range
node index.js delete --scope global --select 1,3,5 --yes
```

### 3. `nuke` — Nuclear Option ⚠️
```bash
npm run nuke -- --yes
# or
node index.js nuke --yes
```

**Options:**
- `-y, --yes` Skip confirmation
- `-g, --guild` Clear guild commands only
- `--global-only` Clear global commands only

## Requirements

- **Node.js** v16.11.0+

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
   - **BOT_TOKEN**: Discord Developer Portal → Bot → Token
   - **CLIENT_ID**: Discord Developer Portal → General Information → Application ID
   - **GUILD_ID**: Right-click Discord server → Copy Server ID

## Global Installation (Optional)

If you don't want to run inside the project directory every time:

```bash
npm install -g .
# Then use anywhere:
discord-cleanup check
discord-cleanup delete --all --yes
discord-cleanup nuke --yes
```

## Backup Mechanism

When running `delete` and `nuke`, the tool automatically saves a backup of the current commands to the `backups/` directory before deletion, allowing manual restoration if needed.

## File Structure

```
lib/discord.js       # Shared Discord REST utilities
src/check.js         # Inspect commands
src/delete.js        # Interactive deletion (TUI menu)
src/nuke.js          # Clear all commands
index.js             # Unified CLI entry
check.js             # Legacy wrapper
delete.js            # Legacy wrapper
nuke.js              # Legacy wrapper
```

## Development

```bash
npm run lint       # Check code style
npm run lint:fix   # Auto fix
npm run format     # Format code
```

## License

MIT License

---

*Created by Lin_tsen • 2026*
