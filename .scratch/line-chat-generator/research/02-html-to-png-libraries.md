# 把網頁畫面轉成 PNG 的套件：調查結果

對應單子：[issues/02-html-to-png-libraries.md](../issues/02-html-to-png-libraries.md)
查證日期：2026-10-05（snapdom 3.3.0、modern-screenshot 4.7.0、html-to-image 1.11.13、html2canvas 1.4.1、html2canvas-pro 2.5.1）

> 這份只看文件、原始碼和 issue，**沒有在實機上跑過**。表格裡「已知問題」都是別人回報、或我讀程式碼讀出來的，正式決定前要在真的 iPhone 上試一次（第 4 節最後有建議的試法）。

---

## 1. 結論

**推薦用 snapdom（npm 套件名 `@zumer/snapdom`），版本要鎖定，不要自動升級。** 理由：

- **長截圖超過瀏覽器上限時，只有它會自己處理。** 存成 PNG 檔時，它會把畫面一段一段畫，再接成一張完整的 PNG，不需要一張跟整張圖一樣大的畫布[^snap-readme-long][^snap-largepng]。其他套件遇到太高的圖，不是自動縮小（html-to-image 超過 16,384px 就縮）[^h2i-limit]，就是交給瀏覽器、結果變空白（modern-screenshot 有人回報長畫面輸出 0 KB）[^ms-57]。
- **中文字型只放用到的部分。** 它會比對畫面上實際出現的字，只嵌入有用到的字型分段（`unicode-range`）[^snap-fonts][^snap-features-fonts]。html-to-image 和 modern-screenshot 會把同一個字型名稱下的所有字型檔整包嵌進去，不看實際用到哪些字[^h2i-fonts][^ms-fonts][^ms-151]。
- **Safari 的幾個已知問題，程式裡有專門處理**：圖片第一次沒畫出來、陰影位置跑掉、iPhone 系統字級放大時字擠在一起[^snap-tocanvas-safari][^snap-features-safari][^snap-327]。
- MIT 授權，維護非常活躍（最近一個月發了 3.0 到 3.3 四個正式版）[^npm-snap]。

**要注意的風險：** 3.0 是 2026-09-14 才發的大改版，「長截圖分段存成 PNG」這個功能是 2026-09-27 才加進去的（3.2.0）[^snap-commit-large]，到今天才一週。發版很密，最近也出過「第一次截圖網頁字型沒畫出來」這種退步，隔兩天才修好[^snap-506]。所以要鎖版本、升級前重新測。

**備案：** modern-screenshot。用法和 html-to-image 幾乎一樣，比較穩定，但它沒有處理太高的圖，而且在 Safari 和 Firefox 上每多一張圖片就要多等約 0.1 秒以上（見第 4 節），長截圖頭像一多會很慢。如果 snapdom 在 iPhone 上試不過，再試 html2canvas-pro（另一種做法，自己把畫面重畫一次，見第 2 節開頭的說明）。

**不推薦：** html2canvas 原版（最後一次發版是 2022-01，之後沒有新版[^npm-h2c]）；html-to-image（超過 16,384px 會自動縮小、Safari 圖片空白的問題從 2023 年一直沒解[^h2i-361][^h2i-488]，最後一次發版是 2025-02[^npm-h2i]）。

### 長截圖最高能多高

輸出寬度固定 1170px。一則單行訊息約 50pt，放大 3 倍是 150px。下面的「約幾則」是把高度直接除以 150，**還沒扣掉標題列、狀態列、日期分隔線、輸入框**，實際能放的會少一些。

| 情況 | 最高 | 約幾則單行訊息 |
|---|---|---|
| iPhone（iOS Safari，iPhone 上的 Chrome 也一樣），用一張完整畫布 | **16,384px**（snapdom 實測的單邊上限，見第 3 節） | **約 109 則** |
| iPhone，用 snapdom 分段存成 PNG | 理論上不受畫布上限影響，實際會受記憶體影響，Apple 沒有公布數字 | 查不到 |
| 舊 iPhone（iOS 17 以前），用一張完整畫布 | 14,339px（總像素上限換算） | 約 95 則 |
| 桌機和 Android 的 Chrome | 65,535px | 約 436 則 |
| Firefox 149 以後 | 65,535px | 約 436 則 |
| Firefox 148 以前（含延長支援版 ESR 140） | 32,767px | 約 218 則 |

**建議的產品做法：** 如果要讓所有瀏覽器都能產生同一張圖，長截圖先設上限**約 100 則訊息**（高度在 15,000px 左右）。這個數字在 iPhone、舊 iPhone、Firefox 舊版都不會超過畫布上限，也不用依賴 snapdom 剛加入一週的分段輸出。要放更多，再用 snapdom 的分段輸出，並且在實機上測記憶體。單頁截圖只有 1170×2532px（以 844pt 高的 iPhone 畫面為例），約 300 萬像素，所有瀏覽器都沒問題。

