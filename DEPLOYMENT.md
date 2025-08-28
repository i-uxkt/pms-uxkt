# 部署到 Cloudflare Pages 指南

## 🚀 部署步骤

### 1. 登录 Cloudflare Dashboard
- 访问 [https://dash.cloudflare.com/](https://dash.cloudflare.com/)
- 使用你的账号登录

### 2. 创建 Cloudflare Pages 项目
1. 点击左侧菜单 **Pages**
2. 点击 **Create application**
3. 选择 **Upload assets** (直接上传方式)

### 3. 上传构建文件
1. 将以下文件夹压缩为 ZIP 文件：
   - 📁 `E:\pmsaluxkt\precision-manufacturing-site\.next\static`
   - 📁 `E:\pmsaluxkt\precision-manufacturing-site\out` (如果存在)
   
   **或者直接上传整个 `.next` 文件夹**

2. 在 Cloudflare Pages 中上传 ZIP 文件
3. 项目名称建议：`precision-manufacturing-site`

### 4. 配置项目设置
**构建设置:**
```
Build command: npm run build
Output directory: .next
Root directory: /
```

**环境变量 (在 Settings > Environment variables 中添加):**
```
SANITY_PROJECT_ID=0xklcegv
SANITY_DATASET=production
SANITY_API_VERSION=2024-05-01
RESEND_API_KEY=re_UD4rgFb1_5GMEpwUH7pX1ApXH5k35cBqX
TO_EMAIL=kangsijueshi@gmail.com
FROM_EMAIL=onboarding@resend.dev
```

### 5. 配置自定义域名 topspm.com
1. 在项目设置中，点击 **Custom domains**
2. 点击 **Set up a custom domain**
3. 输入 `topspm.com`
4. 按照提示添加 DNS 记录

### 6. DNS 配置
在 Cloudflare DNS 中添加：
```
Type: CNAME
Name: @
Target: your-project-name.pages.dev
```

或者:
```
Type: A
Name: @
Value: [Cloudflare Pages IP]
```

## 🔧 替代方案：使用 Git 连接

如果你的代码在 GitHub：

1. 选择 **Connect to Git**
2. 连接 GitHub 仓库
3. 配置构建设置：
   ```
   Framework preset: Next.js
   Build command: npm run build
   Build output directory: .next
   ```

## 📋 检查清单

- [ ] 构建成功完成 (npm run build)
- [ ] 上传到 Cloudflare Pages
- [ ] 配置环境变量
- [ ] 设置自定义域名 topspm.com
- [ ] 验证网站可以正常访问
- [ ] 测试所有功能：
  - [ ] 主页加载
  - [ ] 案例研究页面
  - [ ] 知识库文章
  - [ ] 项目提交表单

## 🌟 网站特性

- ✅ 83个静态页面 (包括51个案例研究 + 20个知识库文章)
- ✅ 响应式设计
- ✅ SEO优化
- ✅ 快速导航系统
- ✅ 项目提交表单
- ✅ Sanity CMS 集成

## 📞 支持

如果部署过程中遇到问题，请检查：
1. 环境变量是否正确配置
2. 域名 DNS 记录是否正确
3. 构建日志中是否有错误