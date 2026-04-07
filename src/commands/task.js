import chalk from 'chalk';
import { getApi } from '../lib/api.js';
import { formatJson, formatTaskRow, formatTaskView } from '../lib/output.js';
function parseItems(raw) {
    try {
        return JSON.parse(raw);
    }
    catch {
        return raw.split(',').map((title) => ({ title: title.trim(), status: 0 }));
    }
}
function parseNumberList(raw) {
    return raw.split(',').map((s) => parseInt(s.trim(), 10));
}
function parseStringList(raw) {
    return raw.split(',').map((s) => s.trim());
}
async function getTask(projectId, taskId, options) {
    const api = await getApi();
    const task = await api.getTask(projectId, taskId);
    if (options.json) {
        console.log(formatJson(task));
        return;
    }
    console.log(formatTaskView(task));
}
async function createTask(options) {
    const api = await getApi();
    const task = await api.createTask({
        title: options.title,
        projectId: options.project,
        content: options.content,
        desc: options.desc,
        isAllDay: options.allDay,
        startDate: options.startDate,
        dueDate: options.dueDate,
        timeZone: options.timeZone,
        reminders: options.reminders ? parseStringList(options.reminders) : undefined,
        repeatFlag: options.repeat,
        priority: options.priority ? parseInt(options.priority, 10) : undefined,
        sortOrder: options.sortOrder ? parseInt(options.sortOrder, 10) : undefined,
        items: options.items ? parseItems(options.items) : undefined,
    });
    if (options.json) {
        console.log(formatJson(task));
        return;
    }
    console.log(`${chalk.green('已创建:')} ${task.title}`);
    console.log(chalk.dim(`ID: ${task.id}`));
}
async function updateTask(taskId, options) {
    const api = await getApi();
    const task = await api.updateTask(taskId, {
        id: options.id,
        projectId: options.project,
        title: options.title,
        content: options.content,
        desc: options.desc,
        isAllDay: options.allDay,
        startDate: options.startDate,
        dueDate: options.dueDate,
        timeZone: options.timeZone,
        reminders: options.reminders ? parseStringList(options.reminders) : undefined,
        repeatFlag: options.repeat,
        priority: options.priority ? parseInt(options.priority, 10) : undefined,
        sortOrder: options.sortOrder ? parseInt(options.sortOrder, 10) : undefined,
        items: options.items ? parseItems(options.items) : undefined,
    });
    if (options.json) {
        console.log(formatJson(task));
        return;
    }
    console.log(`${chalk.green('已更新:')} ${task.title}`);
}
async function completeTask(projectId, taskId) {
    const api = await getApi();
    await api.completeTask(projectId, taskId);
    console.log(chalk.green('任务已完成'));
}
async function deleteTask(projectId, taskId) {
    const api = await getApi();
    await api.deleteTask(projectId, taskId);
    console.log(chalk.green('任务已删除'));
}
async function moveTasks(options) {
    if (options.from.length !== options.to.length || options.from.length !== options.task.length) {
        throw new Error('--from、--to、--task 的数量必须一致');
    }
    const moves = options.from.map((fromProjectId, i) => ({
        fromProjectId,
        toProjectId: options.to[i],
        taskId: options.task[i],
    }));
    const api = await getApi();
    const results = await api.moveTasks(moves);
    if (options.json) {
        console.log(formatJson(results));
        return;
    }
    for (const r of results) {
        console.log(`${chalk.green('已移动:')} ${r.id}`);
    }
}
async function listCompleted(options) {
    const api = await getApi();
    const tasks = await api.getCompletedTasks({
        projectIds: options.projects ? parseStringList(options.projects) : undefined,
        startDate: options.startDate,
        endDate: options.endDate,
    });
    if (options.json) {
        console.log(formatJson(tasks));
        return;
    }
    if (tasks.length === 0) {
        console.log('未找到已完成任务。');
        return;
    }
    for (const task of tasks) {
        console.log(formatTaskRow(task));
    }
}
async function filterTasksCmd(options) {
    const api = await getApi();
    const tasks = await api.filterTasks({
        projectIds: options.projects ? parseStringList(options.projects) : undefined,
        startDate: options.startDate,
        endDate: options.endDate,
        priority: options.priority ? parseNumberList(options.priority) : undefined,
        tag: options.tag ? parseStringList(options.tag) : undefined,
        status: options.status ? parseNumberList(options.status) : undefined,
    });
    if (options.json) {
        console.log(formatJson(tasks));
        return;
    }
    if (tasks.length === 0) {
        console.log('没有任务符合筛选条件。');
        return;
    }
    for (const task of tasks) {
        console.log(formatTaskRow(task));
    }
}

