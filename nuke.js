// 相容性 wrapper：保留舊用法，內部轉接到新版模組
const { nukeCommands } = require('./src/nuke');

const args = process.argv.slice(2);
const options = {
    yes: args.includes('--yes') || args.includes('-y'),
    guildOnly: args.includes('--guild') || args.includes('-g'),
    globalOnly: args.includes('--global') || args.includes('--global-only')
};

nukeCommands(options).catch(err => {
    console.error(err.message);
    process.exit(1);
});
