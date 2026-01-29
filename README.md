# Astro + Cloudflare Pages + Decap CMS

这是一套面向中文用户、零成本部署的现代化博客方案，基于 Astro 官方 Blog 模板，并已接入 Tailwind CSS v4、Decap CMS 与 Giscus。

## ✅ 已完成

- Astro 官方 Blog 模板
- Tailwind CSS v4（使用 Vite 集成）
- 内容集合（Content Collections）
- Decap CMS 管理后台（/admin）
- Giscus 评论系统

## 🧭 需要设置的内容

1. 站点地址
	- 修改 [astro.config.mjs](astro.config.mjs) 中的 `site` 为你的真实域名。

2. Decap CMS 后台仓库
	- 修改 [public/admin/config.yml](public/admin/config.yml) 中 `backend.repo` 为你的 GitHub 仓库。
	- 若使用 OAuth，请配置 `auth_endpoint` 与 `base_url`。

3. Giscus 评论系统
	- 修改 [src/config.ts](src/config.ts) 中的 `giscusConfig`，填写 `repo`、`repoId`、`category`、`categoryId` 等信息。
	- 配置完成后将 `enable` 设为 `true`。

## ☁️ Cloudflare Pages 部署要点

- Build command：`npm run build`
- Output directory：`dist`
- Node 版本：建议 22+

本项目为纯静态输出，无需额外适配器即可部署到 Cloudflare Pages。

## 📝 内容管理

- 文章位于 `src/content/posts/`
- 图片默认写入 `src/assets/`，并在文章中以相对路径引用（例如 `../../assets/xxx.jpg`）
- Decap CMS 入口为 `/admin`

## 参考

- Astro 文档：https://docs.astro.build
- Tailwind 文档：https://tailwindcss.com
- Decap CMS：https://decapcms.org
- Giscus：https://giscus.app
