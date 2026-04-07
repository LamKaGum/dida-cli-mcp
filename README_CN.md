# Dida CLI MCP Edition

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.1-blue" alt="version">
  <img src="https://img.shields.io/badge/node-%3E%3D18-green" alt="node">
  <img src="https://img.shields.io/badge/license-MIT-yellow" alt="license">
</p>

<p align="center">
  <b>滴答清单命令行工具 - MCP 扩展版</b><br>
  完整的 MCP 服务集成，支持任务提醒、批量操作、智能搜索
</p>

> **📌 基于 [suibiji/dida-cli](https://github.com/suibiji/dida-cli) 开发** - MCP 扩展版，完整支持提醒功能和批量操作

---

## ✨ 核心特性

- 🔔 **完整提醒支持** - 通过 MCP 服务实现任务提醒功能
- 🔍 **智能搜索** - 支持关键词搜索任务和清单
- 📦 **批量操作** - 一次性创建/更新多个任务
- ⏰ **快捷查询** - today/tomorrow/last7day 等时间快捷查询
- 🔗 **API 对等** - CLI 现已覆盖所有 MCP 服务接口
- 💯 **向后兼容** - 原有 Open API 功能完全保留

---

## 📦 安装

### 方式一：OpenClaw（一句话安装）

```bash
# 从源码安装技能 https://github.com/LamKaGum/dida-cli-mcp
clawhub install https://github.com/LamKaGum/dida-cli-mcp
```

或添加到 OpenClaw 技能：
```bash
# 从源码安装技能 https://github.com/LamKaGum/dida-cli-mcp
openclaw skills add dida-cli-mcp --from https://github.com/LamKaGum/dida-cli-mcp
```

### 方式二：NPM

```bash
npm install -g dida-cli-mcp
```

### 方式三：源码安装

```bash
git clone https://github.com/LamKaGum/dida-cli-mcp.git
cd dida-cli-mcp
npm install
npm link
```

### 验证安装

```bash
dida --version
dida --help
```

---

## 🔐 认证

使用 OAuth PKCE 流程登录：

```bash
# 启动登录流程（会自动打开浏览器）
dida auth login

# 查看登录状态
dida auth status

# 退出登录
dida auth logout
```

---

## 🚀 快速开始

### 创建带提醒的任务

```bash
# 创建今晚 21:00 的吃药提醒（提前 10 分钟提醒）
dida task create \
  --title "吃药" \
  --project "your-project-id" \
  --due-date "2026-04-07T21:00:00" \
  --reminders "600" \
  --content "记得按时吃药"
```

### 搜索任务

```bash
# 搜索包含"会议"的任务
dida task search 会议

# 通用搜索（任务+清单）
dida task find 吃药
```

### 查看今天的任务

```bash
# 查看今天未完成的任务
dida task undone --time-query today

# 查看未来 7 天的任务
dida task undone --time-query next7day
```

### 批量创建任务

```bash
# 简单 CSV 格式
dida task batch-create \
  --tasks "周一会议,周二评审,周三发布" \
  --project "your-project-id"

# JSON 格式（支持完整属性）
dida task batch-create \
  --tasks '[
    {"title": "早会", "dueDate": "2026-04-08T09:00:00", "reminders": ["TRIGGER:PT0S"]},
    {"title": "午餐", "dueDate": "2026-04-08T12:00:00", "reminders": ["TRIGGER:PT0S"]}
  ]' \
  --project "your-project-id"
```

---

## 📚 命令参考

### 认证命令

| 命令 | 说明 |
|------|------|
| `dida auth login` | OAuth 登录 |
| `dida auth status` | 查看登录状态 |
| `dida auth logout` | 退出登录 |

### 清单命令

| 命令 | 说明 | 示例 |
|------|------|------|
| `dida project list` | 列出所有清单 | `dida project list --json` |
| `dida project get <id>` | 获取清单详情 | `dida project get abc123` |
| `dida project data <id>` | 获取清单含任务 | `dida project data abc123` |
| `dida project create` | 创建清单 | `dida project create --name "新项目"` |
| `dida project update <id>` | 更新清单 | `dida project update abc123 --name "新名称"` |
| `dida project delete <id>` | 删除清单 | `dida project delete abc123` |

### 任务命令 - 基础

| 命令 | 说明 | 示例 |
|------|------|------|
| `dida task get <pid> <tid>` | 获取任务 | `dida task get proj123 task456` |
| `dida task create` | 创建任务 | [见下方](#创建任务) |
| `dida task update <tid>` | 更新任务 | [见下方](#更新任务) |
| `dida task complete <pid> <tid>` | 完成任务 | `dida task complete proj123 task456` |
| `dida task delete <pid> <tid>` | 删除任务 | `dida task delete proj123 task456` |
| `dida task move` | 移动任务 | [见下方](#移动任务) |
| `dida task completed` | 已完成任务 | `dida task completed --start-date "2026-04-01"` |
| `dida task filter` | 高级筛选 | `dida task filter --priority "5"` |

### 任务命令 - MCP 扩展（新增）

| 命令 | 说明 | 示例 |
|------|------|------|
| `dida task search <keywords>` | 搜索任务 | `dida task search 会议` |
| `dida task find <keywords>` | 通用搜索 | `dida task find 吃药` |
| `dida task undone` | 未完成任务 | [见下方](#未完成任务) |
| `dida task batch-create` | 批量创建 | [见下方](#批量创建) |
| `dida task batch-update` | 批量更新 | [见下方](#批量更新) |
| `dida task fetch <tid>` | 获取完整内容 | `dida task fetch task456` |
| `dida task get-by-id <tid>` | 通过 ID 获取 | `dida task get-by-id task456` |

---

## 📝 详细用法

### 创建任务

```bash
dida task create \
  --title "任务标题" \
  --project "project-id" \
  --content "任务内容描述" \
  --desc "清单描述" \
  --due-date "2026-04-07T21:00:00" \
  --reminders "600" \
  --priority 5 \
  --json
```

**参数说明：**

| 参数 | 说明 | 示例 |
|------|------|------|
| `--title` | **必填** 任务标题 | `"吃药"` |
| `--project` | **必填** 清单 ID | `"627f6bc0b56cd10920072820"` |
| `--content` | 任务内容 | `"记得按时吃药"` |
| `--desc` | 清单描述 | `"个人任务"` |
| `--due-date` | 截止时间（ISO 8601） | `"2026-04-07T21:00:00"` |
| `--reminders` | 提醒时间（秒） | `"0"`=准时, `"600"`=提前10分钟 |
| `--priority` | 优先级 | `0`=无, `1`=低, `3`=中, `5`=高 |
| `--json` | JSON 格式输出 | - |

**提醒时间格式：**

| 输入 | 含义 |
|------|------|
| `"0"` | 准时提醒 |
| `"300"` | 提前 5 分钟 |
| `"600"` | 提前 10 分钟 |
| `"900"` | 提前 15 分钟 |
| `"1800"` | 提前 30 分钟 |
| `"3600"` | 提前 1 小时 |

### 更新任务

```bash
dida task update "task-id" \
  --id "task-id" \
  --project "project-id" \
  --title "新标题" \
  --reminders "900"
```

### 移动任务

```bash
dida task move \
  --from "source-project-id" \
  --to "dest-project-id" \
  --task "task-id"
```

### 未完成任务

```bash
# 今天
dida task undone --time-query today

# 明天
dida task undone --time-query tomorrow

# 过去 24 小时
dida task undone --time-query last24hour

# 过去 7 天
dida task undone --time-query last7day

# 未来 24 小时
dida task undone --time-query next24hour

# 未来 7 天
dida task undone --time-query next7day

# 指定日期范围
dida task undone \
  --start-date "2026-04-01" \
  --end-date "2026-04-07"
```

### 批量创建

```bash
# CSV 格式（简单任务列表）
dida task batch-create \
  --tasks "任务1,任务2,任务3" \
  --project "project-id"

# JSON 格式（完整属性）
dida task batch-create \
  --tasks '[
    {
      "title": "早会",
      "projectId": "proj123",
      "dueDate": "2026-04-08T09:00:00",
      "reminders": ["TRIGGER:PT0S"],
      "priority": 3
    },
    {
      "title": "午餐",
      "projectId": "proj123",
      "dueDate": "2026-04-08T12:00:00"
    }
  ]' \
  --project "project-id"
```

### 批量更新

```bash
dida task batch-update \
  --tasks '[
    {"id": "task1", "title": "新标题1", "priority": 5},
    {"id": "task2", "title": "新标题2"}
  ]'
```

---

## 🔧 技术实现

### MCP 集成架构

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   CLI 命令   │────▶│  api.mcpRequest()  │────▶│  MCP 服务端点    │
└─────────────┘     └─────────────┘     │  mcp.dida365.com │
                                        └─────────────────┘
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │  JSON-RPC 2.0   │
                                        │  {              │
                                        │    jsonrpc,     │
                                        │    method,      │
                                        │    params       │
                                        │  }              │
                                        └─────────────────┘
```

### 修改的文件

| 文件 | 修改内容 | 行数变化 |
|------|----------|----------|
| `api.js` | 新增 MCP 请求方法、响应解析优化 | +120 行 |
| `task.js` | 新增 8 个 CLI 命令、错误处理 | +180 行 |

### 新增 API 方法

```javascript
// 搜索类
async searchTask(query)
async search(query)

// 查询类
async listUndoneTasksByDate(start, end)
async listUndoneTasksByTimeQuery(query)
async fetchTask(taskId)
async getTaskById(taskId)

// 批量操作类
async batchAddTasks(tasks)
async batchUpdateTasks(tasks)

// 其他
async getUserPreference()
async completeTasksInProject(pid, ids)
async getTaskInProject(pid, tid)
```

### 响应格式处理

MCP 服务返回两种格式，需兼容处理：

```javascript
// 优化后的解析逻辑
if (data.result?.structuredContent !== undefined) {
  return data.result.structuredContent;
}
if (data.result?.content?.[0]?.text) {
  return JSON.parse(data.result.content[0].text);
}
```

---

## 📊 功能对比

### 优化前后对比

| 功能类别 | 原 CLI | MCP 扩展版 | 变化 |
|----------|--------|------------|------|
| 总命令数 | 12 | 20 | +67% |
| reminders | ❌ | ✅ | 从无到有 |
| 搜索功能 | 0 | 2 | 新增 |
| 批量操作 | 0 | 2 | 新增 |
| 时间查询 | 0 | 1 | 新增 |
| 获取详情 | 0 | 2 | 新增 |
| API 方法数 | 15 | 26 | +73% |

### 新增命令列表

| 命令 | 功能 | MCP 工具 |
|------|------|----------|
| `task search` | 搜索任务 | `search_task` |
| `task find` | 通用搜索 | `search` |
| `task undone` | 未完成任务 | `list_undone_tasks_by_time_query` |
| `task batch-create` | 批量创建 | `batch_add_tasks` |
| `task batch-update` | 批量更新 | `batch_update_tasks` |
| `task fetch` | 获取完整内容 | `fetch` |
| `task get-by-id` | 通过 ID 获取 | `get_task_by_id` |

---

## 🎯 使用场景

### 场景 1：每日任务管理

```bash
# 查看今天任务
dida task undone --time-query today

# 创建今晚任务
dida task create \
  --title "学习 JavaScript" \
  --project "personal" \
  --due-date "2026-04-07T20:00:00" \
  --reminders "300"

# 完成任务
dida task complete "project-id" "task-id"
```

### 场景 2：批量任务创建

```bash
# 创建本周工作计划
dida task batch-create \
  --tasks "周一:需求评审,周二:代码开发,周三:测试用例,周四:Bug修复,周五:周报提交" \
  --project "work"
```

### 场景 3：任务搜索和整理

```bash
# 搜索包含"紧急"的任务
dida task search 紧急

# 找到后更新优先级
dida task update "task-id" \
  --id "task-id" \
  --project "project-id" \
  --priority 5
```

---

## ⚠️ 注意事项

1. **认证**：使用前必须通过 `dida auth login` 完成 OAuth 认证
2. **时区**：所有时间均为 UTC，程序会自动转换为用户时区
3. **批量操作**：`batch-create` 和 `batch-update` 有数量限制（通常 50-100 个）
4. **reminders**：需要使用 `--reminders` 参数，格式为秒数（如 `"600"` 表示提前 10 分钟）

---

## 🔮 路线图

- [ ] 将 Project 模块完全迁移到 MCP 服务
- [ ] 添加批量完成/删除功能
- [ ] 支持更多提醒选项（如重复提醒）
- [ ] 添加任务导入/导出功能（JSON/CSV）
- [ ] 支持 Webhook 订阅任务变更

---

## 🤝 贡献

欢迎提交 Issue 和 PR！

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

---

## 📄 许可证

[MIT](LICENSE) © 2026 LamKaGum

基于 [suibiji/dida-cli](https://github.com/suibiji/dida-cli) © 2024 suibiji

---

## 🙏 致谢

- [滴答清单](https://dida365.com) - 优秀的任务管理工具
- [suibiji](https://github.com/suibiji) - dida365 CLI 原作者

---

<p align="center">
  Made with ❤️ by the community
</p>
