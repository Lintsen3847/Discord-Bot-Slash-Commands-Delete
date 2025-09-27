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
2. **discord.js** (v14 or higher)
3. **dotenv** for environment variables

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

## Features

- **Command inspection** - View all currently registered commands
- **Targeted removal** - Remove specific commands by name
- **Safe operation** - No bulk deletion, only removes commands you specify

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

## Workflow

1. **First, inspect your commands**: Run `check.js` to see what's currently registered
2. **Identify unwanted commands**: Note the names of commands you want to remove
3. **Edit the removal script**: Update the `oldCommandsToRemove` array in `nuke.js`
4. **Execute cleanup**: Run `nuke.js` to remove the specified commands

## Tips

- Use **GUILD_ID** for instant testing during development
- Remove **GUILD_ID** for global deployment in production
- Always run `check.js` first to see what you're working with

## Troubleshooting

**"Missing Access" Error**: Make sure your bot has the `applications.commands` scope  
**Commands not appearing**: Global commands take up to 1 hour to propagate  
**Permission denied**: Verify your BOT_TOKEN and CLIENT_ID are correct

---

Made with love for the Discord bot development community