// 相容性 wrapper：保留舊用法，內部轉接到新版模組
const { deleteCommandsInteractive, deleteCommandsDirect } = require('./src/delete');

const args = process.argv.slice(2);
const options = {
    noBackup: args.includes('--no-backup'),
    yes: args.includes('--yes') || args.includes('-y'),
    all: args.includes('--all') || args.includes('-a')
};

const scopeIdx = args.findIndex(a => a === '--scope' || a === '-s');
if (scopeIdx !== -1 && args[scopeIdx + 1]) {
    options.scope = args[scopeIdx + 1];
}

const selectIdx = args.findIndex(a => a === '--select');
if (selectIdx !== -1 && args[selectIdx + 1]) {
    options.select = args[selectIdx + 1];
}

if (options.all || options.scope || options.select) {
    if (!options.scope) options.scope = 'global';
    if (!options.select) options.select = 'all';
    deleteCommandsDirect(options).catch(err => {
        console.error(err.message);
        process.exit(1);
    });
} else {
    deleteCommandsInteractive(options).catch(err => {
        console.error(err.message);
        process.exit(1);
    });
}
