import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
const CONFIG_PATH = join(homedir(), '.config', 'dida-cli', 'config.json');
export async function readConfig() {
    try {
        const content = await readFile(CONFIG_PATH, 'utf-8');
        return JSON.parse(content);
    }
    catch {
        return {};
    }
}
export async function writeConfig(config) {
    const configDir = dirname(CONFIG_PATH);
    await mkdir(configDir, { recursive: true });
    await writeFile(CONFIG_PATH, `${JSON.stringify(config, null, 2)}\n`);
}
export async function updateConfig(partial) {
    const existing = await readConfig();
    await writeConfig({ ...existing, ...partial });
}
//# sourceMappingURL=config.js.map