// --- MCP 独有功能 ---

async function searchTaskCmd(keywords, options) {
    const api = await getApi();
    const result = await api.searchTask(keywords);
    
    // 处理错误响应
    if (result?.error || result?.content?.[0]?.text?.startsWith('Error')) {
        console.log(chalk.red('搜索失败:'), result?.error || result?.content?.[0]?.text);
        return;
    }
    
    const tasks = Array.isArray(result) ? result : (result?.result || []);
    
    if (options.json) {
        console.log(JSON.stringify(tasks, null, 2));
        return;
    }
    
    if (!tasks || tasks.length === 0) {
        console.log('未找到匹配的任务。');
        return;
    }
    
    console.log(chalk.bold(`找到 ${tasks.length} 个结果:`));
    console.log();
    for (const item of tasks) {
        console.log(`  ${chalk.dim(item.taskId || item.id)} ${item.title}`);
        if (item.url) console.log(`  ${chalk.dim(item.url)}`);
        console.log();
    }
}

async function searchCmd(keywords, options) {
    const api = await getApi();
    const result = await api.search(keywords);
    
    // 处理错误响应
    if (result?.error || result?.content?.[0]?.text?.startsWith('Error')) {
        console.log(chalk.red('搜索失败:'), result?.error || result?.content?.[0]?.text);
        return;
    }
    
    const items = Array.isArray(result) ? result : (result?.result || []);
    
    if (options.json) {
        console.log(JSON.stringify(items, null, 2));
        return;
    }
    
    if (!items || items.length === 0) {
        console.log('未找到匹配的结果。');
        return;
    }
    
    console.log(chalk.bold(`找到 ${items.length} 个结果:`));
    console.log();
    for (const item of items) {
        console.log(`  ${chalk.dim(item.id)} ${item.title}`);
        if (item.url) console.log(`  ${chalk.dim(item.url)}`);
        console.log();
    }
}

async function listUndone(options) {
    const api = await getApi();
    let result;
    
    if (options.timeQuery) {
        // 使用时间快捷查询
        result = await api.listUndoneTasksByTimeQuery(options.timeQuery);
    } else if (options.startDate && options.endDate) {
        // 使用日期范围查询
        result = await api.listUndoneTasksByDate(options.startDate, options.endDate);
    } else {
        // 默认查询今天
        result = await api.listUndoneTasksByTimeQuery('today');
    }
    
    // MCP 返回的是 { result: [...] } 格式
    const tasks = Array.isArray(result) ? result : (result?.result || []);
    
    if (options.json) {
        console.log(JSON.stringify(tasks, null, 2));
        return;
    }
    
    if (!tasks || tasks.length === 0) {
        console.log('未找到未完成任务。');
        return;
    }
    
    console.log(chalk.bold(`未完成任务 (${tasks.length}):`));
    console.log();
    for (const task of tasks) {
        console.log(formatTaskRow(task));
    }
}

async function batchCreate(options) {
    const api = await getApi();
    
    // 读取任务列表，支持 JSON 或 CSV 格式
    let tasks;
    try {
        tasks = JSON.parse(options.tasks);
    } catch {
        // 尝试解析 CSV 格式: "title1,title2,title3"
        tasks = options.tasks.split(',').map(title => ({
            title: title.trim(),
            projectId: options.project
        }));
    }
    
    const result = await api.batchAddTasks(tasks);
    if (options.json) {
        console.log(formatJson(result));
        return;
    }
    console.log(chalk.green(`已批量创建 ${tasks.length} 个任务`));
}

