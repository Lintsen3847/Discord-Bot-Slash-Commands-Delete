// 相容性 wrapper：保留舊用法，內部轉接到新版模組
const { checkCommands } = require('./src/check');

const args = process.argv.slice(2);
const options = {
    json: args.includes('--json') || args.includes('-j')
};

checkCommands(options).catch(err => {
    console.error(err.message);
    process.exit(1);
});
