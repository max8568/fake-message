# 內建頭像從哪裡來：調查結果

對應單子：[issues/04-avatar-sources.md](../issues/04-avatar-sources.md)
查證日期：2026-10-05（DiceBear 目前版本 10.7.0，風格定義套件 `@dicebear/styles` 10.6.0）

> 以下是照授權原文整理的讀法，不是法律意見。授權以各出處的原文為準。

---

## 1. 結論

**最乾淨、網站和截圖上都不用標示出處的選項，是 CC0 授權的圖案。** CC0 的意思是作者放棄著作權，任何人可以複製、修改、商用，不必問、也不必寫作者是誰[^cc0]。網站上用、使用者把截圖貼到社群，都沒有額外義務。

給之後討論用的三個候選：

| 候選 | 長什麼樣子 | 授權 | 我們要做的事 |
|---|---|---|---|
| **A. DiceBear 自己畫的 CC0 角色風格**<br>例：Thumbs、Critters、Sprouts、Marbles、Moods、Gaze、Cameo、Shadows | 不是人的小角色：拇指形狀的小人、小怪獸、有表情的盆栽、圓球臉、剪影等 | CC0，作者就是 DiceBear 本身，沒有轉授權的問題[^lic][^lic-md] | 不用標示。網站的「開源授權」頁要放 DiceBear 程式碼的 MIT 授權文字（程式碼本身的條件，跟截圖無關）[^sw] |
| **B. DiceBear 的 Notionists 或 Open Peeps** | 看得出是「人」的黑線手繪插畫，半身、有髮型和小道具，但不是真人照片 | CC0。DiceBear 這樣標示[^lic]，原作者自己的頁面也寫 CC0：Notionists 作者寫明「不需要標示」[^notionists]，Open Peeps 作者寫「CC0，可個人及商業使用」[^openpeeps] | 同 A |
| **C. Boring Avatars** | 幾何抽象圖案：大理石紋、色塊、像素格、圓環、日落漸層，另有一款是簡單的眼睛加嘴巴 | 程式碼是 MIT[^ba-license]；圖案是程式即時畫出來的，沒有另外的美術授權 | 網站的「開源授權」頁放它的 MIT 授權文字。MIT 的條件是「軟體的複本」要附授權文字[^ba-license]，截圖上的圖案不是軟體複本，所以截圖不用標示（這是我的解讀） |

另外兩個做法：

- **自己畫 SVG**：著作權在自己手上，沒有任何授權義務，也不用裝套件。代價是要有人畫，數量和品質取決於投入的時間。如果外包，要在合約裡寫清楚著作權歸我們。
- **DiceBear 預先產生、存成固定檔案**：使用者只能從固定的一組裡挑，所以不一定要在瀏覽器裡即時產生。可以在開發時用 DiceBear 先產生好幾十張 SVG，跟網站一起發佈。這樣網站不用帶 DiceBear 的程式碼，每張 SVG 大約 1.6–16 KB（我用套件實際產生量到的，見第 2 節）。授權義務跟 A、B 一樣。

**要避開的：**

- **所有 CC BY 4.0 的風格**（Adventurer、Big Ears、Big Smile、Croodles、Dylan、Fun Emoji、Glyphs、Micah、Miniavs、Personas、Toon Head 等 14 個）。CC BY 規定「分享這份素材的人」都要標示作者、附授權連結、註明有沒有修改[^ccby-legal]。使用者把截圖貼到社群也算分享，所以理論上每張截圖都要附出處，這在截圖上做不到。
- **Lorelei、Lorelei Neutral**：DiceBear 網站標 CC0[^lic]，但 DiceBear 列出的原始檔（Figma 社群檔）頁面上寫的是「Licensed under CC BY 4.0」[^lorelei-figma]。Figma 社群的免費檔案一律以 CC BY 4.0 發佈，作者可以另外加授權[^figma-lic]，所以兩者不一定衝突，但原作者 Lisa Wischofsky 本人有沒有同意 CC0，我在一手來源裡查不到。在查清楚以前不建議用。

---

## 2. 比較表

