# 发布指南

## 📦 发布到 NPM

### 1. 准备工作

确保你有 NPM 账号，如果没有，先注册：
```bash
npm adduser
```

或者登录已有账号：
```bash
npm login
```

### 2. 发布到 NPM 官方 Registry

```bash
# 进入项目目录
cd /tmp/dida-cli-mcp

# 安装依赖
npm install

# 测试包（可选）
npm pack --dry-run

# 发布到 NPM
npm publish
```

### 3. 发布到字节跳动 NPM 镜像

字节跳动提供了国内加速的 NPM 镜像：

```bash
# 使用字节 npm 镜像发布
npm publish --registry=https://registry.npmmirror.com

# 或者先切换 registry
npm config set registry https://registry.npmmirror.com
npm publish
npm config set registry https://registry.npmjs.org/
```

### 4. 发布到淘宝 NPM 镜像

```bash
# 使用淘宝镜像发布
npm publish --registry=https://registry.npmmirror.com
```

---

## 🔧 配置国内镜像源

### 用户安装时使用国内镜像

**方式一：临时使用**
```bash
# 使用淘宝镜像安装
npm install -g dida-cli-mcp --registry=https://registry.npmmirror.com

# 使用字节镜像安装  
npm install -g dida-cli-mcp --registry=https://mirrors.cloud.tencent.com/npm/
```

**方式二：全局配置**
```bash
# 设置淘宝镜像
npm config set registry https://registry.npmmirror.com

# 验证
npm config get registry

# 安装
gnpm install -g dida-cli-mcp

# 恢复官方源
npm config set registry https://registry.npmjs.org/
```

---

## 🚀 自动发布（GitHub Actions）

创建 `.github/workflows/publish.yml`：

```yaml
name: Publish to NPM

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Publish to NPM
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

---

## 📋 发布前检查清单

- [ ] `package.json` 中的版本号已更新
- [ ] `README.md` 内容完整
- [ ] 已运行 `npm install` 安装依赖
- [ ] 已登录 NPM：`npm login`
- [ ] 包名未被占用：`npm view dida-cli-mcp` 应返回 404

---

## 🔍 验证发布

发布后验证：
```bash
# 查看包信息
npm view dida-cli-mcp

# 测试安装
npm install -g dida-cli-mcp

# 验证命令
dida --version
dida --help
```

---

## 📌 ClawHub / SkillHub 说明

**ClawHub** 和 **SkillHub** 是 OpenClaw 的技能市场，用于安装 **OpenClaw Skills**（AI 助手的技能扩展），而不是 NPM 包。

如果你的目标是让用户通过 OpenClaw 安装 dida-cli-mcp，可以：

1. **作为 NPM 包安装**（推荐）- 用户通过 `npm install -g dida-cli-mcp` 安装
2. **创建 OpenClaw Skill 包装器** - 创建一个调用 dida-cli-mcp 的 Skill

当前已支持的方式：
```bash
# OpenClaw 用户安装 CLI 工具
clawhub run "npm install -g dida-cli-mcp"
```