---

## 2. 比較表

### 先說兩種做法的差別

- **用 SVG 包住網頁再畫成圖**（snapdom、modern-screenshot、html-to-image）：把畫面複製一份，所有樣式寫死在每個元素上，字型和圖片轉成 base64 文字塞進去，包成一張 SVG 圖，再讓瀏覽器把這張 SVG 畫到畫布上[^h2i-how]。畫出來的東西是瀏覽器自己排版的，所以圓角、陰影、字距通常跟畫面一樣。缺點是 Safari 畫這種 SVG 時，裡面的圖片和字型有時還沒準備好就畫了，結果是空白（WebKit 回報單 39059 從 2010 年開到現在[^wk-39059]，字型的版本是 219770[^wk-219770]）。
- **自己把畫面重畫一次**（html2canvas、html2canvas-pro）：讀每個元素的位置和樣式，用畫布指令一筆一筆重畫。不用嵌入字型（直接用網頁已經載入的字型畫字）[^h2c-renderer-canvas]，但每一種 CSS 效果都要套件自己實作，沒實作到的就畫不出來或畫錯[^h2c-features]。

### 每個套件 × 每個問題

| | snapdom 3.3.0 | modern-screenshot 4.7.0 | html-to-image 1.11.13 | html2canvas 1.4.1 | html2canvas-pro 2.5.1 |
|---|---|---|---|---|---|
| **做法** | SVG 包網頁 | SVG 包網頁（從 html-to-image 分出來）[^ms-readme] | SVG 包網頁（從 dom-to-image 分出來）[^h2i-readme] | 自己重畫 | 自己重畫（從 html2canvas 分出來）[^h2cp-readme] |
| **3 倍輸出（390→1170）** | 可以。`scale: 3` 加 `dpr: 1`。`dpr` 預設是裝置的像素比，在 iPhone 上不設會變 9 倍[^snap-readme-size] | 可以。`scale: 3`，預設 1，不受裝置影響[^ms-options] | 可以。`pixelRatio: 3`，預設是裝置像素比[^h2i-readme] | 可以。`scale: 3`，預設是裝置像素比[^h2c-config] | 可以。同 html2canvas，README 特別提醒預設受裝置像素比影響[^h2cp-readme] |
| **網頁字型（自己的 woff2）** | 自動嵌入，只嵌有用到的字所在的分段[^snap-fonts][^snap-features-fonts] | 嵌入整個字型名稱下所有字型檔，不看用到哪些字（有人開單問，還沒做）[^ms-fonts][^ms-151] | 同 modern-screenshot，整包嵌入[^h2i-fonts] | 不用嵌入，直接用網頁已載入的字型[^h2c-renderer-canvas] | 同 html2canvas |
| **中文會不會變預設字型或缺字** | 字型沒嵌成功時會改用系統字型。最近修過兩次：Google Fonts 的 Noto Sans TC 沒嵌進去（2.24.16 修好）[^snap-493]；行動版瀏覽器多行中文下方錯位（2026-09-28 修好）[^snap-508] | 有人回報某些字型清單會讓字全部消失[^ms-84]；有人回報字寬算差一點點導致最後一個字換行[^ms-104] | Firefox 上讀不到字型名稱、直接出錯[^h2i-535] | iPhone Safari 上「/」「:」等字元和旁邊的字蓋在一起[^h2c-2910]；文字往下偏[^h2c-3024] | 查不到中文相關的未解問題（issue 全部關閉，見下方「未解 issue 數」） |
| **圓角（border-radius）** | 支援（瀏覽器自己畫） | 支援 | 支援 | 支援[^h2c-features] | 支援 |
| **陰影（box-shadow）** | 支援；Safari 上會改寫陰影避免位置跑掉[^snap-tocanvas-safari] | Safari 上 `scale: 2` 時陰影壞掉，未解[^ms-49] | 手機上陰影沒畫出來，未解[^h2i-454][^h2i-379] | 官方文件寫「不支援」[^h2c-features]，但 1.4.1 程式碼其實有畫陰影[^h2c-shadow-code]；有人回報畫錯，未解[^h2c-1856] | README 寫完整支援，含內陰影[^h2cp-readme] |
| **背景圖** | 支援，轉成 base64 嵌入[^snap-features-img] | 支援 | 支援；Firefox 第一次下載時背景圖不見[^h2i-432] | 支援 `url()` 和漸層[^h2c-features] | 支援 |
| **SVG 頭像** | `<img>` 引用的 SVG 和直接寫在頁面裡的 `<svg>` 都支援[^snap-features-img] | 有針對 Safari、Firefox 解 SVG 圖的修正（每張圖多畫一次）[^ms-options] | Safari 上 `<img>` 引用 SVG 會空白，有人回報[^h2i-488][^h2i-402] | 有人回報 SVG 元素沒畫出來[^h2c-3175] | 查不到 |
| **Chrome 已知問題** | 3.0–3.1.0 第一次截圖網頁字型空白，3.1.1 修好[^snap-506] | 查不到重大未解問題 | 查不到重大未解問題 | — | — |
| **Safari / iOS 已知問題** | iPhone 第一次截圖空白（2025 修好）[^snap-107]；系統字級放大時字擠在一起（2026-05 修好）[^snap-327] | iPhone 上圖片載不出來（2023 已關閉）[^ms-2]；Safari 陰影問題未解[^ms-49] | 圖片有時空白、要截兩三次才完整[^h2i-361][^h2i-488]；有人在 iPhone 上量到「重截一次也不一定好」[^h2i-591] | 圖片空白、iOS 不能用等多張未解[^h2c-search-ios] | 查不到 |
| **Firefox 已知問題** | 手機版 Firefox 的幾個問題 2026-10-01 修好[^snap-516] | 某些畫面會讓 Firefox 停住不動，未解[^ms-173] | 大畫面會凍住[^h2i-536]；讀不到字型名稱[^h2i-535] | — | — |
| **圖太高時怎麼辦** | 單張畫布：Safari 單邊 16,384、其他 32,767，超過就縮小並警告；存成 PNG 檔：分段畫再接起來，不縮小[^snap-tocanvas-limit][^snap-readme-long] | 不處理。可設 `maximumCanvasSize` 讓它縮小，預設不縮[^ms-options][^ms-canvas] | 任一邊超過 16,384 就自動等比例縮小（寬度會跟著變窄），可用 `skipAutoScale` 關掉[^h2i-limit][^h2i-readme] | 查不到相關處理 | 查不到相關處理 |
| **授權** | MIT[^npm-snap] | MIT[^npm-ms] | MIT[^npm-h2i] | MIT[^npm-h2c] | MIT[^npm-h2cp] |
| **最近一次正式發版** | 3.3.0，2026-10-05[^npm-snap] | 4.7.0，2026-04-16[^npm-ms] | 1.11.13，2025-02-14[^npm-h2i] | 1.4.1，2022-01-22[^npm-h2c] | 2.5.1，2026-10-04[^npm-h2cp] |
| **最近一次程式碼更新** | 2026-10-05 | 2026-04-16 | 2026-05-28 | 2022-01-22（main 分支） | 2026-10-05 |
| **未解 issue 數** | 0（另有 365 張已關閉；作者修好就關，所以 0 不代表沒問題）[^gh-snap] | 65[^gh-ms] | 158[^gh-h2i] | 975[^gh-h2c] | 0（69 張已關閉）[^gh-h2cp] |
| **上週下載次數** | 約 69 萬[^dl] | 約 287 萬[^dl] | 約 885 萬[^dl] | 約 2,203 萬[^dl] | 約 216 萬[^dl] |

