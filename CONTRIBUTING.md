# Contributing to Dida CLI MCP Edition

Thank you for your interest in contributing! This project extends the original [suibiji/dida-cli](https://github.com/suibiji/dida-cli) with MCP service capabilities.

## Development Setup

```bash
# Clone the repository
git clone https://github.com/LamKaGum/dida-cli-mcp.git
cd dida-cli-mcp

# Install dependencies
npm install

# Build the project
npm run build

# Link for local development
npm link
```

## Project Structure

```
src/
├── index.js          # CLI entry point
├── lib/
│   ├── api.js        # API client (Open API + MCP)
│   └── auth.js       # Authentication utilities
└── commands/
    ├── task.js       # Task commands (MCP extended)
    └── project.js    # Project commands
```

## Key Changes in This Fork

### MCP Integration
- `api.js` contains both Open API and MCP service methods
- MCP methods use JSON-RPC 2.0 format
- Automatic reminders format conversion (seconds → iCalendar TRIGGER)

### Response Format Handling
MCP service returns two possible formats:
```javascript
// Format 1: structuredContent
{ result: { structuredContent: { ... } } }

// Format 2: content array
{ result: { content: [{ type: "text", text: "..." }] } }
```

The code handles both formats for compatibility.

## Submitting Changes

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes
4. Test thoroughly with `dida auth login`
5. Commit with clear messages
6. Push and create a Pull Request

## Code Style

- Use ES modules (`import`/`export`)
- Follow existing code patterns
- Add JSDoc comments for new methods
- Handle errors gracefully

## Reporting Issues

When reporting issues, please include:
- Node.js version (`node --version`)
- Command that failed
- Error message (with sensitive info redacted)
- Expected vs actual behavior

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
