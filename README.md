# Discord Command Cleanup Utilities

A collection of utility scripts to help Discord bot developers clean up old slash commands when migrating projects or reusing bot tokens.

## Why Do You Need This?

When you inherit a Discord bot token or migrate from one project to another, old slash commands often remain registered with Discord's API. These "ghost commands" can:
- Clutter your bot's command list
- Confuse users
- Cause conflicts with new commands
- Be difficult to remove manually

## Available Tools

### 1. `check-commands.js` - Command Inspector
See what commands are currently registered with your bot.
```bash
node check-commands.js
```

### 2. `clear-all-commands.js` - Nuclear Option
Remove ALL commands (global and guild) - use with caution!
```bash
node clear-all-commands.js
```

### 3. `register-and-remove.js` - Targeted Cleanup
Register specific old commands and immediately remove them (useful when you know exact command names).
```bash
node register-and-remove.js
```

### 4. `global-cleanup.js` - Comprehensive Global Cleanup
The most thorough option - ensures worldwide cleanup.
```bash
node global-cleanup.js
```

## Requirements

1. **Node.js** (v16.11.0 or higher)
2. **discord.js** (v14 or higher)
3. **dotenv** for environment variables

## Setup

1. **Install dependencies:**
```bash
npm install discord.js dotenv
```

2. **Create `.env` file:**
```env
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_bot_client_id_here

# Optional - for guild-specific cleanup
GUILD_ID=your_server_id_here
```

3. **Get your credentials:**
   - **BOT_TOKEN**: Discord Developer Portal → Your App → Bot → Token
   - **CLIENT_ID**: Discord Developer Portal → Your App → General Information → Application ID
   - **GUILD_ID**: Right-click your Discord server → Copy Server ID (optional)

## Usage Examples

### Check what's currently registered:
```bash
node check-commands.js
```

### Clean slate (remove everything):
```bash
node clear-all-commands.js
```

### Remove specific old commands:
Edit the `oldCommandsToRemove` array in `register-and-remove.js`, then:
```bash
node register-and-remove.js
```

## Safety Features

- **Confirmation prompts** before destructive actions
- **Backup functionality** to save command lists before deletion
- **Rollback capability** to restore commands if needed
- **Dry-run mode** to preview what will be deleted

## Important Notes

- **Global commands** take up to 1 hour to propagate worldwide
- **Guild commands** update instantly but only affect specific servers
- Always **test in a development server** first
- Keep your **BOT_TOKEN** secure and never commit it to version control

## Contributing

Found a bug? Have a feature request? Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - See LICENSE file for details

## Tips

- Use **GUILD_ID** for instant testing during development
- Remove **GUILD_ID** for global deployment in production
- Always run `check-commands.js` first to see what you're working with
- Consider using guild commands for testing new features

## Troubleshooting

**"Missing Access" Error**: Make sure your bot has the `applications.commands` scope  
**Commands not appearing**: Global commands take up to 1 hour to propagate  
**Permission denied**: Verify your BOT_TOKEN and CLIENT_ID are correct

---

Made with love for the Discord bot development community