（issue 數、最近更新日期是 2026-10-05 用 GitHub API 查的。）

---

## 3. 各瀏覽器畫布上限

### 數字和出處

| 瀏覽器 | 單邊最長 | 總像素上限 | 寬 1170px 時最高 | 約幾則單行訊息（÷150） | 出處 |
|---|---|---|---|---|---|
| **Chrome**（桌機、Android 都一樣） | 65,535px | 268,435,456（32768×8192） | **65,535px**（單邊限制先到） | 436 | Chromium 原始碼[^cr-limit] |
| **Firefox 149 以後** | 65,535px | 1,073,741,823 | **65,535px** | 436 | Firefox 原始碼[^ff-pref-main][^ff-check]；改版紀錄[^ff-1911583] |
| **Firefox 148 以前**（含 ESR 140） | 32,767px | 沒有另外的總像素限制，記憶體限制約 2GB[^ff-pref-esr][^ff-factory] | **32,767px** | 218 | 同上 |
| **Safari（macOS）** | 畫布本身沒有單邊限制，只限總像素；但 SVG 套件實測單邊是 16,384（見下方說明） | 268,435,456（16384×16384） | 畫布本身 229,432px；**用 SVG 套件時 16,384px** | 1,529／**109** | WebKit 原始碼[^wk-limit]；snapdom 實測[^snap-tocanvas-limit][^snap-test] |
| **iOS Safari（目前版本）** | 同 macOS | **67,108,864（8192×8192）** | 畫布本身 57,358px；**用 SVG 套件時 16,384px** | 382／**109** | WebKit 原始碼[^wk-limit]；2024-03 的修改[^wk-ios-8192] |
| **iOS Safari（iOS 17 以前）** | 同上 | 16,777,216（4096×4096） | **14,339px** | 95 | 同上的修改紀錄寫「iOS 上的上限一直是 4096x4096」[^wk-ios-8192] |

