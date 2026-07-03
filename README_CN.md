# TickTick CLI — 滴答清单 MCP 增强版

<p align="center">
  <a href="./README.md">English</a> |
  <a href="./README_CN.md">简体中文</a>
</p>

一个用于管理滴答清单（TickTick / Dida365）任务的 CLI 工具，带有 **MCP 增强版** 功能 —— 提醒设置、批量操作和智能搜索。

> **v1.1.0 更新**：内置默认凭证、智能环境检测、交互式登录。

## v1.1.0 新特性

🔑 **内置凭证** — 无需注册自己的应用。默认凭证已预配置，开箱即用。

🖥️ **智能环境检测** — 自动检测服务器（无图形界面）或桌面环境，并推荐最佳登录方式。

🤖 **交互式登录** — 首次运行时，CLI 会根据您的环境提示选择适当的认证方式。

## 功能特性

- ✅ **MCP 增强**：超越标准 API 的高级功能（提醒、批量操作、智能搜索）
- 🔑 **内置凭证**：默认应用凭证已预配置
- 🖥️ **服务器 & 桌面版**：支持服务器（token 输入）和桌面版（浏览器 OAuth）环境
- 🧠 **智能检测**：自动检测环境并推荐合适的认证方式
- ⏰ **任务提醒**：创建任务时设置截止日期和提醒
- 📦 **批量操作**：一次完成多个任务
- 🔍 **智能搜索**：跨项目搜索任务，支持过滤
- 🎨 **精美输出**：彩色终端输出，带进度指示器

## 快速开始

```bash
# 安装
git clone https://github.com/LamKaGum/dida-cli-mcp.git
cd dida-cli-mcp
npm install

# 登录（交互式 — 自动检测您的环境）
npm start auth login

# 列出任务
npm start task list

# 创建带提醒的任务
npm start task create "团队会议" --due "2024-01-15 14:00" --reminder 30
```

## 认证方式

### 交互式登录（推荐）

```bash
npm start auth login
```

CLI 会：
1. **服务器环境** → 自动提示输入 access_token
2. **桌面版环境** → 显示菜单：选择 OAuth（浏览器）或 Token 输入

### Token 登录（服务器 / 无图形界面）

```bash
npm start auth login --token
# 然后按提示输入您的 access_token
```

### OAuth 登录（桌面版）

```bash
npm start auth login
# 选择选项 1：OAuth 登录（自动打开浏览器）
```

## 命令参考

### 认证

```bash
npm start auth login          # 交互式登录（自动检测环境）
npm start auth login --token  # 强制使用 Token 输入模式
npm start auth status         # 检查登录状态
npm start auth logout        # 清除保存的 token
```

### 任务管理

```bash
npm start task list                    # 列出所有任务
npm start task list --due today       # 今天到期的任务
npm start task get <id>               # 任务详情
npm start task create "买牛奶"      # 创建简单任务
npm start task create "会议" --due "2024-01-15 14:00" --reminder 30  # 带提醒
npm start task update <id>            # 更新任务
npm start task complete <id>        # 完成任务
npm start task delete <id>           # 删除任务
```

### 清单管理

```bash
npm start project list                # 列出所有清单
npm start project create "新清单"   # 创建新清单
npm start project update <id>         # 更新清单
npm start project delete <id>        # 删除清单
```

## 环境检测

CLI 自动检测您的环境：

| 环境 | 检测条件 | 行为 |
|------|----------|------|
| **服务器** | 无 `DISPLAY` 环境变量，无 `open` 命令 | 自动提示输入 token |
| **桌面版** | 有 `DISPLAY` 或 `open` 命令 | 显示 OAuth / Token 选择菜单 |

使用 `npm start auth login --token` 强制使用 token 模式。

## 配置说明

凭证存储在 `~/.config/dida-cli/`：

- `config.json` — Access token 和设置

无需手动配置凭证 — 内置默认值开箱即用。

## 环境要求

- Node.js >= 18
- npm

## 开源协议

MIT — 详见 [LICENSE](LICENSE)。

## 仓库地址

https://github.com/LamKaGum/dida-cli-mcp
