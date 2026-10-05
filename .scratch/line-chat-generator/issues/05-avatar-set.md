# 內建頭像要幾個、什麼風格

Map: [LINE 對話產生器](../map.md)
Type: grilling (HITL)
Status: resolved
Blocked by: 04

## Question

內建的匿名頭像要有幾個、用哪一種風格、從哪個來源取得？群組對話裡新增參與者時，要不要自動挑一個還沒用過的頭像？

## Answer

照 LINE「匿名截圖」功能的做法，用物件圖案當頭像，共 12 個。只用這一種風格。

LINE 自己的那 12 個圖示有著作權，也沒有開放授權給別人用，所以這 12 個頭像改用 Microsoft Fluent Emoji 的扁平版圖案（MIT 授權）。

| # | LINE 的物件 | 用的圖 | Fluent Emoji 檔名 | 底色 |
|---|---|---|---|---|
| 1 | 鉛筆 | 鉛筆 | `Pencil/Flat/pencil_flat.svg` | #FFE3E3 |
| 2 | 火箭 | 火箭 | `Rocket/Flat/rocket_flat.svg` | #E3F0FF |
| 3 | 蜜蜂 | 蜜蜂 | `Honeybee/Flat/honeybee_flat.svg` | #FFF4D6 |
| 4 | 電燈 | 電燈泡 | `Light bulb/Flat/light_bulb_flat.svg` | #E6F7EA |
| 5 | 棕櫚樹 | 棕櫚樹 | `Palm tree/Flat/palm_tree_flat.svg` | #F1E6FF |
| 6 | 橡實 | 栗子 | `Chestnut/Flat/chestnut_flat.svg` | #FFEBD9 |
| 7 | 企鵝 | 企鵝 | `Penguin/Flat/penguin_flat.svg` | #FFE3E3 |
| 8 | 冰棒 | 霜淇淋 | `Soft ice cream/Flat/soft_ice_cream_flat.svg` | #E3F0FF |
| 9 | 星球 | 有環的星球 | `Ringed planet/Flat/ringed_planet_flat.svg` | #FFF4D6 |
| 10 | 鬱金香 | 鬱金香 | `Tulip/Flat/tulip_flat.svg` | #E6F7EA |
| 11 | 海報 | 畫框 | `Framed picture/Flat/framed_picture_flat.svg` | #F1E6FF |
| 12 | 月亮 | 彎月 | `Crescent moon/Flat/crescent_moon_flat.svg` | #FFEBD9 |

檔案來源：https://github.com/microsoft/fluentui-emoji/tree/main/assets

- **外觀**：
  - 頭像是圓形，底色是淡色，圖案大約佔圓的 62%。
  - 每個頭像的底色是固定的，使用者不能換。
  - 定案的樣子見 [assets/avatar-set-final.html](../assets/avatar-set-final.html)。
- **圖檔**：開發時就把這 12 個 SVG 放進網站，不在瀏覽器裡即時產生。
- **新增參與者時**：自動挑一個這段對話裡還沒人用過的頭像，之後可以自己換。12 個都用掉之後，允許兩個人用同一個，不阻擋，也不跳警告。
- **授權**：網站要有一頁開源授權說明，放上 Fluent Emoji 的 MIT 授權全文。截圖上不需要標示。
- **其他比較過的選項**：
  - DiceBear 的 13 種風格和 Boring Avatars 的 4 種風格都比較過，見 [assets/avatar-candidates.html](../assets/avatar-candidates.html)。
  - 24 個物件頭像的試做版見 [assets/object-avatars.html](../assets/object-avatars.html)。
  - 三個替代圖的比較見 [assets/substitutes.html](../assets/substitutes.html)。