async function batchUpdate(options) {
    const api = await getApi();
    
    let tasks;
    try {
        tasks = JSON.parse(options.tasks);
    } catch {
        throw new Error('任务列表必须是 JSON 数组格式');
    }
    
    const result = await api.batchUpdateTasks(tasks);
    if (options.json) {
        console.log(formatJson(result));
        return;
    }
        console.log(chalk.green(`已批量更新 ${tasks.length} 个任务`));
}

async function fetchTask(taskId, options) {
    const api = await getApi();
    const result = await api.fetchTask(taskId);
    
    // 处理错误响应
    if (result?.error || (typeof result?.content?.[0]?.text === 'string' && result.content[0].text.startsWith('Error'))) {
        console.log(chalk.red('获取失败:'), result?.error || result?.content?.[0]?.text);
        return;
    }
    
    // fetch 返回的格式不同，使用 result 字段
    const task = result?.result || result;
    
    if (options.json) {
        console.log(JSON.stringify(task, null, 2));
        return;
    }
    
    // 自定义输出格式，因为 fetch 返回的格式不同
    console.log(chalk.bold(task.title));
    console.log();
    console.log(`ID:        ${task.id}`);
    console.log(`内容:      ${task.text || task.content}`);
    console.log(`URL:       ${task.url}`);
    if (task.metadata) {
        console.log(`清单:      ${task.metadata.project_id}`);
        console.log(`状态:      ${task.metadata.status === 0 ? '未完成' : '已完成'}`);
        console.log(`时区:      ${task.metadata.timezone}`);
        console.log(`截止时间:  ${task.metadata.due_date}`);
    }
}

async function getTaskByIdCmd(taskId, options) {
    const api = await getApi();
    const task = await api.getTaskById(taskId);
    if (options.json) {
        console.log(formatJson(task));
        return;
    }
    console.log(formatTaskView(task));
}

