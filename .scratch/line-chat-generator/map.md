# LINE 對話產生器

Label: wayfinder:map

## Destination

一份完整規格，照著它可以直接做出一個純前端網站：使用者輸入 LINE 風格的對話，網站輸出看起來像 iPhone LINE 截圖的 PNG。

## Notes

- 用詞以 repo 根目錄的 `CONTEXT.md` 為準（對話、我方、對方、匿名頭像、日期分隔線、已讀、單頁截圖、長截圖）
- 討論單子用 `/grilling` 和 `/domain-modeling`；試做單子用 `/prototype`；查資料單子用 `/research`，結果放在 `research/`
- 寫給使用者看的文字用白話中文
- 已經確定的範圍：
  - iPhone 版 LINE，淺色和深色模式都要
  - 個人對話、群組對話
  - 訊息只有文字；日期分隔線由訊息日期自動產生
  - 每則訊息可以設發送日期、時間和已讀；同一個人、同一分鐘內的訊息自動合併
  - 整段對話可以設：淺色或深色、標題列（群組名稱、人數、未讀數）、手機狀態列、要不要顯示輸入框；背景固定用 LINE 預設色
  - 畫面寬度照 iPhone 17 Pro Max（440pt）。輸出 PNG：單頁截圖是 iPhone 整個螢幕（1320×2868px），長截圖是 LINE 截圖功能的樣子（880px 寬、只有對話區、長度不限）
  - 頭像只能從內建的匿名頭像裡選
  - 純前端，不用登入，對話存在瀏覽器裡，可以匯出或匯入 JSON
  - 網站介面和截圖文字都只有繁體中文
  - 截圖字型是 Noto Sans TC 加 Inter，emoji 是 Noto Color Emoji，都從 Google Fonts 載入
  - 技術是 Vite + React + TypeScript；轉 PNG 用 snapdom（鎖定版本）；只支援電腦版 Chrome
  - 外觀做到乍看很像 LINE，不追求逐像素一致，預設不加浮水印

## Decisions so far

<!-- 每張完成的單子一行：[單子名稱](issues/NN-slug.md) — 結論一句話 -->

- [比較把網頁畫面轉成 PNG 的套件](issues/02-html-to-png-libraries.md) — 推薦 snapdom、備案 modern-screenshot；長截圖在 iPhone 上最高 16,384px（約 109 則訊息），電腦版 Chrome 約 436 則
- [截圖要用什麼字型](issues/03-screenshot-font.md) — 蘋方和 SF Pro 不能放上網站，推薦改用 Noto Sans TC 加 Inter，從 Google Fonts 載入
- [內建頭像從哪裡來](issues/04-avatar-sources.md) — 只用 CC0 的圖案，網站和截圖都不用標示出處。候選有 DiceBear 自己畫的角色、Notionists 或 Open Peeps 的人像，以及 Boring Avatars
- [瀏覽器裡要能存好幾段對話，還是一次只有一段](issues/06-saved-conversations.md) — 存好幾段，在對話清單裡切換，每次修改都自動存；匯入一律新增成新的對話；換我方時已讀不會跟著改
- [內建頭像要幾個、什麼風格](issues/05-avatar-set.md) — 照 LINE 匿名截圖的做法用物件圖案，共 12 個，圖用 Microsoft Fluent Emoji（MIT），網站要附授權說明頁
- [收集 iPhone LINE 實機截圖當比對標準](issues/01-iphone-line-reference-screenshots.md) — 收到 7 張截圖並量好顏色和尺寸；實機寬 440pt，同一個人同一分鐘內的訊息才合併，深色模式的我方氣泡是灰色
- [時間和已讀的規則](issues/07-time-and-read-rules.md) — 日期分隔線由訊息日期自動產生，「今天」「昨天」跟截圖日期比；預設 24 小時制，可以切換；同一個人、同一分鐘的訊息自動合併；訊息照清單順序顯示
- [整段對話設定的選項](issues/08-conversation-settings.md) — 只做 440pt 寬；單頁截圖是 iPhone 整個螢幕（1320px 寬），長截圖是 LINE 截圖功能的樣子（880px 寬、只有對話區）；背景只用 LINE 預設色
- [編輯介面：做一個粗略版讓你實際點點看](issues/09-editor-prototype.md) — 三欄：左欄是對話清單加輸入訊息區，中間是手機預覽，右欄是參與者和設定；點預覽裡的訊息跳出小視窗修改，拖拉排序；只做電腦版
- [選定轉 PNG 的套件，以及長截圖最多幾則訊息](issues/10-png-library-and-long-screenshot-limit.md) — 用 snapdom 並鎖定版本；長截圖最高 16,384px（約 186 則單行訊息），超過就不能下載，提示拆成兩段；只在 Chrome 上測
- [截圖字型、少見字和 emoji 要怎麼處理](issues/11-missing-characters-and-emoji.md) — 用 Noto Sans TC 加 Inter，emoji 用 Noto Color Emoji，都從 Google Fonts 載入；少見字不另外補；訊息字級實際約 16pt
- [網站要放在哪裡](issues/12-deploy-target.md) — GitHub Pages，帳號用 max8568，repo 叫 fake-message；repo 和網址公開，但禁止搜尋引擎收錄
- [畫面數值要寫進規格到多細](issues/13-spec-visual-detail.md) — 規格裡放最終數值表；做好後由使用者看過覺得像就算通過；圖示用 Lucide（ISC），狀態列圖示自己畫
- [把所有決定整理成實作用的規格](issues/14-write-spec.md) — 規格寫在 spec.md；最後兩節列出靠推測決定的事，以及整理時補上、要使用者確認的細節

## Not yet specified

<!-- 目前沒有。所有單子都已關閉，規格在 spec.md -->

## Out of scope

- Android 版 LINE 外觀
- 文字以外的訊息：貼圖、照片、LINE 自家的表情貼、回覆、收回、系統訊息、通話紀錄、語音、網址預覽（一般 emoji 可以打在文字裡，見「截圖字型、少見字和 emoji 要怎麼處理」）
- 動畫或影片輸出
- 上傳自己的頭像或圖片
- 繁體中文以外的語言
- LINE 字體大小設定
- 帳號、登入、後端儲存
- 同一段對話同時保留兩種視角（要另一個人的視角，就複製對話再換我方）
- 手機版的編輯介面：網站只在電腦上使用（見[編輯介面：做一個粗略版讓你實際點點看](issues/09-editor-prototype.md)）