| 來源 | 授權 | 要不要標示出處 | 能否商用 | 截圖公開貼出有沒有限制 | 風格 | 能否離線產生 | 輸出格式 | 大小 |
|---|---|---|---|---|---|---|---|---|
| **DiceBear（CC0 風格，42 個）** | CC0 1.0[^lic] | 不用[^cc0] | 可以[^cc0] | 沒有 | 見第 3 節 | 可以。JS 套件在瀏覽器裡產生，不連網[^privacy]；我在本機用 Node 跑過，沒有網路請求也能產生 | SVG[^js]；要 PNG 可用 `@dicebear/converter`，文件寫瀏覽器可用[^converter] | 見下方「大小」 |
| **DiceBear（CC BY 4.0 風格，14 個）** | CC BY 4.0[^lic] | **要**，而且分享的人都要[^ccby-legal] | 可以[^lic] | **有**：貼截圖的人也要標示 | 見第 3 節 | 同上 | 同上 | 同上 |
| **DiceBear（Icons 風格）** | MIT（Bootstrap Icons）[^lic] | 網站要附 Bootstrap Icons 的授權文字[^lic] | 可以 | MIT 文字沒有講到圖片截圖，我判斷不出來 | 一個 Bootstrap 圖示放在色塊上 | 同上 | 同上 | 同上 |
| **DiceBear（Avataaars、Bottts，4 個）** | 作者自訂：只有一句「Free for personal and commercial use」[^avataaars][^bottts] | 原文沒寫要標示 | 原文寫可以 | 原文沒寫。只有一句話，沒有正式條款可以查 | 卡通半身人像、機器人 | 同上 | 同上 | 同上 |
| **Boring Avatars** | MIT[^ba-license] | 網站要附 MIT 授權文字；截圖不用（我的解讀） | 可以 | 沒有 | 6 款：marble、beam、pixel、sunset、ring、bauhaus[^ba-readme] | 可以。套件是 React 元件，直接畫 SVG，程式碼裡沒有任何網路請求（我檢查過發佈檔） | SVG（React 元件）[^ba-readme] | 主程式 20 KB，gzip 後 3.4 KB；需要 React 18 以上[^ba-npm] |
| **Multiavatar** | 作者自訂的 Multiavatar License v1.0[^multiavatar] | 可標可不標[^multiavatar] | 可以[^multiavatar] | 沒有限制截圖；但限制「不能把這組頭像重新包裝成自己的產品」，只能當產品的附加功能[^multiavatar] | 多元文化的卡通人頭 | 套件內含產生器 | SVG | 未壓縮 2.8 MB[^multiavatar-npm] |
| **Microsoft Fluent Emoji（動物臉等）** | MIT[^fluent-license] | 網站附 MIT 授權文字 | 可以 | 沒有 | 微軟的表情符號，有貓臉、狗臉等動物 | 是固定圖檔，直接放進網站 | 每個符號有 3D（PNG）、彩色、扁平、高對比（SVG）四種[^fluent-assets] | 貓臉彩色 SVG 27 KB、扁平 SVG 2.6 KB[^fluent-assets] |
| **Kenney Animal Pack Remastered** | CC0[^kenney-pack][^kenney-faq] | 不用 | 可以 | 沒有 | 遊戲素材的動物圖案，共 240 個檔案[^kenney-pack] | 是固定圖檔 | 頁面沒寫格式，要下載才知道（這次沒有下載） | 查不到 |
| **自己畫 SVG** | 自己的 | 不用 | 可以 | 沒有 | 自己決定 | 是固定圖檔 | SVG | 自己決定 |

**DiceBear 的大小**（從 npm 發佈檔實際量的）：

