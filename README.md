# TickTick CLI — Dida365 MCP Extended Edition

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_CN.md">简体中文</a>
</p>

A CLI tool for managing TickTick (滴答清单 / Dida365) tasks with **MCP Extended Edition** features — reminders, batch operations, and smart search.

> **v1.1.0 Update**: Built-in default credentials, smart environment detection, and interactive login.

## What's New in v1.1.0

🔑 **Built-in Credentials** — No need to register your own app. Default credentials are pre-configured for instant use.

🖥️ **Smart Environment Detection** — Automatically detects server (headless) vs desktop environment and suggests the best login method.

🤖 **Interactive Login** — On first run, the CLI prompts you to choose the appropriate authentication method based on your environment.

## Features

- ✅ **MCP Extended**: Advanced features beyond standard API (reminders, batch operations, smart search)
- 🔑 **Built-in Credentials**: Default app credentials pre-configured
- 🖥️ **Server & Desktop**: Supports both server (token input) and desktop (OAuth browser) environments
- 🧠 **Smart Detection**: Auto-detects environment and suggests appropriate auth method
- ⏰ **Task Reminders**: Set due dates and reminders when creating tasks
- 📦 **Batch Operations**: Complete multiple tasks at once
- 🔍 **Smart Search**: Search tasks across projects with filters
- 🎨 **Rich Output**: Colorful terminal output with progress indicators

## Quick Start

```bash
# Install
git clone https://github.com/LamKaGum/dida-cli-mcp.git
cd dida-cli-mcp
npm install

# Login (interactive — auto-detects your environment)
npm start auth login

# List tasks
npm start task list

# Create a task with reminder
npm start task create "Meeting with team" --due "2024-01-15 14:00" --reminder 30
```

## Authentication

### Interactive Login (Recommended)

```bash
npm start auth login
```

The CLI will:
1. **Server environment** → Automatically prompt for access_token input
2. **Desktop environment** → Show a menu: choose OAuth (browser) or Token input

### Token Login (Server / Headless)

```bash
npm start auth login --token
# Then enter your access_token when prompted
```

### OAuth Login (Desktop)

```bash
npm start auth login
# Choose option 1: OAuth Login (opens browser automatically)
```

## Commands

### Authentication

```bash
npm start auth login          # Interactive login (auto-detect environment)
npm start auth login --token  # Force token input mode
npm start auth status         # Check login status
npm start auth logout        # Clear saved token
```

### Task Management

```bash
npm start task list                    # List all tasks
npm start task list --due today       # Today's tasks
npm start task get <id>               # Task details
npm start task create "Buy milk"      # Create simple task
npm start task create "Meeting" --due "2024-01-15 14:00" --reminder 30  # With reminder
npm start task update <id>            # Update task
npm start task complete <id>        # Complete task
npm start task delete <id>           # Delete task
```

### Project Management

```bash
npm start project list                # List all projects
npm start project create "New List"   # Create new project
npm start project update <id>         # Update project
npm start project delete <id>        # Delete project
```

## Environment Detection

The CLI automatically detects your environment:

| Environment | Detection | Behavior |
|-------------|-----------|----------|
| **Server** | No `DISPLAY` env, no `open` command | Auto-prompts for token input |
| **Desktop** | Has `DISPLAY` or `open` command | Shows OAuth / Token choice menu |

Override with `npm start auth login --token` to force token mode.

## Configuration

Credentials are stored in `~/.config/dida-cli/`:

- `config.json` — Access token and settings

No manual credential setup needed — built-in defaults work out of the box.

## Requirements

- Node.js >= 18
- npm

## License

MIT — see [LICENSE](LICENSE) for details.

## Repository

https://github.com/LamKaGum/dida-cli-mcp
