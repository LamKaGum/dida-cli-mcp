---
name: dida-cli-mcp
version: 0.1.2
description: TickTick CLI with MCP support - task reminders, batch operations, and smart search
homepage: https://github.com/LamKaGum/dida-cli-mcp
author: LamKaGum
license: MIT
repository: https://github.com/LamKaGum/dida-cli-mcp.git
keywords: ["ticktick", "dida365", "cli", "task", "todo", "mcp"]
type: cli-tool
metadata:
  clawdbot:
    emoji: "✅"
    requires:
      bins: ["dida"]
      node: ">=18"
---

# Dida CLI MCP — TickTick Task Management

A feature-rich CLI tool for managing TickTick (滴答清单) tasks with MCP (Model Context Protocol) support, enabling batch operations, smart search, and automated reminders.

**Key Features:**
- ✅ Full task lifecycle management (create, update, complete, delete)
- 📦 Batch operations for multiple tasks
- 🔍 Smart search with filters
- ⏰ Task reminders and due dates
- 📁 Project/清单 management
- 🤖 MCP protocol support for AI integration

---

## 1. Installation

### Prerequisites
- Node.js >= 18
- npm

### Global Installation

```bash
npm install -g dida-cli-mcp
```

### Verify Installation

```bash
dida --version
dida --help
```

---

## 2. Authentication (OAuth PKCE)

The CLI uses OAuth PKCE flow for secure authentication.

### Login

```bash
dida auth login
```

This will open a browser window for you to log in to TickTick and authorize the app.

### Check Auth Status

```bash
dida auth status
```

### Logout

```bash
dida auth logout
```

---

## 3. Project Management

### List All Projects

```bash
dida project list
```

JSON output for programmatic use:

```bash
dida project list --json
```

---

## 4. Task Operations

### List Tasks

**Filter by project:**
```bash
dida task filter --projects <projectId>
```

**List undone tasks:**
```bash
dida task undone
```

**List completed tasks:**
```bash
dida task completed
```

### Create Task

```bash
dida task create --title "Task title" --project <projectId>
```

**With optional fields:**
```bash
dida task create \
  --title "Buy groceries" \
  --project <projectId> \
  --content "Milk, eggs, bread" \
  --dueDate "2026-04-10T10:00:00"
```

### Get Task Details

```bash
dida task get <projectId> <taskId>
```

JSON output:
```bash
dida task get <projectId> <taskId> --json
```

### Update Task

```bash
dida task update <taskId> \
  --project <projectId> \
  --title "Updated title" \
  --content "Updated description"
```

### Complete Task

```bash
dida task complete <projectId> <taskId>
```

### Delete Task

⚠️ **Destructive operation - use with caution**

```bash
dida task delete <projectId> <taskId>
```

### Move Task Between Projects

```bash
dida task move \
  --from <sourceProjectId> \
  --to <destProjectId> \
  --task <taskId>
```

---

## 5. Batch Operations

### Batch Create Tasks

```bash
dida task batch-create --tasks '[
  {"title": "Task 1", "project": "<projectId>"},
  {"title": "Task 2", "project": "<projectId>", "dueDate": "2026-04-15"}
]'
```

### Batch Update Tasks

```bash
dida task batch-update --updates '[
  {"taskId": "<id>", "project": "<projectId>", "title": "Updated"}
]'
```

---

## 6. Smart Search

### Search Tasks by Keywords

```bash
dida task search "meeting"
```

### Find Tasks (Advanced Search)

```bash
dida task find "high priority"
```

### Filter with Multiple Conditions

```bash
dida task filter \
  --projects <projectId> \
  --status undone \
  --priority high
```

---

## 7. Advanced Usage Examples

### 7.1 Scripting with Shell

#### Daily Task Report

Generate a daily summary of pending tasks:

