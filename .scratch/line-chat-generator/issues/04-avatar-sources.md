# 內建頭像從哪裡來

Map: [LINE 對話產生器](../map.md)
Type: research (AFK)
Status: resolved
Blocked by: —

## Question

網站要內建一組沒有真人臉的頭像，可以從哪裡取得，授權允許放在網站上、也允許使用者把含頭像的截圖拿去公開使用？

候選：DiceBear（各風格授權不同，要逐一確認）、Boring Avatars、自己畫幾個 SVG，查資料時發現的其他來源也可以加進來。

每個來源要回答：授權條款（含是否需要標示出處）、有哪些風格、能不能離線產生（不呼叫外部 API）、輸出格式（SVG 或 PNG）。

## Answer

只用 CC0 授權的圖案。CC0 的圖案在網站上、使用者公開貼出的截圖上都不用標示出處。完整調查見 [research/04-avatar-sources.md](../research/04-avatar-sources.md)。

給「內建頭像要幾個、什麼風格」討論用的三個候選：

- **A. DiceBear 自己畫的角色**：Thumbs、Critters、Sprouts、Marbles、Moods 等，畫的是小角色，不是人。授權是 CC0。
- **B. DiceBear 的 Notionists 或 Open Peeps**：手繪的人像插畫。授權是 CC0，原作者的頁面也寫 CC0。
- **C. Boring Avatars**：幾何抽象圖案。程式碼是 MIT 授權，網站的「開源授權」頁要附上授權文字，截圖不用標示。

頭像不必在瀏覽器裡即時產生。開發時可以先用 DiceBear 產生一組固定的 SVG，跟網站一起發佈，每張約 1.6–16 KB。這樣網站不用帶 DiceBear 的程式碼。

不要用的：

- CC BY 4.0 的 14 種風格，例如 Adventurer、Micah、Personas、Fun Emoji。使用者分享截圖時也要標示作者，截圖上放不下。
- Lorelei。DiceBear 標示為 CC0，但原始檔頁面寫的是 CC BY 4.0，查不到作者本人確認過 CC0。

DiceBear 已經升到 10.x 版，Critters、Sprouts 這些新風格只有 10.x 的 `@dicebear/styles` 套件才有。