- `@dicebear/core` 10.7.0：所有 JS 合計 420 KB，gzip 後約 47 KB。其中檢查風格定義的程式（StyleValidator）就佔 230 KB，而且產生頭像時一定會用到，所以很難再縮小[^core-npm]。
- `@dicebear/styles` 10.6.0：整包 7.7 MB，但每個風格是一個獨立的 JSON 檔，只會打包用到的那幾個[^styles-npm]。例如 Thumbs 12 KB（gzip 2.2 KB）、Critters 53 KB（gzip 4.8 KB）、Notionists 373 KB（gzip 114 KB）、Open Peeps 253 KB（gzip 95 KB）。各風格大小見第 3 節。
- 產生出來的單張 SVG：Thumbs 約 2.1 KB、Critters 2.5–3.3 KB、Sprouts 3.3–4.3 KB、Notionists 8–14 KB、Open Peeps 8.7–16 KB（各用 5 個不同的 seed 產生量的）。每張 SVG 裡都會附一段說明作者與授權的文字，轉成 PNG 後就不在了；CC0 風格本來就不需要這段文字。
- 不建議用 DiceBear 的線上 API（`api.dicebear.com`）：這樣就不是離線，而且官方限制每秒 50 次 SVG 請求，並寫明商用或要更高上限請自己架[^http-api]。

**關於 PNG**：頭像在畫面上用 SVG 顯示，最後跟整段對話一起轉成 PNG，這件事由「網頁轉 PNG 套件」那張單子（02）決定，不一定需要 DiceBear 的轉檔套件。SVG 放進畫面後轉 PNG 會不會出問題，這次沒有驗證。

---

## 3. DiceBear 各風格授權一覽

出處：DiceBear 授權頁[^lic]、npm 套件 `@dicebear/styles` 10.6.0 的 LICENSE.md[^lic-md]。我也把套件裡每個風格檔自帶的授權欄位讀出來比對，61 個風格跟授權頁完全一致。外觀說明摘自 DiceBear 各風格頁[^styles]。

大小欄是 `@dicebear/styles` 裡該風格 JSON 檔的大小（未壓縮 / gzip）。

### CC0 1.0（42 個）：不用標示、可商用、截圖不受限

