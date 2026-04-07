import { getAccessToken } from './auth.js';
const BASE_URL = 'https://api.dida365.com/open/v1';
const MCP_URL = 'https://mcp.dida365.com';

class DidaApi {
    token;
    constructor(token) {
        this.token = token;
    }
    
    // --- Open API 请求方法 ---
    async request(path, options = {}) {
        const url = `${BASE_URL}${path}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`DIDA API 错误 ${response.status}: ${text}`);
        }
        const contentType = response.headers.get('content-type');
        if (contentType?.includes('application/json')) {
            return response.json();
        }
        return undefined;
    }
    
    // --- MCP 服务请求方法 ---
    async mcpRequest(toolName, arguments_) {
        // 转换 reminders 格式：从秒数到 iCalendar TRIGGER
        if (arguments_.task?.reminders) {
            arguments_.task.reminders = arguments_.task.reminders.map(r => {
                // 如果已经是 TRIGGER 格式，直接返回
                if (r.startsWith('TRIGGER')) return r;
                // 转换秒数为 iCalendar 格式
                const seconds = parseInt(r, 10);
                if (seconds === 0) {
                    return 'TRIGGER:PT0S';
                } else {
                    const minutes = Math.floor(seconds / 60);
                    const hours = Math.floor(minutes / 60);
                    const remainingMinutes = minutes % 60;
                    if (hours > 0) {
                        return `TRIGGER:-PT${hours}H${remainingMinutes > 0 ? remainingMinutes + 'M' : ''}`;
                    } else {
                        return `TRIGGER:-PT${minutes}M`;
                    }
                }
            });
        }
        
        const response = await fetch(MCP_URL, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                jsonrpc: '2.0',
                id: Date.now(),
                method: 'tools/call',
                params: {
                    name: toolName,
                    arguments: arguments_,
                },
            }),
        });
        
        if (!response.ok) {
            const text = await response.text();
            throw new Error(`MCP 错误 ${response.status}: ${text}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(`MCP 错误: ${data.error.message}`);
        }
        
        // MCP 返回格式: result.content[0].text 是 JSON 字符串
        // 或者 result.structuredContent 是解析后的对象
        if (data.result?.structuredContent !== undefined) {
            return data.result.structuredContent;
        }
        
        if (data.result?.content?.[0]?.text) {
            return JSON.parse(data.result.content[0].text);
        }
        
        return data.result;
    }
    
    // --- Task API (使用 MCP 服务支持 reminders) ---
    
    /** GET /open/v1/project/{projectId}/task/{taskId} */
    async getTask(projectId, taskId) {
        return this.request(`/project/${projectId}/task/${taskId}`);
    }
    
    /** POST /open/v1/task - 改用 MCP 服务 */
    async createTask(input) {
        // 使用 MCP 服务以支持 reminders
        return this.mcpRequest('create_task', { task: input });
    }
    
    /** POST /open/v1/task/{taskId} - 改用 MCP 服务 */
    async updateTask(taskId, input) {
        // 使用 MCP 服务以支持 reminders
        return this.mcpRequest('update_task', { 
            task_id: taskId,
            task: input 
        });
    }
    
    /** POST /open/v1/project/{projectId}/task/{taskId}/complete */
    async completeTask(projectId, taskId) {
        await this.request(`/project/${projectId}/task/${taskId}/complete`, {
            method: 'POST',
        });
    }
    
    /** DELETE /open/v1/project/{projectId}/task/{taskId} */
    async deleteTask(projectId, taskId) {
        await this.request(`/project/${projectId}/task/${taskId}`, {
            method: 'DELETE',
        });
    }
    
    /** POST /open/v1/task/move */
    async moveTasks(moves) {
        return this.request('/task/move', {
            method: 'POST',
            body: JSON.stringify(moves),
        });
    }
    
    /** POST /open/v1/task/completed */
    async getCompletedTasks(filter) {
        return this.request('/task/completed', {
            method: 'POST',
            body: JSON.stringify(filter),
        });
    }
    
    /** POST /open/v1/task/filter */
    async filterTasks(filter) {
        return this.request('/task/filter', {
            method: 'POST',
            body: JSON.stringify(filter),
        });
    }
    
    // --- MCP 独有功能 ---
    
    /** 搜索任务 */
    async searchTask(query) {
        return this.mcpRequest('search_task', { query });
    }
    
    /** 通用搜索 */
    async search(query) {
        return this.mcpRequest('search', { query });
    }
    
    /** 按日期范围列未完成任务 (最大14天) */
    async listUndoneTasksByDate(startDate, endDate) {
        return this.mcpRequest('list_undone_tasks_by_date', { startDate, endDate });
    }
    
    /** 按时间查询列未完成任务 
     * 支持: today, last24hour, last7day, tomorrow, next24hour, next7day
     */
    async listUndoneTasksByTimeQuery(timeQuery = 'today') {
        return this.mcpRequest('list_undone_tasks_by_time_query', { timeQuery });
    }
    
    /** 批量添加任务 */
    async batchAddTasks(tasks) {
        return this.mcpRequest('batch_add_tasks', { tasks });
    }
    
    /** 批量更新任务 */
    async batchUpdateTasks(tasks) {
        return this.mcpRequest('batch_update_tasks', { tasks });
    }
    
    /** 获取用户偏好设置 (时区等) */
    async getUserPreference() {
        return this.mcpRequest('get_user_preference', {});
    }
    
    /** 获取任务完整内容 */
    async fetchTask(taskId) {
        return this.mcpRequest('fetch', { id: taskId });
    }
    
    /** 通过ID获取任务详情 */
    async getTaskById(taskId) {
        return this.mcpRequest('get_task_by_id', { task_id: taskId });
    }
    
    /** 完成清单内多个任务 (最多20个) */
    async completeTasksInProject(projectId, taskIds) {
        return this.mcpRequest('complete_tasks_in_project', { 
            projectId, 
            taskIds 
        });
    }
    
    /** 通过清单和任务ID获取任务 */
    async getTaskInProject(projectId, taskId) {
        return this.mcpRequest('get_task_in_project', { 
            projectId, 
            taskId 
        });
    }
    
    // --- Project API ---
    
    /** GET /open/v1/project */
    async getProjects() {
        return this.request('/project');
    }
    
    /** GET /open/v1/project/{projectId} */
    async getProject(projectId) {
        return this.request(`/project/${projectId}`);
    }
    
    /** GET /open/v1/project/{projectId}/data */
    async getProjectWithData(projectId) {
        return this.request(`/project/${projectId}/data`);
    }
    
    /** POST /open/v1/project */
    async createProject(input) {
        return this.request('/project', {
            method: 'POST',
            body: JSON.stringify(input),
        });
    }
    
    /** POST /open/v1/project/{projectId} */
    async updateProject(projectId, input) {
        return this.request(`/project/${projectId}`, {
            method: 'POST',
            body: JSON.stringify(input),
        });
    }
    
    /** DELETE /open/v1/project/{projectId} */
    async deleteProject(projectId) {
        await this.request(`/project/${projectId}`, {
            method: 'DELETE',
        });
    }
}

let cachedApi = null;
export async function getApi() {
    if (cachedApi)
        return cachedApi;
    const token = await getAccessToken();
    cachedApi = new DidaApi(token);
    return cachedApi;
}

export { DidaApi };
//# sourceMappingURL=api.js.map
