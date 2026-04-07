import { readConfig, updateConfig, writeConfig } from './config.js';
export async function getAccessToken() {
    const config = await readConfig();
    if (config.access_token) {
        return config.access_token;
    }
    throw new Error('未找到 access token。请先运行 `dida auth login` 登录。');
}
export async function saveAccessToken(token) {
    if (!token || token.trim().length < 10) {
        throw new Error('无效 token：长度至少为 10 个字符');
    }
    await updateConfig({ access_token: token.trim() });
}
export async function clearAccessToken() {
    const config = await readConfig();
    delete config.access_token;
    await writeConfig(config);
}
//# sourceMappingURL=auth.js.map