### 怎麼讀這張表

- **iPhone 上所有瀏覽器的上限都一樣。** Apple 規定 iPhone 上的瀏覽器 App 都要用 WebKit（歐盟和日本可以申請例外）[^apple-256]，所以 iPhone 上的 Chrome、Firefox 跟 Safari 是同一套上限。
- **iOS 的 8192×8192 從哪一版開始，一手來源查不到確切版本。** WebKit 是 2024-03-15 改的[^wk-ios-8192][^wk-271002]，落在 Safari 技術預覽版 191 和 192 之間（192 的範圍從 2024-03 下旬開始[^stp-192]），照時間推算應該是 iOS 18 開始，但 Apple 的發版說明沒寫這一條。
- **MDN 寫「iOS 裝置限制在 4,096 × 4,096 像素」[^mdn-canvas]，這是舊的。** 而且 WebKit 原始碼限制的是總像素（寬×高），不是每一邊各 4096。
- **Safari 的 16,384 單邊限制，WebKit 原始碼裡我沒找到。** WebKit 的畫布程式碼只檢查總像素[^wk-limit]。16,384 這個數字來自 snapdom：它的程式碼註解寫「16384 是 WebKit 的數字」，測試裡也寫「WebKit 真的停在 16384」，所以那個測試在 WebKit 上跳過[^snap-tocanvas-limit][^snap-test]。用 SVG 做法的套件都要先讓瀏覽器把整張 SVG 解成圖，這個上限比較可能出在這一步，不是畫布本身。保守起見，iPhone 和 Mac Safari 都用 16,384 估。
- **超過上限會怎樣：** MDN 說超過上限的畫布不能用，畫什麼都不會出現[^mdn-canvas]。Safari 會在主控台印「Canvas area exceeds the maximum limit」並且不配置畫布[^wk-limit]；Firefox 會丟出「Canvas exceeds max size」錯誤[^ff-check]。使用者看到的就是空白圖或 0 KB 的檔案。
- **iPhone 的記憶體上限查不到。** WebKit 2023 年拿掉了 iOS 上「所有畫布加起來最多 384 MB」的限制，改成跟其他網頁功能一樣受系統記憶體管理，修改說明直接寫「這可能代表更多頁面會直接當掉，而不是畫不出來」[^wk-195325]（Safari 17 起[^safari17]）。一張 1170×57,358 的畫布要約 256 MB 記憶體（每像素 4 bytes），在 iPhone 上會不會讓頁面被系統關掉，Apple 沒有公布門檻。

### snapdom 的分段輸出能不能超過上限

可以，條件是用 `toBlob({ format: 'png' })` 或 `download({ format: 'png' })`，而不是 `toCanvas()` 或 `toPng()`[^snap-readme-long]。它的做法是每次只畫一小段（寬 1170 時每段約 3,584 列、約 16 MB），讀出像素後自己壓成 PNG，所以不需要一張完整大小的畫布[^snap-largepng]。需要瀏覽器有 `CompressionStream`，這個功能從 2023-05 起各大瀏覽器都有[^mdn-compression]。

限制：

- 這個功能 2026-09-27 才加入[^snap-commit-large]。
- 只有超過 snapdom 自己的門檻（Safari 單邊 16,384、其他 32,767、總像素 16384²）才會改用分段[^snap-largepng]。**iOS 17 以前**的總像素上限比 snapdom 的門檻低：高度在 14,339 到 16,384px 之間時，snapdom 不會分段，但畫布已經超過 iOS 17 的上限，結果可能是空白。這是我讀程式碼推出來的，沒有實測。
- snapdom README 自己也寫：很大的檔案還是要花時間和記憶體來壓，打開圖片的 App 也有自己的上限[^snap-readme-long]。iPhone「照片」App 能打開多高的圖，查不到 Apple 的說明。

---

## 4. 已知問題與注意事項

**3 倍輸出的設定，每個套件預設值不一樣。** snapdom 的 `dpr` 和 html2canvas、html-to-image 的預設都是「裝置像素比」，在 iPhone（像素比 3）上再設 3 倍會變 9 倍。snapdom 要寫 `scale: 3, dpr: 1`[^snap-readme-size]；html-to-image 寫 `pixelRatio: 3`（會取代預設值）[^h2i-readme]；html2canvas 寫 `scale: 3`[^h2c-config]；modern-screenshot 的 `scale` 預設是 1，不看裝置[^ms-options]。另外 snapdom 3.0 起，同時給 `width` 和 `scale` 時以 `width` 為準[^snap-readme-migrate]。

