# 比較把網頁畫面轉成 PNG 的套件

Map: [LINE 對話產生器](../map.md)
Type: research (AFK)
Status: resolved
Blocked by: —

## Question

在純前端（React）環境下，把預覽畫面的 DOM 輸出成 PNG，該用哪個套件？候選：html-to-image、modern-screenshot、html2canvas、snapdom，查資料時發現的其他候選也可以加進來。

每個套件要回答：

- 能不能用 3 倍解析度輸出（390px 寬的畫面輸出成 1170px）
- 網頁字型（自己載入的 woff2）會不會正確嵌入，中文會不會變成預設字型或缺字
- `border-radius`、`box-shadow`、背景圖、SVG 頭像能不能正確輸出
- 在 Chrome、Safari（含 iOS Safari）、Firefox 上的已知問題
- 授權、維護狀況（最近一次發版、未解 issue 數量）

另外要查：各瀏覽器的 canvas 寬、高、總像素上限是多少（特別是 iOS Safari），換算成 1170px 寬時，長截圖最多能多高。

## Answer

調查推薦用 snapdom（`@zumer/snapdom`），而且要鎖定版本。備案是 modern-screenshot。完整調查見 [research/02-html-to-png-libraries.md](../research/02-html-to-png-libraries.md)。這份調查只讀了文件、原始碼和別人回報的問題，還沒有在 iPhone 實機上跑過。

- snapdom 的長處：
  - 長截圖超過瀏覽器上限時，它會一段一段畫，再接成一張 PNG。其他套件遇到太高的圖，會自動縮小或輸出空白。
  - 中文字型只嵌入畫面上用到的字。
- snapdom 的風險：3.0 版是 2026-09-14 才發布的。長截圖分段接圖的功能是 2026-09-27 才加進去，到今天只有一週。發版很頻繁，最近也出過一次網頁字型沒畫出來的問題。
- 不推薦 html2canvas：2022 年之後就沒有新版。
- 不推薦 html-to-image：超過 16,384px 會自動縮小；Safari 輸出空白的問題從 2023 年到現在都沒修。

長截圖在各瀏覽器最高能多高（以 1170px 寬、一則單行訊息約 150px 估算）：

| 瀏覽器 | 最高 | 約幾則訊息 |
|---|---|---|
| iPhone 上所有瀏覽器 | 16,384px | 約 109 則 |
| iOS 17 以前的 iPhone | 14,339px | 約 95 則 |
| Chrome（電腦和 Android）、Firefox 149 以後 | 65,535px | 約 436 則 |
| Firefox 148 以前 | 32,767px | 約 218 則 |

單頁截圖是 1170×2532px，每個瀏覽器都沒問題。