| 風格 | 作者 | 外觀 | 大小 |
|---|---|---|---|
| Blobs | DiceBear | 同一色系、由深到淺疊起來的柔和色塊（抽象） | 13 KB / 2.3 KB |
| Cameo | DiceBear | 只有頭、頭髮和嘴巴，沒有眼睛，單一顏色兩種深淺 | 8 KB / 1.5 KB |
| Clay | DiceBear | 像黏土捏出來的圓團，臉很簡單，頭上有小角或捲毛 | 65 KB / 6.3 KB |
| Constellation | DiceBear | 夜空裡幾顆星連成星座（抽象） | 36 KB / 4.1 KB |
| Critters | DiceBear | 彩色小怪獸，圓身體、大眼睛，有角、耳朵或觸角 | 53 KB / 4.8 KB |
| Cutouts | DiceBear | 撕紙拼貼的臉，兩隻眼睛故意不一樣 | 24 KB / 4.2 KB |
| Disco | DiceBear | 網點般大小變化的小圖形（抽象） | 31 KB / 2.6 KB |
| Gaze | DiceBear | 一個彩色幾何形狀上只有一對眼睛 | 16 KB / 2.4 KB |
| Glass | DiceBear | 帶玻璃光澤的漸層，沒有圖形（抽象） | 10 KB / 2.2 KB |
| Identicon | DiceBear | 左右對稱的像素格圖案（抽象） | 3 KB / 0.9 KB |
| Initial Face | DiceBear | 一個大字母加上一對眼睛 | 7 KB / 1.8 KB |
| Initials | DiceBear | 一到兩個英文字母放在色塊上 | 2 KB / 0.7 KB |
| Landscape | DiceBear | 太陽和起伏的山稜線（抽象） | 28 KB / 5.9 KB |
| Line Face | DiceBear | 幾筆毛筆線畫的眼睛、鼻子、嘴巴，沒有臉的輪廓 | 7 KB / 1.1 KB |
| Loops | DiceBear | 弧線和波浪線排成的雙色圖案（抽象） | 10 KB / 1.3 KB |
| Lorelei | Lisa Wischofsky（DiceBear 改編） | 細黑線手繪人像，髮型很多。**原始檔頁面標 CC BY 4.0，見結論** | 118 KB / 36 KB |
| Lorelei Neutral | Lisa Wischofsky（DiceBear 改編） | Lorelei 只留五官。**同上** | 31 KB / 10 KB |
| Marbles | DiceBear | 彩色圓球上一張小臉，頭上有帽子、耳機、頭髮等 | 18 KB / 2.9 KB |
| Moods | DiceBear | 粉彩色塊加上簡單表情，從開心到愛睏到生氣 | 28 KB / 3.2 KB |
| Notionists | Zoish（DiceBear 改編） | 黑線手繪半身人像，拿著手機、咖啡杯等小道具 | 373 KB / 114 KB |
| Notionists Neutral | Zoish（DiceBear 改編） | Notionists 只留五官 | 53 KB / 16 KB |
| Open Peeps | Pablo Stanley（DiceBear 改編） | 草圖線條的手繪半身人像，髮型、表情、配件可組合 | 253 KB / 95 KB |
| Patchwork | DiceBear | 拼布圖案（抽象） | 7 KB / 1.2 KB |
| Pixel Art | DiceBear | 像素風的半身人物 | 45 KB / 4.9 KB |
| Pixel Art Neutral | DiceBear | Pixel Art 只留眼睛和嘴巴 | 16 KB / 2.1 KB |
| Pixelbot | DiceBear | 深色格子上用像素方塊畫的發光機器人臉 | 39 KB / 1.8 KB |
| Planets | DiceBear | 一顆行星，可能有環和衛星（抽象） | 26 KB / 3.7 KB |
| Rings | DiceBear | 分段的同心圓環（抽象） | 6 KB / 1.4 KB |
| Shadows | DiceBear | 單色的半身剪影，沒有五官 | 9 KB / 1.6 KB |
| Shape Grid | DiceBear | 2×2 格子裡的四個簡單形狀（抽象） | 6 KB / 1.3 KB |
| Shapes | DiceBear | 兩三個疊在一起的大幾何形狀（抽象） | 12 KB / 1.6 KB |
| Slice | DiceBear | 一個形狀橫切成幾條再左右錯開（抽象） | 36 KB / 2.7 KB |
| Sprouts | DiceBear | 有笑臉的盆栽：多肉、幼苗、鬱金香、小棕櫚 | 53 KB / 4.8 KB |
| Squircles | DiceBear | 一層層圓角方形（抽象） | 19 KB / 4.2 KB |
| Stack | DiceBear | 一疊平衡的石頭（抽象） | 10 KB / 1.8 KB |
| Stripes | DiceBear | 斜向的雙色條紋（抽象） | 4 KB / 1.0 KB |
| Thumbs | DiceBear | 單色、拇指形狀的小角色，有簡單的眼睛和嘴巴 | 12 KB / 2.2 KB |
| Triangles | DiceBear | 雙色三角形拼成的圖案（抽象） | 6 KB / 1.1 KB |
| Voxel Art | DiceBear | 用小立方體堆成的全身人物 | 138 KB / 8.6 KB |
| Voxel Bot | DiceBear | 用小立方體堆成的機器人，臉是螢幕 | 25 KB / 3.2 KB |
| Waves | DiceBear | 同一色系的波浪層（抽象） | 13 KB / 1.6 KB |
| Weave | DiceBear | 半透明粉彩條紋交織成格子布（抽象） | 6 KB / 1.1 KB |

### CC BY 4.0（14 個）：要標示作者、附授權連結、註明有修改；分享截圖的人也要

