import { randomBytes } from 'node:crypto';
import chalk from 'chalk';
import open from 'open';
import { clearAccessToken, getAccessToken, saveAccessToken } from '../lib/auth.js';
import { startCallbackServer } from '../lib/oauth-server.js';
import { buildAuthorizationUrl, exchangeCodeForToken, generatePkceChallenge } from '../lib/oauth.js';
import readline from 'node:readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer.trim());
        });
    });
}

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

async function loginWithToken() {
    console.log(chalk.cyan('\n📋 Token 登录方式'));
    console.log(chalk.dim('适用于服务器或无浏览器环境\n'));
    
    const token = await askQuestion('请输入你的滴答清单 access_token: ');
    
    if (!token || token.length < 10) {
        console.log(chalk.red('✗'), 'Token 格式不正确');
        rl.close();
        return;
    }
    
    console.log(chalk.dim('正在验证 token...'));
    
    try {
        await saveAccessToken(token.trim());
        console.log(chalk.green('✓'), 'Token 已保存，登录成功');
        console.log(chalk.dim(`  Token: ${token.slice(0, 8)}...${token.slice(-4)}`));
    } catch (error) {
        console.log(chalk.red('✗'), '保存失败:', error.message);
    }
    
    rl.close();
}

async function interactiveLogin() {
    console.log(chalk.cyan('\n🔐 选择登录方式:\n'));
    console.log('  1. OAuth 登录（推荐）- 自动打开浏览器授权');
    console.log('  2. Token 登录 - 手动输入 access_token');
    console.log(chalk.dim('     适用于服务器/无浏览器环境\n'));
    
    const choice = await askQuestion('请选择 [1/2]: ');
    
    if (choice === '1') {
        rl.close();
        await loginWithOAuth();
    } else if (choice === '2') {
        await loginWithToken();
    } else {
        console.log(chalk.yellow('⚠'), '无效选择，默认使用 OAuth 登录');
        rl.close();
        await loginWithOAuth();
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
    
    auth.command('login')
        .description('登录（支持 OAuth 或 Token 方式）')
        .option('--token', '使用 Token 方式登录（适用于服务器）')
        .action(async (options) => {
            if (options.token) {
                await loginWithToken();
            } else {
                await interactiveLogin();
            }
        });
    
    auth.command('status')
        .description('查看是否已保存 token')
        .action(showStatus);
    
    auth.command('logout')
        .description('删除本地保存的 token')
        .action(logout);
}