**html-to-image 遇到太高的圖會默默縮小。** 任一邊超過 16,384px 時，它會把整張圖等比例縮小到 16,384，寬度也跟著變窄，不會報錯[^h2i-limit]。例如 1170×20,000 會變成約 958×16,384。可以用 `skipAutoScale: true` 關掉，但 README 說關掉後大圖可能缺一部分[^h2i-readme]。

**Safari 畫 SVG 時圖片和字型可能還沒準備好。** WebKit 回報單 39059（SVG 裡的圖片第一次沒畫出來）從 2010 年開到現在還是未修[^wk-39059]；219770（SVG 裡的字型還沒載好就觸發載入完成）也還開著，2026-08 有一位回報者留言說 Safari 26.5.2 上範例已經正常，但不是 Apple 的正式回覆[^wk-219770]。各套件的對付方式不同：

- modern-screenshot：在 Safari 和 Firefox 上，畫面裡每有一張圖片，就多等一段時間再重畫整張畫布一次，第 i 次等 i+100 毫秒[^ms-canvas][^ms-fetch]。照這段程式碼算，長截圖如果有 200 個頭像 `<img>`，光等待就約 40 秒（200×100 毫秒，加上 0+1+…+199 毫秒），而且每次都重畫整張大畫布。這是我照程式碼算的，沒有實測；Firefox 上也有人回報這個機制讓頁面停住[^ms-173]。
- html-to-image：回報者建議連續截兩三次[^h2i-361]，但有人在 iPhone 上量到重截一次也不一定好[^h2i-591]。
- snapdom：在 Safari 上會等圖片和字型真的畫出來才回傳[^snap-features-safari]，程式裡有一段專門檢查畫布上有沒有東西[^snap-tocanvas-safari]。

**中文字型檔很大，嵌入方式會影響速度。** SVG 做法一定要把字型轉成 base64 放進圖裡[^h2i-how]。html-to-image 和 modern-screenshot 會把同一個字型名稱底下的所有 `@font-face` 都下載、轉碼，不看畫面用到哪些字[^h2i-fonts][^ms-fonts][^ms-151]。如果字型是 Google Fonts 那種切成很多分段的中文字型，就會全部下載。snapdom 只嵌有用到的分段[^snap-fonts]。不管用哪個套件，字型最好自己放一個只含需要字元的 woff2（這要跟單子 03「截圖要用什麼字型」一起決定）。

**html2canvas 的官方文件和程式碼對不上。** 文件寫不支援 `box-shadow`[^h2c-features]，但 1.4.1 的程式碼有畫陰影的部分（含內陰影）[^h2c-shadow-code]，改版紀錄也有「陰影加上圓角」的測試[^h2c-changelog]。實際效果有人回報畫錯，回覆是「改用 html-to-image 就好了」[^h2c-1856]。原版 README 自己寫「還在很實驗的階段，不建議用在正式環境」[^h2c-readme]。

**iPhone 系統字級放大時，snapdom 舊版會把字擠在一起。** 原因是 WebKit 在把 SVG 畫到畫布時又自動放大了一次字，但框的高度已經寫死。2026-05 修好[^snap-327]。其他套件有沒有同樣問題，查不到回報。

**snapdom 的 issue 數是 0，不代表沒問題。** 作者修好就關單，已關閉 365 張[^gh-snap]，最近一個月就有好幾張是「某個版本改壞、下一版修好」[^snap-506][^snap-508][^snap-516]。好處是回報後一兩天內就會修並發版（例如 #493 是 2026-09-07 回報、隔天發 2.24.16 修好[^snap-493]）。

**頭像如果用 SVG 檔，要特別測 Safari。** html-to-image 有人回報 Safari 上 `<img>` 引用的 SVG 會空白[^h2i-488][^h2i-402]。snapdom 寫有支援 SVG 圖片引用和頁面內的 `<svg>`[^snap-features-img]。頭像是單子 04、05 的範圍，那邊如果決定用 DiceBear 的 SVG，這裡要一起測。

### 建議的實機測試

在決定前，用 snapdom 做一個最小的測試頁，在**真的 iPhone**（最好一台 iOS 18 以上、一台 iOS 17）、Mac Safari、Chrome、Firefox 上各跑：