```bash
#!/bin/bash
# daily-report.sh

echo "=== Daily Task Report ==="
echo "Date: $(date)"
echo ""

# Get all projects
projects=$(dida project list --json | jq -r '.[] | "\(.id):\(.name)"')

# For each project, show undone tasks
while IFS=: read -r id name; do
  count=$(dida task filter --projects "$id" --status undone --json | jq 'length')
  echo "📁 $name: $count pending tasks"
done <<< "$projects"
```

#### Bulk Complete by Pattern

Complete all tasks matching a keyword:

```bash
#!/bin/bash
# complete-by-pattern.sh
# Usage: ./complete-by-pattern.sh "meeting"

PATTERN="$1"
PROJECT_ID="your-project-id"

# Find matching tasks
tasks=$(dida task filter --projects "$PROJECT_ID" --json | \
  jq -r --arg pattern "$PATTERN" '.[] | select(.title | contains($pattern)) | .id')

# Complete each task
for taskId in $tasks; do
  echo "Completing: $taskId"
  dida task complete "$PROJECT_ID" "$taskId"
  sleep 1
done
```

---

### 7.2 Working with JSON

#### Export Tasks to JSON File

```bash
# Export all tasks from a project
dida task filter --projects <projectId> --json > my-tasks.json

# Export only undone high-priority tasks
dida task filter --projects <projectId> --status undone --json | \
  jq '[.[] | select(.priority == "high")]' > urgent-tasks.json
```

#### Import Tasks from JSON

```bash
# Read tasks from file and batch create
cat new-tasks.json | jq -c '.' | \
  xargs -I {} dida task batch-create --tasks '{}'
```

#### Transform and Update

```bash
# Add prefix to all task titles in a project
dida task filter --projects <projectId> --json | \
  jq '[.[] | {taskId: .id, project: "<projectId>", title: "[WORK] \(.title)"}]' | \
  xargs -I {} dida task batch-update --updates '{}'
```

---

### 7.3 Automation Workflows

#### Weekly Review Reminder

Create a recurring weekly review task:

```bash
#!/bin/bash
# weekly-review.sh

PROJECT_ID="your-project-id"
NEXT_MONDAY=$(date -d "next Monday" +%Y-%m-%dT09:00:00+08:00)

dida task create \
  --title "📋 Weekly Review" \
  --project "$PROJECT_ID" \
  --content "Review completed tasks, plan next week" \
  --dueDate "$NEXT_MONDAY"
```

#### Task Archival

Move completed tasks older than 30 days to an archive project:

```bash
#!/bin/bash
# archive-old-tasks.sh

SOURCE_PROJECT="source-project-id"
ARCHIVE_PROJECT="archive-project-id"
THIRTY_DAYS_AGO=$(date -d "30 days ago" +%s)

# Get completed tasks
dida task filter --projects "$SOURCE_PROJECT" --status completed --json | \
  jq --argjson cutoff "$THIRTY_DAYS_AGO" \
     '[.[] | select(.completedTime / 1000 < $cutoff)]' | \
  jq -r '.[].id' | \
  while read taskId; do
    echo "Archiving: $taskId"
    dida task move --from "$SOURCE_PROJECT" --to "$ARCHIVE_PROJECT" --task "$taskId"
    sleep 1
  done
```

---

### 7.4 Integration Examples

#### With Cron (Scheduled Tasks)

Add to crontab for automated reminders:

```bash
# Check overdue tasks every morning at 8 AM
0 8 * * * /usr/local/bin/check-overdue.sh

# check-overdue.sh
#!/bin/bash
OVERDUE=$(dida task filter --status undone --json | \
  jq '[.[] | select(.dueDate < now * 1000)]')

if [ "$(echo "$OVERDUE" | jq 'length')" -gt 0 ]; then
  echo "You have overdue tasks!" | mail -s "Task Alert" user@example.com
fi
```

#### With Alfred (macOS)

Create an Alfred workflow:

```bash
# dida-add.sh - Quick add task
query="$1"  # Input from Alfred

# Parse: "Buy milk tomorrow"
title=$(echo "$query" | sed 's/ tomorrow//')
dueDate=$(date -d "tomorrow" +%Y-%m-%dT09:00:00)

dida task create \
  --title "$title" \
  --project "inbox-project-id" \
  --dueDate "$dueDate"

echo "Added: $title"
```

