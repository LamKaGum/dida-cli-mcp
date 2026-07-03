# TickTick 官方 CLI — 滴答清单 Python 版

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_CN.md">简体中文</a>
</p>

使用 **Dida365 官方 Open API** 直接管理滴答清单任务的 Python CLI 工具。

> **v2.0 重写**：从 TypeScript/Node 完全重写为 Python。使用 Dida365 官方 API 并内置凭证 — 无需手动注册应用。

## 功能特性

- ✅ **官方 API**：直接集成 `dida365.com` Open API
- 🔑 **内置凭证**：默认应用凭证已预配置
- 🖥️ **服务器 & 桌面版**：支持服务器（直接输入 token）和桌面版（浏览器 OAuth）环境
- 🧠 **智能检测**：自动检测运行环境并推荐合适的认证方式
- 📦 **零安装**：使用 `uv run` 单文件直接执行 — 无需 pip 安装
- 🎨 **精美输出**：表格、进度条、彩色终端输出

## 快速开始

### 服务器环境（无浏览器 / Docker / 云服务器）

```bash
# 直接输入 token — 无需浏览器
./scripts/ticktick_oauth.py server-login --token "你的_access_token"

# 列出项目
./scripts/ticktick_cli.py project list

# 列出任务
./scripts/ticktick_cli.py task list --project "收件箱"
```

### 桌面版环境（带浏览器的本地电脑）

```bash
# 一键 OAuth，自动回调
./scripts/ticktick_oauth.py login

# 脚本会：
# 1. 打印 OAuth 授权链接
# 2. 打开浏览器（如果可用）
# 3. 自动接收回调并保存 token
```

## 认证方式

| 方式 | 适用环境 | 命令 | 说明 |
|------|----------|------|------|
| `server-login` | 服务器 / 无图形界面 | `server-login --token <token>` | 直接输入 token |
| `login` | 桌面版 | `login` | 浏览器 OAuth 自动回调 |
| `setup` | 任意 | `setup --client-id <id>` | 自定义应用凭证（可选） |

## 命令参考

### 项目管理

```bash
./scripts/ticktick_cli.py project list              # 列出所有项目
./scripts/ticktick_cli.py project list --json       # JSON 输出
```

### 任务管理

```bash
./scripts/ticktick_cli.py task list --project "收件箱"          # 按项目列出任务
./scripts/ticktick_cli.py task create --summary "买牛奶"        # 创建任务
./scripts/ticktick_cli.py task complete --id <task_id>          # 完成任务
./scripts/ticktick_cli.py task delete --id <task_id>            # 删除任务
./scripts/ticktick_cli.py task get --id <task_id>               # 任务详情
./scripts/ticktick_cli.py task patch --id <id> --summary "新内容" # 更新任务
```

### 任务标签

```bash
./scripts/ticktick_cli.py tag list                  # 列出所有标签
./scripts/ticktick_cli.py task list --tags "工作"     # 按标签筛选
```

## 配置说明

凭证存储在 `~/.config/ticktick-official/`：

- `token.env` — Access token（自动生成）
- `app.env` — 自定义应用凭证（可选）

## 环境要求

- Python >= 3.10
- [uv](https://github.com/astral-sh/uv)（推荐）或 `pip install httpx typer rich`

## 与 v1.x (dida-cli-mcp) 的差异

| 特性 | v1.x (TypeScript) | v2.x (Python) |
|------|-------------------|---------------|
| 运行环境 | Node.js >= 18 | Python >= 3.10 |
| 认证方式 | 自定义 PKCE | 官方 OAuth 2.0 |
| 凭证配置 | 手动设置 | 内置默认值 |
| 服务器支持 | 有限 | 完整 (`server-login`) |
| 安装方式 | `npm install` | `uv run`（无需安装） |
| MCP 支持 | ✅ 支持 | ⏳ 计划中 |

## 开源协议

MIT — 详见 [LICENSE](LICENSE)。

## 仓库地址

https://github.com/LamKaGum/dida-cli-mcp
