# 截圖要用什麼字型

Map: [LINE 對話產生器](../map.md)
Type: research (AFK)
Status: resolved
Blocked by: —

## Question

iPhone 上的 LINE 中文顯示蘋方（PingFang TC），英數字用 SF Pro。這兩套字型能不能放到網站上給瀏覽器下載使用？如果不能，哪些授權允許網頁使用、看起來最接近的字型可以替代？

要回答：

- PingFang TC、SF Pro 的授權是否允許在非蘋果裝置的網頁上使用（引用 Apple 的授權條款原文）
- 只用 CSS 字型清單（例如 `-apple-system, "PingFang TC"`）時，在 Windows、Android 上會顯示成什麼字，輸出的 PNG 是否會不一樣
- 可替代的字型（例如 Noto Sans TC、Inter 等）：授權、檔案大小、繁中字數是否足夠、能不能只取用到的字來縮小檔案
- 推薦的組合

## Answer

蘋方和 SF Pro 都不能放上網站。SF Pro 的授權寫明不能用在網站內容。蘋方是跟著 macOS 和 iOS 安裝的字型，授權只允許在蘋果裝置上使用。完整調查見 [research/03-screenshot-font.md](../research/03-screenshot-font.md)。

如果 CSS 只寫字型清單，同一段對話在不同裝置上輸出的 PNG 會不一樣：

- iPhone、Mac：蘋方加 SF
- Windows：微軟正黑體加 Arial，而且沒有 Medium 粗細
- Android：Noto Sans CJK 加 Roboto

推薦的做法：

- 中文用 Noto Sans TC，英文和數字用 Inter。兩套都是 OFL 授權，可以用在網站上，也都有 Regular 和 Medium 兩種粗細。
- 網頁要標 `lang="zh-Hant-TW"`。
- 預覽時從 Google Fonts 載入。輸出前要等對話裡用到的字都載入完成，再轉成圖片。

要注意的事：

- **少見字會缺字**：Google Fonts 提供的版本只有 12,371 個字，比字型本身的 20,745 字少。有些教育部常用字也沒有，例如「甽」。有兩種補法：
  - 輸出時只向 Google 要這段對話用到的字。實測 104 字約 16.6KB，800 字以內可以用。這個上限是實測出來的，Google 的文件沒有寫。
  - 自己放一個缺字補充檔，約 2.5MB，打到缺字時才下載。
- **還沒確認跟蘋方像不像**：要等 iPhone 實機截圖來了再並排比對。
- **emoji 各平台長得不一樣**：這兩套字型都沒有 emoji。
