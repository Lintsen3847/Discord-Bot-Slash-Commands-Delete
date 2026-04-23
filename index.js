#!/usr/bin/env node

const { program } = require('commander');
const { checkCommands } = require('./src/check');
const { deleteCommandsInteractive, deleteCommandsDirect } = require('./src/delete');
const { nukeCommands } = require('./src/nuke');

program
    .name('discord-command-cleanup')
    .description('Discord 斜線指令清理工具')
    .version('2.0.0');

program
    .command('check')
    .description('檢查目前已註冊的指令')
    .option('-j, --json', '以 JSON 格式輸出')
    .action(async (options) => {
        try {
            await checkCommands({ json: options.json });
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    });

program
    .command('delete')
    .description('互動式刪除指令（推薦）')
    .option('--no-backup', '跳過備份')
    .option('-a, --all', '非互動模式：刪除全部')
    .option('-s, --scope <type>', '非互動模式：指定範圍 (global|guild)', 'global')
    .option('--select <pattern>', '非互動模式：指定選擇 (all|1,3|1-5|3)', 'all')
    .option('-y, --yes', '非互動模式：跳過確認')
    .action(async (options) => {
        try {
            if (options.all) {
                await deleteCommandsDirect({
                    scope: options.scope,
                    select: options.select,
                    yes: options.yes,
                    noBackup: !options.backup
                });
            } else {
                await deleteCommandsInteractive({ noBackup: !options.backup });
            }
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    });

program
    .command('nuke')
    .description('⚠️ 清空所有指令')
    .option('-y, --yes', '跳過確認提示')
    .option('-g, --guild', '只清空公會指令')
    .option('--global-only', '只清空全域指令')
    .action(async (options) => {
        try {
            await nukeCommands({
                yes: options.yes,
                guildOnly: options.guild,
                globalOnly: options.globalOnly
            });
        } catch (err) {
            console.error(err.message);
            process.exit(1);
        }
    });

program.parse();