export function registerTaskCommand(program) {
    const task = program.command('task').description('创建、更新与查询任务');
    // GET /project/{projectId}/task/{taskId}
    task
        .command('get <projectId> <taskId>')
        .description('按清单与任务 ID 获取任务')
        .option('--json', '以 JSON 输出')
        .action(getTask);
    // POST /task
    task
        .command('create')
        .description('创建任务')
        .requiredOption('--title <title>', '任务标题')
        .requiredOption('--project <projectId>', '清单 ID')
        .option('--content <content>', '任务内容')
        .option('--desc <desc>', '清单描述')
        .option('--all-day', '全天任务')
        .option('--start-date <date>', '开始时间（yyyy-MM-ddTHH:mm:ssZ）')
        .option('--due-date <date>', '截止时间（yyyy-MM-ddTHH:mm:ssZ）')
        .option('--time-zone <tz>', '时区')
        .option('--reminders <triggers>', '提醒触发器（逗号分隔）')
        .option('--repeat <rule>', '重复规则（RRULE 格式）')
        .option('--priority <n>', '优先级：0=无，1=低，3=中，5=高')
        .option('--sort-order <n>', '排序值')
        .option('--items <json|csv>', '子任务：JSON 数组或逗号分隔标题')
        .option('--json', '以 JSON 输出')
        .action(async (options) => {
        await createTask(options);
    });
    // POST /task/{taskId}
    task
        .command('update <taskId>')
        .description('更新任务')
        .requiredOption('--id <id>', '任务 ID（body 中必填）')
        .requiredOption('--project <projectId>', '清单 ID')
        .option('--title <title>', '任务标题')
        .option('--content <content>', '任务内容')
        .option('--desc <desc>', '清单描述')
        .option('--all-day', '全天任务')
        .option('--start-date <date>', '开始时间（yyyy-MM-ddTHH:mm:ssZ）')
        .option('--due-date <date>', '截止时间（yyyy-MM-ddTHH:mm:ssZ）')
        .option('--time-zone <tz>', '时区')
        .option('--reminders <triggers>', '提醒触发器（逗号分隔）')
        .option('--repeat <rule>', '重复规则（RRULE 格式）')
        .option('--priority <n>', '优先级：0=无，1=低，3=中，5=高')
        .option('--sort-order <n>', '排序值')
        .option('--items <json|csv>', '子任务：JSON 数组或逗号分隔标题')
        .option('--json', '以 JSON 输出')
        .action(updateTask);
    // POST /project/{projectId}/task/{taskId}/complete
    task
        .command('complete <projectId> <taskId>')
        .description('完成任务')
        .action(completeTask);
    // DELETE /project/{projectId}/task/{taskId}
    task
        .command('delete <projectId> <taskId>')
        .description('删除任务')
        .action(deleteTask);
    // POST /task/move
    task
        .command('move')
        .description('在清单间移动任务')
        .requiredOption('--from <projectId...>', '源清单 ID（可多次指定）')
        .requiredOption('--to <projectId...>', '目标清单 ID（可多次指定）')
        .requiredOption('--task <taskId...>', '要移动的任务 ID（可多次指定）')
        .option('--json', '以 JSON 输出')
        .action(moveTasks);
    // POST /task/completed
    task
        .command('completed')
        .description('列出已完成任务')
        .option('--projects <ids>', '清单 ID（逗号分隔）')
        .option('--start-date <date>', '开始时间过滤（yyyy-MM-ddTHH:mm:ssZ）')
        .option('--end-date <date>', '结束时间过滤（yyyy-MM-ddTHH:mm:ssZ）')
        .option('--json', '以 JSON 输出')
        .action(listCompleted);
    // POST /task/filter
    task
        .command('filter')
        .description('按高级条件筛选任务')
        .option('--projects <ids>', '清单 ID（逗号分隔）')
        .option('--start-date <date>', '按开始时间过滤')
        .option('--end-date <date>', '按结束时间过滤')
        .option('--priority <levels>', '优先级（逗号分隔：0,1,3,5）')
        .option('--tag <tags>', '标签（逗号分隔）')
        .option('--status <codes>', '状态（逗号分隔：0=未完成，2=已完成）')
        .option('--json', '以 JSON 输出')
        .action(filterTasksCmd);
    
    // --- MCP 独有命令 ---
    
    // search_task
    task
        .command('search <keywords>')
        .description('搜索任务（MCP）')
        .option('--json', '以 JSON 输出')
        .action(searchTaskCmd);
    
    // search
    task
        .command('find <keywords>')
        .description('通用搜索（MCP）')
        .option('--json', '以 JSON 输出')
        .action(searchCmd);
    
    // list_undone_tasks
    task
        .command('undone')
        .description('列出未完成任务（MCP）')
        .option('--time-query <query>', '时间查询：today/tomorrow/last24hour/last7day/next24hour/next7day')
        .option('--start-date <date>', '开始日期（yyyy-MM-dd）')
        .option('--end-date <date>', '结束日期（yyyy-MM-dd）')
        .option('--json', '以 JSON 输出')
        .action(listUndone);
    
    // batch_add_tasks
    task
        .command('batch-create')
        .description('批量创建任务（MCP）')
        .requiredOption('--tasks <tasks>', '任务列表（JSON 数组或逗号分隔的标题）')
        .option('--project <projectId>', '默认清单 ID')
        .option('--json', '以 JSON 输出')
        .action(batchCreate);
    
    // batch_update_tasks
    task
        .command('batch-update')
        .description('批量更新任务（MCP）')
        .requiredOption('--tasks <tasks>', '任务列表（JSON 数组）')
        .option('--json', '以 JSON 输出')
        .action(batchUpdate);
    
    // fetch
    task
        .command('fetch <taskId>')
        .description('获取任务完整内容（MCP）')
        .option('--json', '以 JSON 输出')
        .action(fetchTask);
    
    // get_task_by_id
    task
        .command('get-by-id <taskId>')
        .description('通过 ID 获取任务详情（MCP）')
        .option('--json', '以 JSON 输出')
        .action(getTaskByIdCmd);
}
//# sourceMappingURL=task.js.map