#### With Raycast (macOS)

Raycast script command:

```bash
#!/bin/bash
# Required parameters:
# @raycast.title Add TickTick Task
# @raycast.mode compact
# @raycast.icon ✅

read -r title

dida task create \
  --title "$title" \
  --project "your-inbox-id"

echo "✅ Task added"
```

---

### 7.5 Advanced Filtering

#### Complex JQ Queries

```bash
# Find tasks due this week
dida task filter --json | \
  jq '[.[] | select(.dueDate and (.dueDate / 1000) < (now + 604800))]'

# Group tasks by priority
dida task filter --json | \
  jq 'group_by(.priority) | map({priority: .[0].priority, count: length})'

# Find tasks without due dates
dida task filter --json | \
  jq '[.[] | select(.dueDate == null)]'

# Search in task content (not just title)
dida task filter --json | \
  jq '[.[] | select(.content | contains("important"))]'
```

#### Multi-Project Operations

```bash
# Get tasks from multiple projects
PROJECT_IDS=("id1" "id2" "id3")

for pid in "${PROJECT_IDS[@]}"; do
  echo "=== Project: $pid ==="
  dida task filter --projects "$pid" --status undone
done
```

---

### 7.6 Data Backup & Migration

#### Full Account Backup

```bash
#!/bin/bash
# backup-all.sh

BACKUP_DIR="dida-backup-$(date +%Y%m%d)"
mkdir -p "$BACKUP_DIR"

# Backup all projects
dida project list --json > "$BACKUP_DIR/projects.json"

# Backup tasks per project
cat "$BACKUP_DIR/projects.json" | \
  jq -r '.[].id' | \
  while read pid; do
    dida task filter --projects "$pid" --json > "$BACKUP_DIR/project-$pid.json"
    sleep 2  # Rate limiting
done

echo "Backup complete: $BACKUP_DIR"
```

#### Migrate Tasks Between Accounts

```bash
#!/bin/bash
# migrate.sh
# Requires two auth contexts (manual switch or use two CLI instances)

SOURCE_PROJECT="source-id"
DEST_PROJECT="dest-id"

# Export from source
dida task filter --projects "$SOURCE_PROJECT" --json | \
  jq '[.[] | {title, content, dueDate, priority}]' > tasks-to-migrate.json

# Switch auth (logout/login with different account)
# ...

# Import to destination
cat tasks-to-migrate.json | \
  jq --arg project "$DEST_PROJECT" \
     '[.[] | . + {project: $project}]' | \
  xargs -I {} dida task batch-create --tasks '{}'
```

---

### 7.7 Tips & Best Practices

1. **Always quote JSON strings** in shell to prevent parsing errors
2. **Use `--json` for automation** - easier to parse than text output
3. **Add delays for bulk operations** - respect rate limits
4. **Validate JSON before batch operations** - use `jq .` to check syntax
5. **Store project IDs in environment variables**:
   ```bash
   export DIDA_WORK_PROJECT="abc123"
   export DIDA_PERSONAL_PROJECT="def456"
   ```

---

## 8. MCP (Model Context Protocol) Commands

The following commands support MCP integration for AI assistants:

| Command | Description |
|---------|-------------|
| `dida task search` | MCP-enabled task search |
| `dida task find` | MCP-enabled advanced find |
| `dida task undone` | MCP-enabled undone task list |
| `dida task fetch` | Fetch full task content via MCP |
| `dida task get-by-id` | Get task by ID via MCP |
| `dida task batch-create` | Batch create via MCP |
| `dida task batch-update` | Batch update via MCP |

---

## 8. Agent Workflow Guidelines

### When Users Ask About Tasks

1. **Check auth first:**
   ```bash
   dida auth status
   ```

2. **List projects to identify target:**
   ```bash
   dida project list --json
   ```

