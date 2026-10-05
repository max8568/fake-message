# 截圖字型、少見字和 emoji 要怎麼處理

Map: [LINE 對話產生器](../map.md)
Type: grilling (HITL)
Status: resolved
Blocked by: 01, 03

## Question

根據「截圖要用什麼字型」的調查（[research/03-screenshot-font.md](../research/03-screenshot-font.md)），決定：

- 是否照調查推薦，中文用 Noto Sans TC、英數用 Inter。iPhone 實機截圖來了之後，可以先並排比對像不像再決定
- Google Fonts 版的 Noto Sans TC 缺少的少見字要怎麼補：
  - 輸出時只向 Google 要這段對話用到的字（800 字以內可以用）
  - 自己放一個約 2.5MB 的缺字補充檔
  - 不補，讓少見字退回使用者電腦的字型
- 使用者在文字訊息裡打 emoji（例如 😂）時，截圖要怎麼顯示：
  - 讓每個裝置畫自己的 emoji，輸出結果會因裝置而不同
  - 網站內建一套授權可用的 emoji 圖案，例如 Twemoji 或 Noto Emoji，每台裝置都一樣，但不會是 iPhone 的樣子

## Answer

字型比對頁：[assets/font-compare.html](../assets/font-compare.html)。左邊是 iPhone 實機截圖，中間是 Noto Sans TC 加 Inter，右邊是微軟正黑體。最下面另外比較兩種 emoji。

- **截圖字型**：
  - 中文用 Noto Sans TC，英文和數字用 Inter，都從 Google Fonts 載入。
  - 跟蘋方比，筆畫稍微粗一點，但字形很接近。
  - 不管用哪台電腦，輸出的圖都一樣。
- **少見字**：不另外補字。Google Fonts 版本裡沒有的字，會改用電腦本身的字型顯示，在 Windows 上是微軟正黑體。
- **emoji**：從 Google Fonts 載入 Noto Color Emoji。
  - 授權是 OFL，截圖上不用標示出處。
  - 每台電腦輸出的 emoji 都一樣。
  - iPhone 的 Apple emoji 有著作權，不能用。
- **訊息字級**：比對時發現，LINE 的訊息字級大約是 16pt，不是原本估的 17pt。已經改在 [research/01-reference-observations.md](../research/01-reference-observations.md)。
