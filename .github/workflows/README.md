# GitHub Actions 自动发布配置

## 🚀 自动发布流程

当推送 `v*` 标签时，自动发布到 NPM：

```bash
# 1. 更新版本号
npm version patch  # 或 minor / major

# 2. 推送标签（触发自动发布）
git push origin main --tags
```

## 🔧 配置步骤

### 1. 获取 NPM Token

1. 登录 [NPM](https://www.npmjs.com/)
2. 进入 [Access Tokens](https://www.npmjs.com/settings/tokens)
3. 点击 "Generate New Token" → "Classic Token"
4. 选择类型：**Publish**
5. 复制生成的 token（格式：`npm_xxxxxxxxxx`）

### 2. 配置 GitHub Secret

1. 打开 GitHub 仓库 → **Settings** → **Secrets and variables** → **Actions**
2. 点击 **New repository secret**
3. 名称：`NPM_TOKEN`
4. 值：粘贴刚才复制的 NPM token
5. 点击 **Add secret**

### 3. 测试自动发布

```bash
# 本地更新版本
cd /tmp/dida-cli-mcp
npm version patch  # 变为 0.1.2

# 推送触发发布
git push origin main --tags
```

然后到 GitHub 仓库 → **Actions** 查看发布状态。

---

## 📋 发布前检查清单

- [ ] `package.json` 中的 `name` 正确 (`dida-cli-mcp`)
- [ ] NPM Token 有 **Publish** 权限
- [ ] GitHub Secret `NPM_TOKEN` 已配置
- [ ] 包名未被占用：`npm view dida-cli-mcp` 返回 404

---

## 🔍 排查问题

### 发布失败：E403 Forbidden
- 检查 NPM Token 是否有 Publish 权限
- 检查 Token 是否过期

### 发布失败：E404 Not Found
- 包名可能已被占用，需要更换

### 发布失败：E409 Conflict
- 该版本已存在，需要更新版本号

---

## 📦 手动发布（备用）

如果自动发布失败，可以手动发布：

```bash
npm login
npm publish
```
