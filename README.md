# Dida CLI MCP Edition

<p align="center">
  <img src="https://img.shields.io/badge/version-0.1.1-blue" alt="version">
  <img src="https://img.shields.io/badge/node-%3E%3D18-green" alt="node">
  <img src="https://img.shields.io/badge/license-MIT-yellow" alt="license">
</p>

<p align="center">
  <b>TickTick Command Line Tool - MCP Extended Edition</b><br>
  Complete MCP service integration with task reminders, batch operations, and smart search
</p>

[中文](README_CN.md) | **English**

---

## ✨ Key Features

- 🔔 **Full Reminder Support** - Task reminders through MCP service
- 🔍 **Smart Search** - Search tasks and projects by keywords
- 📦 **Batch Operations** - Create/update multiple tasks at once
- ⏰ **Quick Queries** - today/tomorrow/last7day shortcuts
- 🔗 **API Parity** - CLI covers all MCP service interfaces
- 💯 **Backward Compatible** - Original Open API features preserved

---

## 📦 Installation

### Option 1: OpenClaw (One-line install)

```bash
# Install skill from source https://github.com/LamKaGum/dida-cli-mcp
clawhub install https://github.com/LamKaGum/dida-cli-mcp
```

Or add to your OpenClaw skills:
```bash
# Install skill from source https://github.com/LamKaGum/dida-cli-mcp
openclaw skills add dida-cli-mcp --from https://github.com/LamKaGum/dida-cli-mcp
```

### Option 2: NPM

```bash
npm install -g dida-cli-mcp
```

### Option 3: From Source

```bash
git clone https://github.com/LamKaGum/dida-cli-mcp.git
cd dida-cli-mcp
npm install
npm link
```

### Verify Installation

```bash
dida --version
dida --help
```

---

## 🔐 Authentication

Login using OAuth PKCE flow:

```bash
# Start login flow (opens browser automatically)
dida auth login

# Check login status
dida auth status

# Logout
dida auth logout
```

---

## 🚀 Quick Start

### Create Task with Reminder

```bash
# Create a medicine reminder for 21:00 tonight (10 min early reminder)
dida task create \
  --title "Take Medicine" \
  --project "your-project-id" \
  --due-date "2026-04-07T21:00:00" \
  --reminders "600" \
  --content "Remember to take your medicine on time"
```

### Search Tasks

```bash
# Search tasks containing "meeting"
dida task search meeting

# Universal search (tasks + projects)
dida task find medicine
```

### View Today's Tasks

```bash
# View incomplete tasks for today
dida task undone --time-query today

# View tasks for next 7 days
dida task undone --time-query next7day
```

### Batch Create Tasks

```bash
# Simple CSV format
dida task batch-create \
  --tasks "Meeting Monday,Review Tuesday,Release Wednesday" \
  --project "your-project-id"

# JSON format (full attributes)
dida task batch-create \
  --tasks '[
    {"title": "Morning Standup", "dueDate": "2026-04-08T09:00:00", "reminders": ["TRIGGER:PT0S"]},
    {"title": "Lunch Break", "dueDate": "2026-04-08T12:00:00", "reminders": ["TRIGGER:PT0S"]}
  ]' \
  --project "your-project-id"
```

---

## 📚 Command Reference

### Authentication Commands

| Command | Description |
|---------|-------------|
| `dida auth login` | OAuth login |
| `dida auth status` | Check login status |
| `dida auth logout` | Logout |

### Project Commands

| Command | Description | Example |
|---------|-------------|---------|
| `dida project list` | List all projects | `dida project list --json` |
| `dida project get <id>` | Get project details | `dida project get abc123` |
| `dida project data <id>` | Get project with tasks | `dida project data abc123` |
| `dida project create` | Create project | `dida project create --name "New Project"` |
| `dida project update <id>` | Update project | `dida project update abc123 --name "New Name"` |
| `dida project delete <id>` | Delete project | `dida project delete abc123` |

### Task Commands - Basic

