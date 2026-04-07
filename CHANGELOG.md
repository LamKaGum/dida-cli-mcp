# Changelog

All notable changes to this project will be documented in this file.

## [0.1.3-mcp] - 2026-04-07

### Added
- **MCP Service Integration** - Full support for TickTick MCP service API
- **Task Reminders** - Complete reminder support via MCP (`--reminders` flag)
- **Smart Search** - New commands: `task search` and `task find`
- **Batch Operations** - New commands: `task batch-create` and `task batch-update`
- **Time-based Queries** - New command: `task undone` with timeQuery support
- **Enhanced Task Fetching** - New commands: `task fetch` and `task get-by-id`
- **iCalendar Format Conversion** - Automatic conversion from seconds to TRIGGER format

### Changed
- `task create` now uses MCP service for full reminder support
- `task update` now uses MCP service for full reminder support
- Enhanced response parsing for MCP service formats

### Technical
- Added 11 new API methods in `api.js`
- Added 8 new CLI commands in `task.js`
- Improved error handling for MCP responses

### Attribution
- Based on [suibiji/dida-cli](https://github.com/suibiji/dida-cli) v0.1.3
- Extended by LamKaGum with MCP service capabilities

---

## Original Project History

See [suibiji/dida-cli](https://github.com/suibiji/dida-cli) for earlier versions.
