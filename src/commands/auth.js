import { randomBytes } from 'node:crypto';
import chalk from 'chalk';
import open from 'open';
import { clearAccessToken, getAccessToken, saveAccessToken } from '../lib/auth.js';
import { startCallbackServer } from '../lib/oauth-server.js';
import { buildAuthorizationUrl, exchangeCodeForToken, generatePkceChallenge } from '../lib/oauth.js';
async function loginWithOAuth() {
    const state = randomBytes(16).toString('hex');
    const { codeVerifier, codeChallenge } = generatePkceChallenge();
    console.log('正在打开浏览器进行滴答清单登录授权...');
    const authUrl = buildAuthorizationUrl(state, codeChallenge);
    const { promise: callbackPromise, cleanup } = startCallbackServer(state);
    try {
        await open(authUrl);
        console.log(chalk.dim('等待你在浏览器中完成授权...'));
        const code = await callbackPromise;
        console.log(chalk.dim('正在用授权码换取 token...'));
        const accessToken = await exchangeCodeForToken(code, codeVerifier);
        await saveAccessToken(accessToken);
        console.log(chalk.green('✓'), '登录成功');
    }
    catch (error) {
        cleanup();
        throw error;
    }
}
async function showStatus() {
    try {
        const token = await getAccessToken();
        console.log(chalk.green('✓'), '已登录');
        console.log(`  Token: ${token.slice(0, 8)}...${token.slice(-4)}`);
    }
    catch {
        console.log(chalk.yellow('未登录'));
        console.log(chalk.dim('请运行 `dida auth login` 登录'));
    }
}
async function logout() {
    await clearAccessToken();
    console.log(chalk.green('✓'), '已清除本地 token');
}
export function registerAuthCommand(program) {
    const auth = program.command('auth').description('OAuth 登录与 token 存储');
    auth.command('login').description('通过 OAuth 登录（PKCE，会打开浏览器）').action(loginWithOAuth);
    auth.command('status').description('查看是否已保存 token').action(showStatus);
    auth.command('logout').description('删除本地保存的 token').action(logout);
}
//# sourceMappingURL=auth.js.map