| 風格 | 原作者 | 外觀 | 大小 |
|---|---|---|---|
| Adventurer | Lisa Wischofsky | 粗線條卡通臉，髮型、眼鏡、耳環可換 | 285 KB / 99 KB |
| Adventurer Neutral | Lisa Wischofsky | Adventurer 只留五官 | 103 KB / 36 KB |
| Big Ears | The Visual Team | 大圓耳朵的卡通頭 | 75 KB / 17 KB |
| Big Ears Neutral | The Visual Team | Big Ears 只留眼睛和嘴巴 | 40 KB / 7.0 KB |
| Big Smile | Ashley Seo | 圓臉、露牙大笑的卡通頭 | 47 KB / 17 KB |
| Croodles | vijay verma | 黑色塗鴉線條的臉 | 93 KB / 22 KB |
| Croodles Neutral | vijay verma | Croodles 只留五官 | 25 KB / 5.6 KB |
| Dylan | Natalia Spivak | 粗輪廓、扁平插畫的臉，有鬍渣 | 14 KB / 5.7 KB |
| Fun Emoji | Davis Uche | 色塊上一張表情符號般的臉 | 36 KB / 8.8 KB |
| Glyphs | Matt Houser | 肩膀剪影加上符號形狀的帽子（抽象） | 10 KB / 1.8 KB |
| Micah | Micah Lanier | 扁平風半身人像，配色鮮明 | 29 KB / 7.9 KB |
| Miniavs | Webpixels | 矮胖的扁平風半身人物 | 13 KB / 3.6 KB |
| Personas | Draftbit | 扁平風半身人像，有膚色陰影、鬍子、眼鏡 | 31 KB / 7.3 KB |
| Toon Head | Johan Melin | 動畫風、比例接近真人的半身人像 | 33 KB / 10 KB |

### MIT（1 個）：網站要附 Bootstrap Icons 的著作權聲明和授權文字

| 風格 | 原作者 | 外觀 | 大小 |
|---|---|---|---|
| Icons | The Bootstrap Authors | 一個 Bootstrap Icons 圖示放在淡色底上 | 108 KB / 31 KB |

### 作者自訂條款（4 個）：原文只有一句「Free for personal and commercial use」

| 風格 | 原作者 | 外觀 | 大小 |
|---|---|---|---|
| Avataaars | Pablo Stanley | 很常見的卡通半身人像，髮型、衣服、配件、表情很多 | 125 KB / 41 KB |
| Avataaars Neutral | Pablo Stanley | Avataaars 只留五官 | 19 KB / 5.5 KB |
| Bottts | Pablo Stanley | 可組合的機器人頭 | 92 KB / 26 KB |
| Bottts Neutral | Pablo Stanley | Bottts 只留眼睛和嘴巴 | 69 KB / 23 KB |

這 4 個的原作者網站（avataaars.com、bottts.com）在 2026-10-05 查證時 HTTPS 憑證已經過期，頁面內容還讀得到，但除了那一句話以外沒有任何條款。

### 版本差異

舊版 DiceBear 9.x 只有 31 個左右的風格，而且用的是 `@dicebear/collection` 套件（最新 9.4.2）[^collection-npm]。Critters、Sprouts、Marbles、Moods、Gaze、Cameo、Shadows 這些 DiceBear 自己畫的新角色風格只在 10.x 才有。兩個版本都有的風格，抽查的幾個（Lorelei、Notionists、Open Peeps、Thumbs、Fun Emoji）授權相同[^lic-v9]。

---

## 4. 出處清單

