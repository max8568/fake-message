# 畫面數值要寫進規格到多細

Map: [LINE 對話產生器](../map.md)
Type: grilling (HITL)
Status: resolved
Blocked by: —

## Question

實機截圖已經量出顏色、尺寸、間距，記在 [research/01-reference-observations.md](../research/01-reference-observations.md)。規格要怎麼寫這些數值？

- 每個數值都直接寫進規格，例如「我方氣泡 #8CD032、圓角 12pt」
- 規格只寫「照觀察紀錄做」，數值留在觀察紀錄裡
- 做完之後要不要拿網站輸出的圖跟實機截圖並排比對，比對到什麼程度算合格

## Answer

- **數值放在哪裡**：規格裡放一張畫面數值表，只寫最後要用的顏色、尺寸、間距。觀察紀錄 [research/01-reference-observations.md](../research/01-reference-observations.md) 留著，當作這些數值怎麼量出來的依據。
- **驗收方式**：不另外做比對頁，也不訂數字門檻。網站做好後由使用者看過，覺得像就算通過。
- **圖示**：
  - 標題列和輸入框的圖示用 Lucide 圖示集，挑長得最接近的。Lucide 是 ISC 授權，網站的授權頁要放 Lucide 的授權文字。
  - 狀態列的訊號格、Wi-Fi、電池自己用簡單的 SVG 畫。
  - LINE 自己的圖示有著作權，不能用。iPhone 狀態列用的 SF Symbols 只能用在 Apple 平台，也不能用。