3. **Select project by name matching, then use ID**

4. **Use `--json` for programmatic operations**

### Creating Tasks

When user says "create a task":
- Resolve project name to ID
- Use `dida task create --title "..." --project <id>`
- Confirm creation with summary

### Batch Operations

For multiple tasks:
- Use `batch-create` or `batch-update`
- Always preview changes when possible
- Get explicit confirmation for destructive operations

### Safety Rules

- **Never guess project/task IDs** - always fetch from API
- **Confirm before delete** - show task details first
- **Use JSON mode** for internal selection logic
- **Explain errors clearly** - suggest re-auth for 401 errors

---

## 9. Common Error Handling

### Authentication Errors (401)

```bash
# Re-authenticate
dida auth logout
dida auth login
dida auth status
```

### Not Found Errors

- Verify project/task IDs exist
- Use `project list --json` to get valid IDs
- Check task status (may be completed/deleted)

### Network Errors

- Check internet connection
- Verify TickTick service status
- Retry with exponential backoff

---

## 10. JSON Output Mode

Most commands support `--json` for structured output:

```bash
dida project list --json
dida task get <projectId> <taskId> --json
dida task filter --projects <id> --json
```

**Use `--json` when:**
- Selecting items programmatically
- Chaining commands
- Filtering by fields
- Extracting specific data

---

## 11. Project Structure

```
dida-cli-mcp/
├── src/
│   ├── commands/       # CLI command handlers
│   ├── api/           # TickTick API client
│   ├── mcp/           # MCP protocol implementation
│   └── utils/         # Utilities
├── bin/
│   └── dida           # CLI entry point
├── package.json
└── README.md
```

---

## 12. Troubleshooting

### 12.1 Installation Issues

#### Command not found: `dida`

**Symptom:**
```bash
$ dida --version
command not found: dida
```

**Solutions:**

1. **Verify npm global bin path is in PATH:**
   ```bash
   npm bin -g
   echo $PATH
   ```
   If missing, add to your shell profile:
   ```bash
   export PATH="$(npm bin -g):$PATH"
   ```

2. **Reinstall with correct permissions:**
   ```bash
   sudo npm uninstall -g dida-cli-mcp
   npm install -g dida-cli-mcp
   ```

3. **Use npx as fallback:**
   ```bash
   npx dida-cli-mcp --version
   ```

#### Node version error

**Symptom:**
```
Error: Node.js version >= 18 is required
```

**Solution:**
Update Node.js:
```bash
# Using nvm
nvm install 18
nvm use 18

# Or download from https://nodejs.org
```

---

### 12.2 Authentication Issues

#### OAuth callback fails

**Symptom:** Browser opens but shows "Connection refused" or timeout

**Solutions:**
1. Check firewall/proxy settings
2. Try manual authorization:
   ```bash
   dida auth login --manual
   ```
3. Use a different browser
4. Disable VPN temporarily

#### Token expired / 401 errors

**Symptom:**
```
Error: 401 Unauthorized
Error: Token expired
```

**Solution:**
```bash
# Full re-authentication
dida auth logout
dida auth login
dida auth status
```

#### Auth status shows "Not logged in"

**Symptom:** Login succeeds but status shows not logged in

**Causes & Solutions:**
1. **Multiple Node installations** - Ensure you're using the same Node for login and other commands
2. **Permission issues** - Check `~/.config/dida/` exists and is writable:
   ```bash
   ls -la ~/.config/dida/
   chmod 755 ~/.config/dida/
   ```
3. **Config file corruption** - Reset config:
   ```bash
   rm -rf ~/.config/dida/
   dida auth login
   ```

---

### 12.3 Task Operation Errors

#### "Project not found"

**Symptom:**
```
Error: Project not found or no access
```

**Solutions:**
1. List available projects:
   ```bash
   dida project list --json
   ```
2. Verify project ID format (usually 24-character hex string)
3. Check you have access to the project in TickTick app

#### "Task not found"

