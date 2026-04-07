import { createServer } from 'node:http';
const PORT = 8766;
const TIMEOUT_MS = 3 * 60 * 1000;
const SUCCESS_HTML = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>已连接 - DIDA CLI</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f5f5; color: #333;
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
  }
  .container { text-align: center; padding: 48px 24px; max-width: 480px; }
  .check { font-size: 64px; margin-bottom: 16px; }
  h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  p { font-size: 15px; color: #666; line-height: 1.6; }
  code { background: #e8e8e8; padding: 2px 8px; border-radius: 4px; font-size: 13px; }
</style></head>
<body><div class="container">
  <div class="check">&#x2705;</div>
  <h1>已连接</h1>
  <p>你已登录。现在可以关闭此窗口并返回终端。</p>
  <p style="margin-top:16px"><code>dida project list</code></p>
</div></body></html>`;
const ERROR_HTML = (message) => `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>错误 - DIDA CLI</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: #f5f5f5; color: #333;
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
  }
  .container { text-align: center; padding: 48px 24px; max-width: 480px; }
  .icon { font-size: 64px; margin-bottom: 16px; }
  h1 { font-size: 24px; font-weight: 700; margin-bottom: 8px; }
  p { font-size: 15px; color: #666; line-height: 1.6; }
  code { background: #e8e8e8; padding: 2px 8px; border-radius: 4px; font-size: 13px; }
</style></head>
<body><div class="container">
  <div class="icon">&#x274C;</div>
  <h1>授权失败</h1>
  <p>${message}</p>
  <p style="margin-top:16px">请运行 <code>dida auth login</code> 重试</p>
</div></body></html>`;
export function startCallbackServer(expectedState) {
    let server = null;
    let timeoutId = null;
    const cleanup = () => {
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
        }
        if (server) {
            server.close();
            server = null;
        }
    };
    const promise = new Promise((resolve, reject) => {
        const handleRequest = (req, res) => {
            const url = new URL(req.url || '/', `http://localhost:${PORT}`);
            if (url.pathname !== '/callback') {
                res.writeHead(404);
                res.end('Not found');
                return;
            }
            const code = url.searchParams.get('code');
            const state = url.searchParams.get('state');
            const error = url.searchParams.get('error');
            if (error) {
                res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(ERROR_HTML(error));
                cleanup();
                reject(new Error(`OAuth error: ${error}`));
                return;
            }
            if (!code || !state) {
                res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(ERROR_HTML('缺少 code 或 state 参数'));
                cleanup();
                reject(new Error('Missing code or state parameter'));
                return;
            }
            if (state !== expectedState) {
                res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
                res.end(ERROR_HTML('state 参数不匹配（可能的 CSRF 攻击）'));
                cleanup();
                reject(new Error('Invalid state parameter'));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(SUCCESS_HTML);
            cleanup();
            resolve(code);
        };
        server = createServer(handleRequest);
        server.on('error', (err) => {
            cleanup();
            reject(err);
        });
        server.listen(PORT, () => {
            timeoutId = setTimeout(() => {
                cleanup();
                reject(new Error('OAuth callback timed out'));
            }, TIMEOUT_MS);
        });
    });
    return { promise, cleanup };
}
export const OAUTH_REDIRECT_URI = `http://localhost:${PORT}/callback`;
//# sourceMappingURL=oauth-server.js.map