# 網站要放在哪裡

Map: [LINE 對話產生器](../map.md)
Type: grilling (HITL)
Status: resolved
Blocked by: —

## Question

網站要部署到哪裡，還是只在自己電腦上跑？候選有：

- GitHub Pages
- Vercel
- Cloudflare Pages
- 只在本機用 `npm run dev` 或打開打包好的檔案

另外要決定：

- 網址要不要公開
- 要不要擋搜尋引擎收錄
- 部署前要不要先建 GitHub repo。這台機器有多個 gh 帳號，推送前要確認用哪一個

## Answer

- **放在哪裡**：GitHub Pages。推送到 repo 就自動更新網站。
- **帳號**：`max8568`。這台機器目前使用中的帳號是 `igs-hanhongchen`，推送前要先切換到 `max8568`，而且切換前要先問過使用者，不能直接切。
- **repo 名稱**：`fake-message`。網址是 `https://max8568.github.io/fake-message/`。
- **公開程度**：
  - repo 是公開的。
  - 網站是公開網址，但禁止搜尋引擎收錄：頁面加上 `<meta name="robots" content="noindex, nofollow">`，並放一個禁止所有爬蟲的 `robots.txt`。
- **打包設定**：GitHub Pages 的網址在 `/fake-message/` 底下，所以 Vite 的 `base` 要設成 `/fake-message/`。