1. 單頁截圖：確認輸出是 1170px 寬、字型是自己的 woff2、圓角陰影頭像都在。
2. 長截圖 100 則：確認沒有被縮小、沒有空白。
3. 長截圖 300 則以上，用 `toBlob({ format: 'png', scale: 3, dpr: 1 })`：確認 iPhone 不會當掉、照片 App 打得開。
4. 第一次開頁面就按輸出（不是第二次）：確認頭像和字型第一次就出現。

---

## 5. 出處清單

### npm registry 與 GitHub 資料

[^npm-snap]: npm registry，`@zumer/snapdom`：https://registry.npmjs.org/@zumer/snapdom （3.3.0、MIT、發版時間；3.0.0 發佈於 2026-09-14）
[^npm-ms]: npm registry，`modern-screenshot`：https://registry.npmjs.org/modern-screenshot
[^npm-h2i]: npm registry，`html-to-image`：https://registry.npmjs.org/html-to-image
[^npm-h2c]: npm registry，`html2canvas`：https://registry.npmjs.org/html2canvas
[^npm-h2cp]: npm registry，`html2canvas-pro`：https://registry.npmjs.org/html2canvas-pro
[^dl]: npm 下載統計（2026-09-27 至 2026-10-03）：https://api.npmjs.org/downloads/point/last-week/@zumer/snapdom 、https://api.npmjs.org/downloads/point/last-week/modern-screenshot 、https://api.npmjs.org/downloads/point/last-week/html-to-image 、https://api.npmjs.org/downloads/point/last-week/html2canvas 、https://api.npmjs.org/downloads/point/last-week/html2canvas-pro
[^gh-snap]: https://github.com/zumerlab/snapdom （未解 issue 用 `repo:zumerlab/snapdom type:issue state:open` 查詢）
[^gh-ms]: https://github.com/qq15725/modern-screenshot/issues
[^gh-h2i]: https://github.com/bubkoo/html-to-image/issues
[^gh-h2c]: https://github.com/niklasvh/html2canvas/issues
[^gh-h2cp]: https://github.com/yorickshan/html2canvas-pro/issues

### snapdom

[^snap-readme-long]: snapdom README「Export a long page」：https://github.com/zumerlab/snapdom/blob/v3.3.0/README.md#export-a-long-page
[^snap-readme-size]: snapdom README「Set size and content」（`scale`、`dpr` 預設值）：https://github.com/zumerlab/snapdom/blob/v3.3.0/README.md#set-size-and-content
[^snap-readme-migrate]: snapdom README「Migrating from v2」：https://github.com/zumerlab/snapdom/blob/v3.3.0/README.md#migrating-from-v2
[^snap-largepng]: snapdom 原始碼 `src/exporters/toLargePng.js`（分段門檻、每段大小）：https://github.com/zumerlab/snapdom/blob/v3.3.0/src/exporters/toLargePng.js
[^snap-tocanvas-limit]: snapdom 原始碼 `src/exporters/toCanvas.js` 第 15–33 行（各瀏覽器門檻與註解）：https://github.com/zumerlab/snapdom/blob/v3.3.0/src/exporters/toCanvas.js#L15-L33
[^snap-tocanvas-safari]: 同檔案，Safari 陰影改寫與畫面檢查：https://github.com/zumerlab/snapdom/blob/v3.3.0/src/exporters/toCanvas.js#L323-L380
[^snap-test]: snapdom 測試 `__tests__/exporters.rasterLimit.test.js`：https://github.com/zumerlab/snapdom/blob/v3.3.0/__tests__/exporters.rasterLimit.test.js
[^snap-fonts]: snapdom 原始碼 `src/modules/fonts.js`（依 `unicode-range` 篩選）：https://github.com/zumerlab/snapdom/blob/v3.3.0/src/modules/fonts.js#L597-L740
[^snap-features-fonts]: snapdom FEATURES.md「Fonts & icon fonts」：https://github.com/zumerlab/snapdom/blob/v3.3.0/FEATURES.md
[^snap-features-img]: snapdom FEATURES.md（圖片、SVG、背景圖嵌入）：https://github.com/zumerlab/snapdom/blob/v3.3.0/FEATURES.md
[^snap-features-safari]: snapdom FEATURES.md 第 141 行（Safari 等圖片和字型畫好）：https://github.com/zumerlab/snapdom/blob/v3.3.0/FEATURES.md
[^snap-commit-large]: snapdom commit「feat: export PNG files beyond the canvas limit」（2026-09-27）：https://github.com/zumerlab/snapdom/commit/6e6b5ebb64
[^snap-506]: https://github.com/zumerlab/snapdom/issues/506
[^snap-508]: https://github.com/zumerlab/snapdom/issues/508
[^snap-493]: https://github.com/zumerlab/snapdom/issues/493
[^snap-516]: https://github.com/zumerlab/snapdom/issues/516
[^snap-327]: https://github.com/zumerlab/snapdom/issues/327
[^snap-107]: https://github.com/zumerlab/snapdom/issues/107

