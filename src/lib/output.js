import chalk from 'chalk';
const PRIORITY_LABELS = {
    0: '无',
    1: '低',
    3: '中',
    5: '高',
};
const STATUS_LABELS = {
    0: '未完成',
    2: '已完成',
};
function priorityColor(priority) {
    switch (priority) {
        case 5:
            return chalk.red;
        case 3:
            return chalk.yellow;
        case 1:
            return chalk.blue;
        default:
            return chalk.dim;
    }
}
export function formatTaskRow(task) {
    const pColor = priorityColor(task.priority);
    const pLabel = PRIORITY_LABELS[task.priority] ?? String(task.priority);
    const status = task.status === 2 ? chalk.green('[完成]') : '';
    const due = task.dueDate ? chalk.dim(` 截止:${task.dueDate}`) : '';
    return `  ${chalk.dim(task.id)} ${pColor(`[${pLabel}]`)} ${task.title}${due} ${status}`.trimEnd();
}
export function formatTaskView(task) {
    const lines = [];
    lines.push(chalk.bold(task.title));
    lines.push('');
    lines.push(`ID:        ${task.id}`);
    lines.push(`清单:      ${task.projectId}`);
    lines.push(`优先级:    ${PRIORITY_LABELS[task.priority] ?? task.priority}`);
    lines.push(`状态:      ${STATUS_LABELS[task.status] ?? task.status}`);
    if (task.content)
        lines.push(`内容:      ${task.content}`);
    if (task.desc)
        lines.push(`描述:      ${task.desc}`);
    if (task.startDate)
        lines.push(`开始:      ${task.startDate}`);
    if (task.dueDate)
        lines.push(`截止:      ${task.dueDate}`);
    if (task.timeZone)
        lines.push(`时区:      ${task.timeZone}`);
    if (task.repeatFlag)
        lines.push(`重复:      ${task.repeatFlag}`);
    if (task.completedTime)
        lines.push(`完成时间:  ${task.completedTime}`);
    if (task.kind)
        lines.push(`类型:      ${task.kind}`);
    if (task.tags?.length)
        lines.push(`标签:      ${task.tags.join(', ')}`);
    if (task.reminders?.length)
        lines.push(`提醒:      ${task.reminders.join(', ')}`);
    if (task.items?.length) {
        lines.push('');
        lines.push(chalk.dim(`--- 子任务 (${task.items.length}) ---`));
        for (const item of task.items) {
            const check = item.status === 1 ? chalk.green('[x]') : '[ ]';
            lines.push(`  ${check} ${item.title}`);
        }
    }
    return lines.join('\n');
}
export function formatProjectRow(project) {
    const closed = project.closed ? chalk.dim(' [已归档]') : '';
    const color = project.color ? chalk.dim(` ${project.color}`) : '';
    return `  ${chalk.dim(project.id)} ${project.name}${color}${closed}`;
}
export function formatProjectView(data) {
    const { project, tasks, columns } = data;
    const lines = [];
    lines.push(chalk.bold(project.name));
    lines.push('');
    lines.push(`ID:        ${project.id}`);
    if (project.color)
        lines.push(`颜色:      ${project.color}`);
    if (project.viewMode)
        lines.push(`视图:      ${project.viewMode}`);
    if (project.kind)
        lines.push(`类型:      ${project.kind}`);
    if (project.groupId)
        lines.push(`分组:      ${project.groupId}`);
    lines.push(`已归档:    ${project.closed ? '是' : '否'}`);
    if (columns.length > 0) {
        lines.push('');
        lines.push(chalk.dim(`--- 分组 (${columns.length}) ---`));
        for (const col of columns) {
            lines.push(`  ${chalk.dim(col.id)} ${col.name}`);
        }
    }
    if (tasks.length > 0) {
        lines.push('');
        lines.push(chalk.dim(`--- 任务 (${tasks.length}) ---`));
        for (const task of tasks) {
            lines.push(formatTaskRow(task));
        }
    }
    return lines.join('\n');
}
export function formatJson(data) {
    return JSON.stringify(data, null, 2);
}
//# sourceMappingURL=output.js.map