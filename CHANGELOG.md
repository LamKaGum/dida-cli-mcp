# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2026-07-03

### 🚀 Major Rewrite

**Complete rewrite from TypeScript/Node to Python**, using Dida365 Official Open API directly.

#### Added
- **Official API Support**: Direct integration with `dida365.com` Open API (no third-party OAuth relay)
- **Built-in Credentials**: Default app credentials pre-configured, no manual setup needed for new users
- **Server Environment Support**: New `server-login` command for headless/server environments (no browser required)
- **Desktop OAuth**: `login` command with automatic browser callback handling for desktop environments
- **Smart Environment Detection**: `is_server()` auto-detects if running in server or desktop environment
- **Token-based Auth**: Direct token input support for server deployments
- **UV Script Support**: Single-file executable with `uv run` — no pip install needed
- **Python 3.10+**: Modern Python with type hints

#### Changed
- **CLI Framework**: Replaced `commander.js` with `Typer` + `Rich` for better UX
- **HTTP Client**: Replaced `axios` with `httpx` for async/sync support
- **Auth Flow**: Simplified from custom PKCE to official OAuth 2.0 Authorization Code
- **Config Storage**: Moved from `~/.dida/` to `~/.config/ticktick-official/`

#### Removed
- **MCP Protocol**: Removed MCP server support (will be re-added in future release)
- **npm Package**: No longer distributed via npm
- **Node.js Dependency**: Python-only runtime

#### Migration Guide
**From v1.x (TypeScript) to v2.x (Python)**:

```bash
# v1.x
npm install -g dida-cli-mcp
dida auth login

# v2.x
# No install needed — just run with uv
./scripts/ticktick_oauth.py server-login --token <token>
./scripts/ticktick_cli.py project list
```

---

## [1.0.0] - 2025 (Legacy TypeScript Version)

See [git history](https://github.com/LamKaGum/dida-cli-mcp) for v1.x changelog.