### modern-screenshot

[^ms-readme]: modern-screenshot README：https://github.com/qq15725/modern-screenshot/blob/v4.7.0/README.md
[^ms-options]: `src/options.ts`（`scale`、`maximumCanvasSize`、`fixSvgXmlDecode`、`drawImageInterval`）：https://github.com/qq15725/modern-screenshot/blob/v4.7.0/src/options.ts
[^ms-canvas]: `src/image-to-canvas.ts`（重畫迴圈、`maximumCanvasSize` 縮小）：https://github.com/qq15725/modern-screenshot/blob/v4.7.0/src/image-to-canvas.ts
[^ms-fetch]: `src/fetch.ts` 第 61–63 行、`src/embed-image-element.ts`（Safari、Firefox 每張圖加一次重畫）：https://github.com/qq15725/modern-screenshot/blob/v4.7.0/src/fetch.ts#L61-L63
[^ms-fonts]: `src/embed-web-font.ts`：https://github.com/qq15725/modern-screenshot/blob/v4.7.0/src/embed-web-font.ts
[^ms-151]: https://github.com/qq15725/modern-screenshot/issues/151
[^ms-57]: https://github.com/qq15725/modern-screenshot/issues/57
[^ms-49]: https://github.com/qq15725/modern-screenshot/issues/49
[^ms-84]: https://github.com/qq15725/modern-screenshot/issues/84
[^ms-104]: https://github.com/qq15725/modern-screenshot/issues/104
[^ms-173]: https://github.com/qq15725/modern-screenshot/issues/173
[^ms-2]: https://github.com/qq15725/modern-screenshot/issues/2

### html-to-image

[^h2i-readme]: html-to-image README（`pixelRatio`、`skipAutoScale`）：https://github.com/bubkoo/html-to-image/blob/v1.11.13/README.md
[^h2i-how]: html-to-image README「How it works」：https://github.com/bubkoo/html-to-image/blob/v1.11.13/README.md#how-it-works
[^h2i-limit]: `src/util.ts` 第 133–159 行（16,384 自動縮小）：https://github.com/bubkoo/html-to-image/blob/v1.11.13/src/util.ts#L133-L159 ；呼叫處 `src/index.ts`：https://github.com/bubkoo/html-to-image/blob/v1.11.13/src/index.ts#L28-L47
[^h2i-fonts]: `src/embed-webfonts.ts` 第 209–245 行：https://github.com/bubkoo/html-to-image/blob/v1.11.13/src/embed-webfonts.ts#L209-L245
[^h2i-361]: https://github.com/bubkoo/html-to-image/issues/361
[^h2i-488]: https://github.com/bubkoo/html-to-image/issues/488
[^h2i-591]: https://github.com/bubkoo/html-to-image/pull/591
[^h2i-454]: https://github.com/bubkoo/html-to-image/issues/454
[^h2i-379]: https://github.com/bubkoo/html-to-image/issues/379
[^h2i-402]: https://github.com/bubkoo/html-to-image/issues/402
[^h2i-432]: https://github.com/bubkoo/html-to-image/issues/432
[^h2i-535]: https://github.com/bubkoo/html-to-image/issues/535
[^h2i-536]: https://github.com/bubkoo/html-to-image/issues/536

### html2canvas、html2canvas-pro

[^h2c-readme]: html2canvas README：https://github.com/niklasvh/html2canvas/blob/master/README.md
[^h2c-features]: html2canvas 官方功能清單：https://html2canvas.hertzen.com/features （原始檔 https://github.com/niklasvh/html2canvas/blob/master/docs/features.md ）
[^h2c-config]: html2canvas 設定說明：https://html2canvas.hertzen.com/configuration
[^h2c-renderer-canvas]: `src/render/canvas/canvas-renderer.ts` 第 71 行（畫布建在原本的頁面）、第 147–205 行（用 `fillText` 畫字）：https://github.com/niklasvh/html2canvas/blob/v1.4.1/src/render/canvas/canvas-renderer.ts#L71
[^h2c-shadow-code]: 同檔案第 710–757 行（畫 box-shadow）：https://github.com/niklasvh/html2canvas/blob/v1.4.1/src/render/canvas/canvas-renderer.ts#L710-L757
[^h2c-changelog]: html2canvas CHANGELOG（1.2.0「update box-shadow with radius」）：https://github.com/niklasvh/html2canvas/blob/v1.4.1/CHANGELOG.md
[^h2c-1856]: https://github.com/niklasvh/html2canvas/issues/1856
[^h2c-2910]: https://github.com/niklasvh/html2canvas/issues/2910
[^h2c-3024]: https://github.com/niklasvh/html2canvas/issues/3024
[^h2c-3175]: https://github.com/niklasvh/html2canvas/issues/3175
[^h2c-search-ios]: html2canvas 未解 issue 中提到 iOS 的有 67 張，例如 https://github.com/niklasvh/html2canvas/issues/2514 、https://github.com/niklasvh/html2canvas/issues/1422
[^h2cp-readme]: html2canvas-pro README：https://github.com/yorickshan/html2canvas-pro/blob/main/README.md ；功能清單：https://github.com/yorickshan/html2canvas-pro/blob/main/docs/features.md

