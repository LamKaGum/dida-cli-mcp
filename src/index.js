#!/usr/bin/env node
import { program } from 'commander';
import chalk from 'chalk';
import { getAccessToken } from './lib/auth.js';

program
    .name('dida')
    .description('DIDA CLI – 在终端管理滴答清单的任务与清单')
    .version('0.1.1')
    .option('--json', '以 JSON 输出（全局默认，会传递给子命令）');

// 帮助指令 - 显示所有功能
program
    .command('help')
    .description('显示所有功能和用法')
    .action(async () => {
        console.log(chalk.cyan('\n📚 dida-cli-mcp 使用指南\n'));
        
        console.log(chalk.yellow('🔐 认证相关:'));
        console.log('  dida auth login        登录（支持 OAuth 或 Token）');
        console.log('  dida auth login --token  使用 Token 方式登录（服务器）');
        console.log('  dida auth status       查看登录状态');
        console.log('  dida auth logout       退出登录\n');
        
        console.log(chalk.yellow('📋 任务管理:'));
        console.log('  dida task list         列出所有任务');
        console.log('  dida task get <id>     查看任务详情');
        console.log('  dida task create       创建新任务');
        console.log('  dida task update       更新任务');
        console.log('  dida task complete     完成任务');
        console.log('  dida task delete       删除任务\n');
        
        console.log(chalk.yellow('📁 清单管理:'));
        console.log('  dida project list      列出所有清单');
        console.log('  dida project create    创建新清单');
        console.log('  dida project update    更新清单');
        console.log('  dida project delete    删除清单\n');
        
        console.log(chalk.yellow('⚡ 快捷命令:'));
        console.log('  dida --version         显示版本号');
        console.log('  dida help              显示此帮助信息\n');
        
        console.log(chalk.yellow('💡 使用示例:'));
        console.log('  # 创建带提醒的任务');
        console.log('  dida task create "参加会议" --due "2024-01-15 14:00" --reminder 600');
        console.log('');
        console.log('  # 批量完成任务');
        console.log('  dida task complete task1,task2,task3');
        console.log('');
        console.log('  # 查看今天到期的任务');
        console.log('  dida task list --due today\n');
        
        // 检查登录状态
        try {
            await getAccessToken();
            console.log(chalk.green('✓ 当前已登录'));
        } catch {
            console.log(chalk.yellow('⚠ 当前未登录，运行 `dida auth login` 开始'));
        }
    });

const commands = {
    auth: [
        'OAuth 登录与 token 存储',
        async () => (await import('./commands/auth.js')).registerAuthCommand,
    ],
    task: [
        '创建、更新与查询任务',
        async () => (await import('./commands/task.js')).registerTaskCommand,
    ],
    project: [
        '列出并管理清单',
        async () => (await import('./commands/project.js')).registerProjectCommand,
    ],
};

for (const [name, [description]] of Object.entries(commands)) {
    program.command(name).description(description);
}

const commandName = process.argv.slice(2).find((a) => !a.startsWith('-') && a in commands);
if (commandName && commands[commandName]) {
    const idx = program.commands.findIndex((c) => c.name() === commandName);
    if (idx !== -1)
        program.commands.splice(idx, 1);
    const loader = commands[commandName][1];
    const register = await loader();
    register(program);
}

program
    .parseAsync()
    .catch((err) => {
    console.error(err.message);
    process.exit(1);
});
