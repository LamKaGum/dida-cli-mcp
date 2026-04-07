import chalk from 'chalk';
import { getApi } from '../lib/api.js';
import { formatJson, formatProjectRow, formatProjectView } from '../lib/output.js';
async function listProjects(options) {
    const api = await getApi();
    const projects = await api.getProjects();
    if (options.json) {
        console.log(formatJson(projects));
        return;
    }
    if (projects.length === 0) {
        console.log('未找到清单。');
        return;
    }
    for (const project of projects) {
        console.log(formatProjectRow(project));
    }
}
async function getProject(projectId, options) {
    const api = await getApi();
    const project = await api.getProject(projectId);
    if (options.json) {
        console.log(formatJson(project));
        return;
    }
    console.log(chalk.bold(project.name));
    console.log('');
    console.log(`ID:        ${project.id}`);
    if (project.color)
        console.log(`颜色:      ${project.color}`);
    if (project.viewMode)
        console.log(`视图:      ${project.viewMode}`);
    if (project.kind)
        console.log(`类型:      ${project.kind}`);
    if (project.groupId)
        console.log(`分组:      ${project.groupId}`);
    console.log(`已归档:    ${project.closed ? '是' : '否'}`);
}
async function getProjectData(projectId, options) {
    const api = await getApi();
    const data = await api.getProjectWithData(projectId);
    if (options.json) {
        console.log(formatJson(data));
        return;
    }
    console.log(formatProjectView(data));
}
async function createProject(options) {
    const api = await getApi();
    const project = await api.createProject({
        name: options.name,
        color: options.color,
        sortOrder: options.sortOrder ? parseInt(options.sortOrder, 10) : undefined,
        viewMode: options.viewMode,
        kind: options.kind,
    });
    if (options.json) {
        console.log(formatJson(project));
        return;
    }
    console.log(`${chalk.green('已创建:')} ${project.name}`);
    console.log(chalk.dim(`ID: ${project.id}`));
}
async function updateProject(projectId, options) {
    const api = await getApi();
    const project = await api.updateProject(projectId, {
        name: options.name,
        color: options.color,
        sortOrder: options.sortOrder ? parseInt(options.sortOrder, 10) : undefined,
        viewMode: options.viewMode,
        kind: options.kind,
    });
    if (options.json) {
        console.log(formatJson(project));
        return;
    }
    console.log(`${chalk.green('已更新:')} ${project.name}`);
}
async function deleteProject(projectId) {
    const api = await getApi();
    await api.deleteProject(projectId);
    console.log(chalk.green('清单已删除'));
}
export function registerProjectCommand(program) {
    const project = program.command('project').description('列出并管理清单');
    // GET /project
    project
        .command('list')
        .description('列出清单')
        .option('--json', '以 JSON 输出')
        .action(listProjects);
    // GET /project/{projectId}
    project
        .command('get <projectId>')
        .description('按 ID 获取清单')
        .option('--json', '以 JSON 输出')
        .action(getProject);
    // GET /project/{projectId}/data
    project
        .command('data <projectId>')
        .description('获取清单（含任务与分组）')
        .option('--json', '以 JSON 输出')
        .action(getProjectData);
    // POST /project
    project
        .command('create')
        .description('创建清单')
        .requiredOption('--name <name>', '清单名称')
        .option('--color <color>', '清单颜色（例如 "#F18181"）')
        .option('--sort-order <n>', '排序值')
        .option('--view-mode <mode>', '视图模式：list, kanban, timeline')
        .option('--kind <kind>', '清单类型：TASK, NOTE')
        .option('--json', '以 JSON 输出')
        .action(async (options) => {
        await createProject(options);
    });
    // POST /project/{projectId}
    project
        .command('update <projectId>')
        .description('更新清单字段')
        .option('--name <name>', '清单名称')
        .option('--color <color>', '清单颜色')
        .option('--sort-order <n>', '排序值')
        .option('--view-mode <mode>', '视图模式：list, kanban, timeline')
        .option('--kind <kind>', '清单类型：TASK, NOTE')
        .option('--json', '以 JSON 输出')
        .action(updateProject);
    // DELETE /project/{projectId}
    project
        .command('delete <projectId>')
        .description('删除清单')
        .action(deleteProject);
}
//# sourceMappingURL=project.js.map