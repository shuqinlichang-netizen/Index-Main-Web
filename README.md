# Index Main Web

一个以个人主页为核心的静态前端项目，采用偏科幻/中控台风格的视觉语言，围绕 **Zorro / ZuoDev** 的个人展示、项目归档、技术记录与研究计划进行组织。

仓库当前主要展示了一个多阶段单页网站：从进入动画、授权过场，到主页、内容入口与研究计划面板，适合作为个人作品集首页或实验型品牌主页的前端原型。

## 项目预览

- 进入页：带有 Logo 动画、欢迎文案与进入按钮
- 授权过场：模拟系统验证/启动流程
- 首页：个人简介与快速联系方式入口
- 内容入口：Blog、GitHub、邮箱、QQ 等跳转/弹窗
- 研究计划区：展示当前重点项目与阶段性内容
- 多个 demo 页面：用于独立验证布局、动画与组件效果

## 技术栈

项目当前为原生静态站点实现，核心依赖包括：

- HTML5
- CSS3
- JavaScript（原生）
- [lottie-web](https://cdnjs.cloudflare.com/ajax/libs/lottie-web/5.9.4/lottie.min.js)（用于动画播放）

## 目录结构

```text
.
├─ index.html                         # 主入口页面
├─ demo.html                          # 部门布局 demo
├─ homepage-center-demo.html          # 首页中心视觉 demo
├─ research-progress-demo.html        # 研究进度组件 demo
├─ assets/
│  └─ images/                         # 图片、图标、背景等静态资源
├─ src/
│  ├─ scripts/
│  │  ├─ enter.js                     # 页面交互、切屏、状态与事件逻辑
│  │  ├─ site-copy.js                 # 页面文案配置
│  │  └─ rhine-logo-animation-data.js # Logo 动画数据
│  └─ styles/
│     ├─ base.css
│     ├─ enter.css
│     ├─ auth.css
│     ├─ homepage.css
│     ├─ headquarters.css
│     ├─ member.css
│     ├─ department.css
│     ├─ research.css
│     ├─ modal.css
│     └─ department-layout-demo.css
└─ .gitignore
```

## 页面说明

### 1. `index.html`
主页面，串联了完整的站点体验流程，包括：

- 进入页（Enter Screen）
- 授权过场（Auth Screen）
- 首页（Homepage）
- 其他模块化内容区块

页面通过 `src/scripts/enter.js` 驱动交互逻辑，并通过 `src/scripts/site-copy.js` 统一管理可替换文案。

### 2. Demo 页面
仓库中包含多个 demo 页面，便于单独调试某一块视觉或布局：

- `demo.html`：部门/卡片布局验证
- `homepage-center-demo.html`：首页中心视觉动画验证
- `research-progress-demo.html`：研究进度组件验证

## 本地运行

这是一个纯静态项目，直接打开 `index.html` 即可预览；如果你希望更稳定地调试资源路径，建议使用本地静态服务器。

### 方式一：直接打开

双击 `index.html`，或在浏览器中打开它。

### 方式二：使用 VS Code Live Server

如果你使用 VS Code，可以安装 **Live Server** 后启动项目。

### 方式三：使用任意静态服务器

例如：

```bash
npx serve .
```

然后在浏览器中访问本地地址。

## 可配置内容

项目中已经把部分站点内容抽离到 `src/scripts/site-copy.js`，你可以在这里快速修改：

- 品牌标题
- 进入页文案
- 首页简介
- Blog / 项目 / 技术笔记相关入口说明
- 研究计划区块内容
- 联系方式弹窗标题

链接与联系方式则在 `src/scripts/enter.js` 中的 `siteConfig` 里维护，例如：

- Blog
- GitHub
- 邮箱
- QQ
- 文章链接

## 适用场景

这个项目适合用于：

- 个人主页 / 个人品牌官网
- 技术作品集首页
- 博客导航页
- 具有实验感、系统面板感的视觉型落地页
- 前端动画与交互展示原型

## 后续可扩展方向

如果你准备继续迭代，这个项目可以进一步扩展为：

- 接入真实博客/API 数据
- 增加移动端适配细节
- 增加多语言支持
- 将原生静态页面拆分为组件化框架版本（如 Vue / React）
- 补充部署说明（GitHub Pages / Vercel / Netlify）
- 为项目卡片与研究计划增加后台可配置能力

## 注意事项

- 仓库中包含较多视觉资源，请保持 `assets/` 目录结构稳定，避免资源路径失效。
- `.gitignore` 当前会忽略大部分 Markdown 文件；如果后续有文档管理需求，建议按需调整规则。
- 某些设计源文件、视频或大型素材不适合直接发布时，可继续通过 `.gitignore` 管理。

## License

如需开源发布，建议补充明确的 License 文件；当前仓库未看到单独的许可证声明。