| Command | Description | Example |
|---------|-------------|---------|
| `dida task get <pid> <tid>` | Get task | `dida task get proj123 task456` |
| `dida task create` | Create task | [See below](#creating-tasks) |
| `dida task update <tid>` | Update task | [See below](#updating-tasks) |
| `dida task complete <pid> <tid>` | Complete task | `dida task complete proj123 task456` |
| `dida task delete <pid> <tid>` | Delete task | `dida task delete proj123 task456` |
| `dida task move` | Move task | [See below](#moving-tasks) |
| `dida task completed` | List completed | `dida task completed --start-date "2026-04-01"` |
| `dida task filter` | Advanced filter | `dida task filter --priority "5"` |

### Task Commands - MCP Extensions (New)

| Command | Description | Example |
|---------|-------------|---------|
| `dida task search <keywords>` | Search tasks | `dida task search meeting` |
| `dida task find <keywords>` | Universal search | `dida task find medicine` |
| `dida task undone` | Incomplete tasks | [See below](#incomplete-tasks) |
| `dida task batch-create` | Batch create | [See below](#batch-creation) |
| `dida task batch-update` | Batch update | [See below](#batch-update) |
| `dida task fetch <tid>` | Get full content | `dida task fetch task456` |
| `dida task get-by-id <tid>` | Get by ID | `dida task get-by-id task456` |

---

## 📝 Detailed Usage

### Creating Tasks

```bash
dida task create \
  --title "Task Title" \
  --project "project-id" \
  --content "Task description" \
  --desc "Project description" \
  --due-date "2026-04-07T21:00:00" \
  --reminders "600" \
  --priority 5 \
  --json
```

**Parameters:**

| Parameter | Description | Example |
|-----------|-------------|---------|
| `--title` | **Required** Task title | `"Take Medicine"` |
| `--project` | **Required** Project ID | `"627f6bc0b56cd10920072820"` |
| `--content` | Task content | `"Remember to take your medicine"` |
| `--desc` | Project description | `"Personal Tasks"` |
| `--due-date` | Due date (ISO 8601) | `"2026-04-07T21:00:00"` |
| `--reminders` | Reminder time (seconds) | `"0"`=on time, `"600"`=10 min early |
| `--priority` | Priority | `0`=none, `1`=low, `3`=medium, `5`=high |
| `--json` | JSON output format | - |

**Reminder Time Format:**

| Input | Meaning |
|-------|---------|
| `"0"` | On time |
| `"300"` | 5 minutes early |
| `"600"` | 10 minutes early |
| `"900"` | 15 minutes early |
| `"1800"` | 30 minutes early |
| `"3600"` | 1 hour early |

### Updating Tasks

```bash
dida task update "task-id" \
  --id "task-id" \
  --project "project-id" \
  --title "New Title" \
  --reminders "900"
```

### Moving Tasks

```bash
dida task move \
  --from "source-project-id" \
  --to "dest-project-id" \
  --task "task-id"
```

### Incomplete Tasks

```bash
# Today
dida task undone --time-query today

# Tomorrow
dida task undone --time-query tomorrow

# Last 24 hours
dida task undone --time-query last24hour

# Last 7 days
dida task undone --time-query last7day

# Next 24 hours
dida task undone --time-query next24hour

# Next 7 days
dida task undone --time-query next7day

# Date range
dida task undone \
  --start-date "2026-04-01" \
  --end-date "2026-04-07"
```

### Batch Creation

```bash
# CSV format (simple task list)
dida task batch-create \
  --tasks "Task 1,Task 2,Task 3" \
  --project "project-id"

# JSON format (full attributes)
dida task batch-create \
  --tasks '[
    {
      "title": "Morning Meeting",
      "projectId": "proj123",
      "dueDate": "2026-04-08T09:00:00",
      "reminders": ["TRIGGER:PT0S"],
      "priority": 3
    },
    {
      "title": "Lunch Break",
      "projectId": "proj123",
      "dueDate": "2026-04-08T12:00:00"
    }
  ]' \
  --project "project-id"
```

### Batch Update

```bash
dida task batch-update \
  --tasks '[
    {"id": "task1", "title": "New Title 1", "priority": 5},
    {"id": "task2", "title": "New Title 2"}
  ]'
```

---

## 🔧 Technical Implementation

### MCP Integration Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────────┐
│   CLI Cmd   │────▶│ api.mcpRequest()  │────▶│  MCP Endpoint    │
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

### Modified Files

| File | Changes | Lines |
|------|---------|-------|
| `api.js` | Added MCP request methods, response parsing | +120 |
| `task.js` | Added 8 CLI commands, error handling | +180 |

### New API Methods

```javascript
// Search
async searchTask(query)
async search(query)

// Query
async listUndoneTasksByDate(start, end)
async listUndoneTasksByTimeQuery(query)
async fetchTask(taskId)
async getTaskById(taskId)

// Batch
async batchAddTasks(tasks)
async batchUpdateTasks(tasks)

// Others
async getUserPreference()
async completeTasksInProject(pid, ids)
async getTaskInProject(pid, tid)
```

### Response Format Handling

MCP service returns two formats, requiring compatibility handling:

```javascript
// Optimized parsing logic
if (data.result?.structuredContent !== undefined) {
  return data.result.structuredContent;
}
if (data.result?.content?.[0]?.text) {
  return JSON.parse(data.result.content[0].text);
}
```

---

## 📊 Feature Comparison

### Before vs After

| Feature Category | Original CLI | MCP Extended | Change |
|------------------|--------------|--------------|--------|
| Total Commands | 12 | 20 | +67% |
| Reminders | ❌ | ✅ | From scratch |
| Search | 0 | 2 | New |
| Batch Ops | 0 | 2 | New |
| Time Queries | 0 | 1 | New |
| Full Content | 0 | 2 | New |
| API Methods | 15 | 26 | +73% |

### New Commands List

| Command | Feature | MCP Tool |
|---------|---------|----------|
| `task search` | Search tasks | `search_task` |
| `task find` | Universal search | `search` |
| `task undone` | Incomplete tasks | `list_undone_tasks_by_time_query` |
| `task batch-create` | Batch create | `batch_add_tasks` |
| `task batch-update` | Batch update | `batch_update_tasks` |
| `task fetch` | Get full content | `fetch` |
| `task get-by-id` | Get by ID | `get_task_by_id` |

---

## 🎯 Use Cases

### Use Case 1: Daily Task Management

```bash
# View today's tasks
dida task undone --time-query today

# Create tonight's task
dida task create \
  --title "Learn JavaScript" \
  --project "personal" \
  --due-date "2026-04-07T20:00:00" \
  --reminders "300"

# Complete task
dida task complete "project-id" "task-id"
```

### Use Case 2: Batch Task Creation

```bash
# Create weekly work plan
dida task batch-create \
  --tasks "Monday:Requirements Review,Tuesday:Code Development,Wednesday:Test Cases,Thursday:Bug Fixes,Friday:Weekly Report" \
  --project "work"
```

### Use Case 3: Task Search and Organization

```bash
# Search for tasks containing "urgent"
dida task search urgent

# Update priority after finding
dida task update "task-id" \
  --id "task-id" \
  --project "project-id" \
  --priority 5
```

---

## ⚠️ Notes

1. **Authentication**: Must complete OAuth via `dida auth login` before use
2. **Timezone**: All times are UTC, automatically converted to user timezone
3. **Batch Limits**: `batch-create` and `batch-update` have limits (usually 50-100)
4. **Reminders**: Use `--reminders` parameter in seconds (e.g., `"600"` for 10 min early)

---

## 🔮 Roadmap

- [ ] Migrate Project module fully to MCP service
- [ ] Add batch complete/delete functionality
- [ ] Support more reminder options (recurring reminders)
- [ ] Add task import/export (JSON/CSV)
- [ ] Support Webhook subscriptions for task changes

---

## 🤝 Contributing

Issues and PRs welcome!

1. Fork this repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

[MIT](LICENSE) © 2026 LamKaGum

Based on [suibiji/dida-cli](https://github.com/suibiji/dida-cli) © 2024 suibiji

---

## 🙏 Acknowledgments

- [TickTick](https://dida365.com) - Excellent task management tool
- [suibiji](https://github.com/suibiji) - Original author of dida365 CLI

---

<p align="center">
  Made with ❤️ by the community
</p>