### 瀏覽器原始碼與文件

[^cr-limit]: Chromium `canvas_rendering_context_host.cc` 第 129–150 行（`kMaxCanvasArea = 32768 * 8192`、`kMaxSkiaDim = 65535`）：https://github.com/chromium/chromium/blob/e99717775be7711b4a4c74d2f0d09319482ae901/third_party/blink/renderer/core/html/canvas/canvas_rendering_context_host.cc#L129-L150
[^ff-pref-main]: Firefox `StaticPrefList.yaml`（`gfx.canvas.max-size = 0xffff`、`gfx.canvas.max-area = 0x3fffffff`）：https://github.com/mozilla-firefox/firefox/blob/63f1a659b30d8827af728e325031411db4ff34cc/modules/libpref/init/StaticPrefList.yaml#L7482-L7490
[^ff-pref-esr]: Firefox ESR 140 `StaticPrefList.yaml`（`gfx.canvas.max-size = 0x7fff`）：https://github.com/mozilla-firefox/firefox/blob/esr140/modules/libpref/init/StaticPrefList.yaml#L6645-L6648
[^ff-check]: Firefox `CanvasRenderingContext2D.cpp` 第 1776–1783 行：https://github.com/mozilla-firefox/firefox/blob/a3c328e4aff34a383827dc4b23f96001a3975428/dom/canvas/CanvasRenderingContext2D.cpp#L1776-L1783
[^ff-factory]: Firefox `gfx/2d/Factory.cpp` 第 197–227 行（記憶體配置上限檢查）：https://github.com/mozilla-firefox/firefox/blob/9811930bb1e730cb63f298b401c7cdb7d438340a/gfx/2d/Factory.cpp#L197-L227
[^ff-1911583]: Mozilla Bugzilla 1911583「canvas should support height and width up to 65,535 to match Chrome」，Target Milestone：Firefox 149：https://bugzilla.mozilla.org/show_bug.cgi?id=1911583
[^wk-limit]: WebKit `CanvasBase.cpp` 第 119–131 行（iOS `8192 * 8192`、其他 `16384 * 16384`）與第 274–288 行（超過時的處理）：https://github.com/WebKit/WebKit/blob/7ab124eb02518a622a79a6a7c9476bd7d7c1e538/Source/WebCore/html/CanvasBase.cpp#L119-L131
[^wk-ios-8192]: WebKit commit「[iOS] Increase the limit on the canvas size to 8192x8192」（2024-03-15，276145@main）：https://github.com/WebKit/WebKit/commit/d1f63c061eadee6c83dc9fa06a2725c3d099a86b
[^wk-271002]: WebKit Bugzilla 271002：https://bugs.webkit.org/show_bug.cgi?id=271002
[^stp-192]: Safari Technology Preview 192 發版說明（範圍 276247@main 起，2024-04-10）：https://webkit.org/blog/15260/release-notes-for-safari-technology-preview-192/
[^wk-195325]: WebKit commit「Canvas context allocation fails because "Total canvas memory use exceeds the maximum limit"」：https://github.com/WebKit/WebKit/commit/6bd11f3792f05b4e58e5647bf173212879fa62cc ；回報單：https://bugs.webkit.org/show_bug.cgi?id=195325
[^safari17]: WebKit Features in Safari 17.0（「Fixed Canvas context allocation failures due to exceeding the maximum canvas memory limit」）：https://webkit.org/blog/14445/webkit-features-in-safari-17-0/
[^wk-39059]: WebKit Bugzilla 39059「canvas drawImage does not render SVG with embedded images correctly」：https://bugs.webkit.org/show_bug.cgi?id=39059
[^wk-219770]: WebKit Bugzilla 219770「SVG with embedded font triggers img.onload before font is available」：https://bugs.webkit.org/show_bug.cgi?id=219770
[^mdn-canvas]: MDN `<canvas>`「Maximum canvas size」：https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/canvas
[^mdn-compression]: MDN `CompressionStream`：https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream
[^apple-256]: Apple App Review Guidelines 2.5.6：https://developer.apple.com/app-store/review/guidelines/
