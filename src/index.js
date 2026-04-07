#!/usr/bin/env node
import { program } from 'commander';
program
    .name('dida')
    .description('DIDA CLI – 在终端管理滴答清单的任务与清单')
    .version('0.1.3')
    .option('--json', '以 JSON 输出（全局默认，会传递给子命令）');
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
//# sourceMappingURL=index.js.map