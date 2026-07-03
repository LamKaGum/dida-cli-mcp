# TickTick Official CLI — Dida365 Python Edition

A Python CLI tool for managing TickTick (滴答清单 / Dida365) tasks using the **official Open API** directly.

> **v2.0 Rewrite**: Complete rewrite from TypeScript/Node to Python. Uses Dida365 official API with built-in credentials — no manual app registration required.

## Features

- ✅ **Official API**: Direct integration with `dida365.com` Open API
- 🔑 **Built-in Credentials**: Default app credentials pre-configured
- 🖥️ **Server & Desktop**: Supports both server (token input) and desktop (OAuth browser) environments
- 🧠 **Smart Detection**: Auto-detects environment and suggests appropriate auth method
- 📦 **Zero Install**: Single-file executable with `uv run` — no pip install needed
- 🎨 **Rich Output**: Beautiful terminal output with tables, progress, and colors

## Quick Start

### Server Environment (Headless / Docker / Cloud)

```bash
# Direct token login — no browser needed
./scripts/ticktick_oauth.py server-login --token "your_access_token"

# List projects
./scripts/ticktick_cli.py project list

# List tasks
./scripts/ticktick_cli.py task list --project "收件箱"
```

### Desktop Environment (Local Computer with Browser)

```bash
# One-click OAuth with automatic callback
./scripts/ticktick_oauth.py login

# The script will:
# 1. Print OAuth authorization link
# 2. Open browser (if available)
# 3. Auto-receive callback and save token
```

## Authentication Methods

| Method | Environment | Command | Description |
|--------|------------|---------|-------------|
| `server-login` | Server / Headless | `server-login --token <token>` | Direct token input |
| `login` | Desktop | `login` | Browser OAuth with auto-callback |
| `setup` | Any | `setup --client-id <id>` | Custom app credentials (optional) |

## Commands

### Project Management

```bash
./scripts/ticktick_cli.py project list              # List all projects
./scripts/ticktick_cli.py project list --json       # JSON output
```

### Task Management

```bash
./scripts/ticktick_cli.py task list --project "收件箱"          # List tasks by project
./scripts/ticktick_cli.py task create --summary "Buy milk"     # Create task
./scripts/ticktick_cli.py task complete --id <task_id>         # Complete task
./scripts/ticktick_cli.py task delete --id <task_id>           # Delete task
./scripts/ticktick_cli.py task get --id <task_id>              # Task details
./scripts/ticktick_cli.py task patch --id <id> --summary "New" # Update task
```

### Task Tags

```bash
./scripts/ticktick_cli.py tag list                  # List all tags
./scripts/ticktick_cli.py task list --tags "工作"     # Filter by tag
```

## Configuration

Credentials are stored in `~/.config/ticktick-official/`:

- `token.env` — Access token (auto-generated)
- `app.env` — Custom app credentials (optional)

## Requirements

- Python >= 3.10
- [uv](https://github.com/astral-sh/uv) (recommended) or `pip install httpx typer rich`

## Differences from v1.x (dida-cli-mcp)

| Feature | v1.x (TypeScript) | v2.x (Python) |
|---------|-------------------|---------------|
| Runtime | Node.js >= 18 | Python >= 3.10 |
| Auth | Custom PKCE | Official OAuth 2.0 |
| Credentials | Manual setup | Built-in defaults |
| Server Support | Limited | Full (`server-login`) |
| Install | `npm install` | `uv run` (no install) |
| MCP | ✅ Supported | ⏳ Planned |

## License

MIT — see [LICENSE](LICENSE) for details.

## Repository

https://github.com/LamKaGum/dida-cli-mcp