[^lic]: DiceBear 授權頁（10.x）：https://www.dicebear.com/licenses/ ；同頁 Markdown 版：https://www.dicebear.com/licenses/index.md
[^lic-md]: `@dicebear/styles` 10.6.0 的 LICENSE.md（npm 發佈檔，與 GitHub 上的 https://github.com/dicebear/styles 同步）：https://registry.npmjs.org/@dicebear/styles/-/styles-10.6.0.tgz
[^sw]: DiceBear 程式碼的 MIT 授權：https://github.com/dicebear/dicebear/blob/10.x/LICENSE
[^styles]: DiceBear 風格一覽與各風格頁（例：https://www.dicebear.com/styles/thumbs/ ）；全部文件合併檔：https://www.dicebear.com/llms-full.txt
[^js]: DiceBear JavaScript 套件說明：https://www.dicebear.com/how-to-use/js-library/
[^privacy]: DiceBear 首頁「Privacy by design」段落，寫明用 JS 套件時頭像完全在自己的環境產生：https://www.dicebear.com/
[^converter]: DiceBear 轉檔套件說明（PNG 在瀏覽器和 Node.js 都支援）：https://www.dicebear.com/integrations/javascript/converter/
[^http-api]: DiceBear HTTP API 說明（速率限制、商用請自架）：https://www.dicebear.com/how-to-use/http-api/
[^core-npm]: npm `@dicebear/core` 10.7.0：https://registry.npmjs.org/@dicebear/core/latest ；發佈檔：https://registry.npmjs.org/@dicebear/core/-/core-10.7.0.tgz
[^styles-npm]: npm `@dicebear/styles` 10.6.0：https://registry.npmjs.org/@dicebear/styles/latest
[^collection-npm]: npm `@dicebear/collection` 9.4.2：https://registry.npmjs.org/@dicebear/collection/latest
[^lic-v9]: DiceBear 9.x 授權頁：https://v9.dicebear.com/licenses/
[^cc0]: CC0 1.0 說明：https://creativecommons.org/publicdomain/zero/1.0/
[^ccby-legal]: CC BY 4.0 法律條文第 3 節（分享素材時的標示義務）：https://creativecommons.org/licenses/by/4.0/legalcode.en
[^notionists]: Notionists 原作者 Zoish 的 Gumroad 頁（寫明 CC0、可商用、不需要標示）：https://heyzoish.gumroad.com/l/notionists
[^openpeeps]: Open Peeps 原作者 Pablo Stanley 的網站（寫明 CC0、可個人及商業使用）：https://www.openpeeps.com/
[^avataaars]: Avataaars 原作者網站：https://avataaars.com/
[^bottts]: Bottts 原作者網站：https://bottts.com/
[^lorelei-figma]: DiceBear 列為 Lorelei 原始檔的 Figma 社群頁（頁面標示 Licensed under CC BY 4.0，發佈者是 DiceBear）：https://www.figma.com/community/file/1198749693280469639
[^figma-lic]: Figma 說明中心「Figma Community copyright and licensing」：https://help.figma.com/hc/en-us/articles/360042296374-Figma-Community-copyright-and-licensing
[^ba-license]: Boring Avatars 的 MIT 授權：https://github.com/boringdesigners/boring-avatars/blob/master/LICENSE
[^ba-readme]: Boring Avatars README（6 種 variant、React 元件用法）：https://github.com/boringdesigners/boring-avatars
[^ba-npm]: npm `boring-avatars` 2.0.4：https://registry.npmjs.org/boring-avatars/latest ；發佈檔：https://registry.npmjs.org/boring-avatars/-/boring-avatars-2.0.4.tgz
[^multiavatar]: Multiavatar License v1.0：https://github.com/multiavatar/Multiavatar/blob/main/LICENSE
[^multiavatar-npm]: npm `@multiavatar/multiavatar` 1.0.7：https://registry.npmjs.org/@multiavatar/multiavatar/latest
[^fluent-license]: Microsoft Fluent Emoji 的 MIT 授權：https://github.com/microsoft/fluentui-emoji/blob/main/LICENSE
[^fluent-assets]: Fluent Emoji 貓臉的檔案夾（3D、Color、Flat、High Contrast）：https://github.com/microsoft/fluentui-emoji/tree/main/assets/Cat%20face
[^kenney-pack]: Kenney Animal Pack Remastered（240 個檔案、CC0）：https://kenney.nl/assets/animal-pack-remastered
[^kenney-faq]: Kenney 支援頁（所有素材都是 CC0）：https://kenney.nl/support

### 我自己量的數字怎麼來的

- 套件大小：從 npm registry 下載發佈檔，算檔案位元組數，並用 `gzip -9` 壓縮後再算。實際打包後的大小會因打包工具而不同。
- 單張 SVG 大小與「離線可用」：在本機用 Node 24 載入 `@dicebear/core` 10.7.0 和 `@dicebear/styles` 10.6.0，用 a 到 e 五個 seed 產生頭像，過程中沒有連網。
- Boring Avatars 沒有網路請求：在發佈檔 `dist/index.js` 裡搜尋 `fetch`、`XMLHttpRequest` 和網址，只找到 SVG 的命名空間網址。

### 查不到、沒有驗證的

- Lorelei 原作者本人是否同意 CC0。
- Kenney Animal Pack Remastered 的檔案格式（是否有 SVG）和大小，要下載才能確認。
- Avataaars、Bottts 除了「可個人及商業使用」那一句之外的任何條件。
- SVG 頭像放進畫面後，用網頁轉 PNG 套件輸出時會不會出問題（屬於單子 02 的範圍）。