**Symptom:**
```
Error: Task not found
```

**Causes:**
- Task was deleted
- Task was moved to another project
- Using wrong project ID

**Solution:**
```bash
# Search for the task
dida task search "task name"
dida task find "keywords"

# List all tasks in project
dida task filter --projects <projectId> --json
```

#### Invalid date format

**Symptom:**
```
Error: Invalid dueDate format
```

**Correct format:**
```bash
# ISO 8601 format with timezone
dida task create --title "Task" --dueDate "2026-04-10T10:00:00+08:00"

# Or UTC
dida task create --title "Task" --dueDate "2026-04-10T02:00:00Z"
```

---

### 12.4 MCP-Specific Issues

#### MCP commands not responding

**Symptom:** MCP commands hang or timeout

**Solutions:**
1. Check if auth is valid:
   ```bash
   dida auth status
   ```
2. Enable verbose mode for debugging:
   ```bash
   DEBUG=dida* dida task search "test"
   ```
3. Check MCP server is running (if using external MCP):
   ```bash
   curl http://localhost:3000/health
   ```

#### JSON parse errors in batch operations

**Symptom:**
```
Error: Invalid JSON in --tasks parameter
```

**Solutions:**
1. Validate your JSON:
   ```bash
   echo '[{"title":"Test","project":"abc"}]' | jq .
   ```
2. Use single quotes to prevent shell expansion:
   ```bash
   dida task batch-create --tasks '[{"title":"Task"}]'
   ```
3. Escape quotes properly:
   ```bash
   dida task batch-create --tasks "[{\"title\":\"Task\"}]"
   ```

---

### 12.5 Network Issues

#### Timeout / connection errors

**Symptom:**
```
Error: ETIMEDOUT
Error: ECONNREFUSED
Error: Network error
```

**Solutions:**
1. Check internet connection
2. Verify TickTick service status: https://dida365.com
3. Check proxy settings:
   ```bash
   env | grep -i proxy
   ```
4. Set proxy if needed:
   ```bash
   export HTTP_PROXY=http://proxy.company.com:8080
   export HTTPS_PROXY=http://proxy.company.com:8080
   ```
5. Retry with delay:
   ```bash
   for i in 1 2 3; do dida project list && break || sleep 5; done
   ```

#### Rate limiting

**Symptom:**
```
Error: 429 Too Many Requests
```

**Solution:**
Add delays between requests:
```bash
# In scripts, add sleep between calls
for id in $taskIds; do
  dida task get $projectId $id
  sleep 1
done
```

---

### 12.6 Permission Errors

#### EACCES: permission denied

**Symptom:**
```
Error: EACCES: permission denied, mkdir '~/.config/dida'
```

**Solutions:**
```bash
# Fix config directory permissions
mkdir -p ~/.config/dida
chmod 755 ~/.config/dida
chown $(whoami) ~/.config/dida

# Or use sudo for install only
sudo npm install -g dida-cli-mcp --unsafe-perm
```

---

### 12.7 Debug Mode

Enable debug logging for detailed error information:

```bash
# Full debug output
DEBUG=dida* dida <command>

# API only
DEBUG=dida:api dida <command>

# Auth only  
DEBUG=dida:auth dida <command>
```

---

### 12.8 Getting Help

If issues persist:

1. **Check version:**
   ```bash
   dida --version
   node --version
   npm --version
   ```

2. **Gather debug info:**
   ```bash
   DEBUG=dida* dida auth status 2>&1 | tee dida-debug.log
   ```

3. **Report issue with:**
   - Debug log
   - Node/npm versions
   - OS version
   - Steps to reproduce

**Issue tracker:** https://github.com/LamKaGum/dida-cli-mcp/issues

---

## References

- **Homepage:** https://github.com/LamKaGum/dida-cli-mcp
- **TickTick:** https://dida365.com
- **MCP Protocol:** https://modelcontextprotocol.io
- **npm Package:** `dida-cli-mcp`

---

*Last updated: 2026-04-08*
