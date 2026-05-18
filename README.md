# Anosia's Space 🌌

> 你好旅行者~ 欢迎造访我的宇宙！

这里是 Vivian (Anosia) 的个人小站源码 —— 用来写博客、放项目、记录学习与生活。

## ✨ 关于这个站点

这是我的个人主页，目前正在香港理工大学读 **BSc Computer Science (Minor in Finance)**。建这个站主要是想：

- 📝 写博客 —— 技术笔记、学习心得、随笔杂谈
- 🚀 展示项目 —— 课程作业、自己折腾的小东西
- 🎓 留档教育经历
- 🪐 让有缘人能找到我

## 🛠️ 技术栈

| Tech | 用来做什么 |
| --- | --- |
| [Astro](https://astro.build/) | 静态站点生成框架（核心） |
| [Tailwind CSS](https://tailwindcss.com/) | 原子化 CSS 样式 |
| [TypeScript](https://www.typescriptlang.org/) | 类型安全 |
| [SolidJS](https://www.solidjs.com/) | 给少量需要状态的交互组件用 |
| Markdown / MDX | 写博客和项目内容 |

本站基于 [Astro Sphere](https://github.com/markhorn-dev/astro-sphere) 模板魔改而来，感谢 [@markhorn-dev](https://github.com/markhorn-dev)。

## 💻 本地运行

```bash
npm install        # 装依赖
npm run dev        # 启动开发服务器 → http://localhost:4321
npm run build      # 构建生产版本到 ./dist/
npm run preview    # 本地预览构建结果
```

更多命令见 `package.json` 的 `scripts` 字段。

## 📁 项目结构

```
src/
├── components/         # 可复用组件（Header、Footer、卡片等）
├── content/            # Markdown 内容
│   ├── blog/           # 博客文章
│   ├── projects/       # 项目展示
│   ├── education/      # 教育经历
│   └── legal/          # 隐私 / 条款
├── layouts/            # 页面布局
├── pages/              # 路由（一个文件 = 一个 URL）
├── consts.ts           # 站点信息、导航链接、社交链接
└── content/config.ts   # 内容集合的 schema 定义
```

## ✏️ 添加新内容

新建一篇博客：在 `src/content/blog/` 下创建文件夹和 `index.md`，frontmatter 格式参考已有文章。具体字段定义见 `src/content/config.ts`。

## 📝 License

模板部分（[Astro Sphere](https://github.com/markhorn-dev/astro-sphere)）使用 MIT License。

站点内的原创内容（博客文章、项目介绍、个人信息等）版权归 **Anosia** 所有，未经许可请勿转载。
