# Dida365 官方 CLI 技能

使用 Dida365 (滴答清单) 官方 Open API 管理任务、项目、清单。

> **注意**：该技能直接调用 `dida365.com` 官方 API，不经过任何第三方 OAuth 中转。

## 目录
- [认证](#认证)
  - [服务器环境（推荐）](#服务器环境直接提供-token)
  - [桌面版（OAuth 浏览器授权）](#桌面版oauth-浏览器授权)
- [使用方法](#使用方法)
- [命令参考](#命令参考)
- [项目结构](#项目结构)
- [安全说明](#安全说明)
- [常见问题](#常见问题)

## 认证

本插件已内置默认应用凭证，**新用户无需手动配置** Client ID/Secret。如需使用自定义凭证，可通过 `setup` 命令覆盖。

### 服务器环境：直接提供 Token

适用于运行在服务器、Docker、云环境等无法打开浏览器的情况。

```bash
# 交互式输入 token
./scripts/ticktick_oauth.py server-login

# 或直接传参（非交互式）
./scripts/ticktick_oauth.py server-login --token "your_access_token_here"
```

**Token 获取方式**：
1. 在浏览器中打开授权链接（见下方 login 命令输出）
2. 登录滴答清单并点击授权
3. 从回调地址或开发者工具中获取 `access_token`

### 桌面版：OAuth 浏览器授权

适用于本地电脑、有图形界面、能打开浏览器的环境。

```bash
# 一键启动：自动生成授权链接、监听本地回调、自动换 token
./scripts/ticktick_oauth.py login

# 不自动打开浏览器（只打印链接）
./scripts/ticktick_oauth.py login --no-open
```

流程：
1. 脚本启动本地 HTTP 服务监听 `127.0.0.1:8765`
2. 打印 OAuth 授权链接
3. 用户复制链接到浏览器，登录并授权
4. 浏览器自动跳转回本地回调地址
5. 脚本自动获取 code、换取 access_token、保存到本地

### 使用自定义应用凭证

如需使用自己的 Dida365 应用（而非内置默认凭证）：

```bash
# 保存自定义凭证到本地配置
./scripts/ticktick_oauth.py setup --client-id "your_id" --client-secret "your_secret"

# 后续命令会自动使用自定义凭证
./scripts/ticktick_oauth.py login
```

## 使用方法

```bash
# 1. 先认证（服务器或桌面版任选其一）
./scripts/ticktick_oauth.py server-login --token "your_token"
# 或
./scripts/ticktick_oauth.py login

# 2. 读取 token（每次新终端需要执行）
export $(cat ~/.config/ticktick-official/token.env | xargs)

# 3. 使用 CLI
./scripts/ticktick_cli.py project list
./scripts/ticktick_cli.py task list --project "收件箱"
```

## 命令参考

| 命令 | 说明 | 常用参数 |
|------|------|----------|
| `server-login` | 服务器环境直接输入 token | `--token` |
| `login` | 桌面版一键 OAuth 登录 | `--no-open` |
| `setup` | 保存自定义应用凭证 | `--client-id`, `--client-secret` |
| `auth-url` | 仅生成授权 URL | `--client-id`, `--redirect-uri` |
| `exchange` | 用 code 换 token | `--code` |

CLI 命令（`ticktick_cli.py`）：

| 命令 | 说明 | 常用参数 |
|------|------|----------|
| `project list` | 列出所有项目 | `--json` |
| `task list` | 列出任务 | `--project`, `--json` |
| `task create` | 创建任务 | `--summary`, `--content` |
| `task get` | 获取任务详情 | `--id` |
| `task patch` | 更新任务 | `--id`, `--summary` |
| `task complete` | 完成任务 | `--id` |
| `task delete` | 删除任务 | `--id` |

## 项目结构

```
ticktick-official-cli/
├── scripts/
│   ├── ticktick_oauth.py   # OAuth 认证辅助脚本
│   └── ticktick_cli.py     # 任务/项目管理 CLI
├── references/
│   └── dida365-openapi.md  # 官方 API 文档参考
└── SKILL.md                # 本文件
```

## 安全说明

- **默认凭证**：内置的应用凭证是共享的，所有用户均可使用。如需隔离，请使用自己的 Dida365 应用。
- **Token 存储**：access_token 保存在 `~/.config/ticktick-official/token.env`，请妥善保管。
- **OAuth 流程**：`login` 命令仅在本地监听，不会将 code/token 发送到任何第三方服务器。

## 常见问题

**Q: 在服务器上运行 `login` 命令报错？**  
A: 服务器环境无法自动打开浏览器。请使用 `server-login` 命令直接提供 token。

**Q: 如何获取 access_token？**  
A: 在桌面版浏览器中打开 login 命令生成的授权链接，授权后从回调地址或 Network 面板中提取。

**Q: token 过期了怎么办？**  
A: Dida365 Open API 的 token 有效期较长。如过期，重新执行 `server-login` 或 `login` 获取新 token。

**Q: 能否同时管理多个滴答清单账号？**  
A: 当前版本通过 `~/.config/ticktick-official/token.env` 单文件存储，切换账号需要手动替换 token 文件。

## 参考

- [Dida365 Open API 文档](https://developer.dida365.com/docs)
- [OAuth 2.0 授权码模式](https://oauth.net/2/grant-types/authorization-code/)
