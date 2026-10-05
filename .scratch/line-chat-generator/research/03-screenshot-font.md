# 截圖要用什麼字型：調查結果

對應單子：[issues/03-screenshot-font.md](../issues/03-screenshot-font.md)
查證日期：2026-10-05（macOS 27 授權條款、iOS／iPadOS 27 授權條款、Google Fonts 上的 Noto Sans TC v40（字型版本 2.004）、Inter v20、Chromium main 分支、Firefox main 分支）

> 授權條款是直接讀 Apple 原文；字數和檔案大小是我把字型檔下載下來，用 Python 的 fontTools 實際算出來的（方法寫在第 4 節）。**「長得像不像蘋方」沒有任何一手資料可以引用**，這台是 Windows 電腦，沒有蘋方可以並排比較，要等有 iPhone 參考截圖（單子 01）後實際比對。

---

## 1. 結論

**蘋方和 SF Pro 都不能放上網站給訪客下載。**

- SF Pro 的授權寫明只能用來「做要在 Apple 系統上執行的軟體的介面草圖」，而且要是註冊的 Apple 開發者；也明寫不能用在網站內容、不能嵌進任何軟體或產品、不能放到網路上讓多台電腦同時使用[^sf-license]。
- 蘋方沒有單獨提供下載，是跟著 macOS／iOS 一起裝的字型[^apple-fontlist]，所以適用 macOS 本身的授權：系統裡的字型只能在蘋果電腦上用來顯示和列印，整套軟體不能轉發給別人，也不能裝在非蘋果的電腦上[^macos-sla]。把字型檔放到網站上，等於把它發給每個來訪的 Windows、Android 使用者。

**只在 CSS 寫 `-apple-system, "PingFang TC"` 不夠，輸出的 PNG 會因為使用者的電腦不同而不一樣。** iPhone 和 Mac 會顯示蘋方加 SF；Windows 的 Chrome 會顯示微軟正黑體加 Arial；Android 會顯示手機內建的 Noto Sans CJK 加 Roboto（細節在第 3 節）。微軟正黑體沒有 Medium 字重，名字用 Medium 的地方在 Windows 上會變成一般粗細。

**推薦組合：中文用 Noto Sans TC，英文和數字用 Inter，兩套都放在 Google Fonts 上，都是 OFL 授權（可以免費用在網站、可以自己架、可以只取部分字）。**

- CSS 字型順序寫 `"Inter", "Noto Sans TC", sans-serif`。Inter 裡沒有中文，中文字會自動改用 Noto Sans TC 顯示；英數字由 Inter 顯示，這跟 iPhone 上「英數字用 SF、中文用蘋方」的分工一樣。
- 頁面要標 `lang="zh-Hant-TW"`。沒標的話，在英文版 Windows 上 Chrome 會把中文當成簡體中文處理（第 3 節）。萬一網頁字型沒載到，退回去用的系統字也會選錯。
- 兩套都是可變字型，一個檔就同時有 Regular（400）和 Medium（500），LINE 用到的兩種粗細都有。
- 為什麼是這兩套：Noto Sans TC 是 Google 標明給台灣、澳門繁體中文用的黑體[^gf-notosanstc-desc]，跟 Adobe 的思源黑體是同一套設計[^google-blog-cjk]，是目前能免費用在網站上、字數最完整的台灣字形黑體。Inter 是給螢幕介面設計的無襯線字，數字之間的冒號會自動調到置中[^gf-inter-desc]，SF 顯示時間時也會這樣做[^apple-fonts-page]，LINE 的訊息時間都是「10:23」這種格式。**這兩點只是設計方向相近，不代表看起來一樣**，還是要拿實機截圖比對。

**怎麼載入：**

1. **平常預覽**：直接用 Google Fonts 的 CSS 網址。Google 把 Noto Sans TC 拆成 108 個小檔（以下叫「切片」），每片 1.5KB 到 85KB；瀏覽器只會下載畫面上有出現的字所在的切片。實測一段 104 個不同字的對話會下載 12 片，共約 760KB；整套 108 片全部下載是 4.3MB（第 4 節）。
2. **按下輸出 PNG 前**：先用瀏覽器的 `document.fonts.load()`，把整段對話的文字傳進去，等字型真的下載完再截圖[^css-font-loading]。不然可能截到還沒換好字型的畫面。單子 02 選的 snapdom 只會把有用到的切片放進截圖[^r02]，所以不會因為切片多而變慢。
3. **Google 的切片裡沒有的字**：Noto Sans TC 字型本身有 20,745 個字碼，Google 的切片只放了其中 12,371 個。少掉的大多是罕用字，但教育部 4,808 個常用字裡也有一個「甽」不在切片裡。使用者打到這些字時，那個字會改用使用者電腦的系統字顯示，各平台就會不一樣。可以用兩種方法補：
   - 輸出時另外向 Google 要一份「只含這段對話用到的字」的字型檔（Google Fonts 的 `text=` 參數[^gf-getting-started]）。實測這份檔會包含切片裡沒有的字，104 個字只有 16.6KB。但對話裡的不同字超過 800 個時，Google 會忽略這個參數；超過約 1,815 個字，網址太長會直接回錯誤（這兩個上限是實測的，Google 文件沒寫）。
   - 自己架一個「補字檔」，只放 Google 少掉的那 8,374 個字碼，約 2.5MB，用 `unicode-range` 宣告，只有使用者真的打到這些字時瀏覽器才會下載。OFL 允許這樣改檔再放上網站[^ofl-text][^ofl-faq]。

**還沒解決、要另外處理的：**

- **表情符號（emoji）**。Noto Sans TC 和 Inter 都沒有 emoji，使用者輸入 😂 會顯示各平台自己的 emoji 圖（iPhone 是 Apple 的，Windows 是微軟的），PNG 會明顯不一樣。Google Fonts 上有 OFL 授權的 Noto Color Emoji[^gf-emoji]，但它長得不像 iPhone 的 emoji。要不要統一、用哪一套，建議另開一張單子。
- **同一個字型在不同作業系統上畫出來，邊緣的像素可能有細微差異**（各系統的字型繪製方式不同）。這點沒查到一手資料，要在輸出功能做好後實測。地圖上已經定了「不追求逐像素一致」，這個差異應該可以接受。

---

## 2. Apple 字型授權

### SF Pro

SF Pro 可以從 developer.apple.com/fonts 下載，下載前要同意《LICENSE AGREEMENT FOR THE APPLE SAN FRANCISCO FONT》，副標題是「For iOS, OS X and tvOS application uses only」[^sf-license]。關鍵段落原文：

> IMPORTANT NOTE: THE APPLE SAN FRANCISCO FONT IS TO BE USED SOLELY FOR CREATING MOCK-UPS OF USER INTERFACES TO BE USED IN SOFTWARE PRODUCTS RUNNING ON APPLE'S iOS, OS X OR tvOS OPERATING SYSTEMS, AS APPLICABLE.

白話：這套字只能拿來做「要在 iOS、macOS、tvOS 上執行的軟體」的介面草圖。

> 2.A. Limited License. Subject to the terms of this License, you may use the Apple Font solely for creating mock-ups of user interfaces to be used in software products running on Apple's iOS, OS X or tvOS operating systems, as applicable. The foregoing right includes the right to show the Apple Font in screen shots, images, mock-ups or other depictions, digital and/or print, of such software products running solely on iOS, OS X or tvOS.
> You may use this Apple Font only for the purposes described in this License and only if you are a registered Apple Developer, or as otherwise expressly permitted by Apple in writing.

白話：可以出現在截圖或示意圖裡，但前提是那張圖畫的是「你自己要在 Apple 系統上推出的軟體」。而且只有註冊的 Apple 開發者可以用。我們的網站是讓任何人產生 LINE 對話截圖，不是在設計自己的 iOS app，不符合這個用途。

> 2.B. Other Use Restrictions. […] You may not embed the Apple Font in any software programs or other products. Except as expressly provided for herein, you may not use the Apple Font to, create, develop, display or otherwise distribute any documentation, artwork, website content or any other work product.
> Except as otherwise expressly permitted by the terms of this License or as otherwise licensed by Apple: (i) only one user may use the Apple Font at a time, and (ii) you may not make the Apple Font available over a network where it could be run or used by multiple computers at the same time.

白話：不能把字型放進任何軟體或產品；除了上面允許的用途，不能拿它做網站內容或其他作品；不能放在網路上讓多台電腦同時使用。把 SF Pro 的檔案放到網站讓訪客的瀏覽器下載，這三條都違反。

### 蘋方（PingFang TC）

- Apple 的字型下載頁只提供 SF Pro、SF Compact、SF Mono、New York 和幾套 SF 的其他語言版本，**沒有蘋方**[^apple-fonts-page]。
- 蘋方列在 Apple 的「macOS 27 內建字型」清單裡（PingFang TC 的 Ultralight、Thin、Light、Regular、Medium、Semibold 六種粗細），該頁說明這些字型「Most of these fonts are installed and enabled automatically. Others in this list can be downloaded using Font Book」[^apple-fontlist]。Apple 的 Pages 說明也寫 PingFang TC 是「Traditional Chinese for Taiwan」用的字型[^apple-pages]。
- 蘋方沒有自己的授權書，查不到 Apple 另外發布的蘋方授權條款，所以適用作業系統本身的授權。

macOS 授權（SOFTWARE LICENSE AGREEMENT FOR macOS, For use on Apple-branded Systems）裡關於字型的條文[^macos-sla]：

> E. Fonts. Subject to the terms and conditions of this License, you may use the fonts included with the Apple Software to display and print content while running the Apple Software; however, you may only embed fonts in content if that is permitted by the embedding restrictions accompanying the font in question. These embedding restrictions can be found in the Font Book/Preview/Show Font Info panel.

白話：macOS 附的字型，只能在執行 macOS 的時候用來顯示和列印內容。要把字型嵌進文件（例如 PDF），得看那套字型自己的嵌入設定，這個設定可以在 Mac 的「字體簿」裡看到。（蘋方的嵌入設定要在 Mac 上才看得到，這次沒有查。就算允許嵌入，講的也是把字放進文件，不是把字型檔放到網站上給人下載。）

同一份授權的其他條文[^macos-sla]：

> J. Other Use Restrictions. The grants set forth in this License do not permit you to, and you agree not to, install, use or run the Apple Software on any non-Apple-branded computer, or to enable others to do so. […] (ii) you may not make the Apple Software available over a network where it could be run or used by multiple computers at the same time. Except as expressly permitted in Section 3, you may not rent, lease, lend, sell, redistribute or sublicense the Apple Software.

白話：不能在非蘋果的電腦上使用，也不能讓別人這樣做；不能放在網路上讓多台電腦同時使用；不能轉發給別人。授權第 1 條把「fonts」列為 Apple Software 的一部分，所以蘋方也適用這幾條。

iPhone 的授權（iOS and iPadOS Software License Agreement）也寫了[^ios-sla]：

> 3. Transfer. You may not rent, lease, lend, sell, redistribute, or sublicense the Apple Software.

**結論：** 把蘋方的檔案放到網站上，是把 macOS／iOS 的一部分轉發給包括 Windows、Android 在內的訪客，條文明文禁止。

**另外一種情況**：如果 CSS 只寫字型名稱，網站沒有提供檔案，Mac 和 iPhone 使用者看到的蘋方是他們自己電腦裡本來就有的，網站沒有散布字型檔。但這樣做只有蘋果裝置看得到蘋方，解決不了各平台要一樣的需求（見第 3 節）。

---

## 3. 只寫 CSS 字型清單時，各平台實際會顯示的字

假設 CSS 寫的是 `font-family: -apple-system, BlinkMacSystemFont, "PingFang TC", sans-serif;`。

- `-apple-system` 只有 Apple 的瀏覽器引擎（WebKit）認得，在 iOS 和 macOS 上會用系統字 San Francisco；其他平台會跳過，改用清單裡的下一個[^webkit-system-font]。
- `BlinkMacSystemFont` 是 Chrome 在 Mac 上代表系統字的名稱，寫在 Chromium 的 Mac 專用程式裡[^chromium-blinkmac]。
- 名單裡的字型都沒有的時候，就用最後的 `sans-serif`。`sans-serif` 實際是哪一套字，由瀏覽器依平台和文字種類（繁中、簡中……）決定。

| 使用者的裝置 | 中文會顯示 | 英數字會顯示 | 依據 |
|---|---|---|---|
| iPhone（Safari） | 蘋方 | SF Pro | WebKit 說明[^webkit-system-font] |
| Mac（Safari） | 蘋方 | SF Pro | 同上 |
| Mac（Chrome） | 蘋方（`PingFang TC`） | SF Pro（`BlinkMacSystemFont`） | Chromium 的 Mac 預設：繁中無襯線字是「PingFang TC, Heiti TC」[^chromium-mac-grd] |
| Windows（Chrome） | 使用者自己裝過 Noto Sans TC 就用它，否則是**微軟正黑體** | **Arial** | Chromium 的 Windows 預設：英文無襯線字是 Arial，繁中是「Noto Sans TC, Noto Sans CJK TC, Microsoft JhengHei」[^chromium-win-grd]；Windows 11 內建字型清單裡沒有 Noto Sans TC[^win11-fonts] |
| Windows（Firefox） | 微軟正黑體 | Arial | Firefox 的 Windows 預設：繁中無襯線字是「Arial, Microsoft JhengHei, PMingLiU, …」[^firefox-prefs] |
| Android（Chrome） | 手機內建的 **Noto Sans CJK**（繁中字形） | **Roboto** | Android 系統字型設定：sans-serif 是 Roboto，繁中（zh-Hant）用 NotoSansCJK-Regular.ttc[^android-fonts] |
| Android（三星等品牌手機） | 可能是廠商自己的中文字 | 可能是廠商自己的字 | 沒查到廠商的一手資料。Firefox 的 Android 預設清單裡有一套「SEC CJK TC」[^firefox-prefs]，看名稱是三星的字型，代表確實有手機內建的不是 Noto |

**所以輸出的 PNG 一定會不一樣**：同一段對話，在 iPhone 上產生的是蘋方，在 Windows 上產生的是微軟正黑體，在 Android 上產生的是 Noto Sans CJK。

另外兩個會讓 Windows 結果更不像的細節：

- **沒標 `lang` 的時候，中文可能被當成簡體。** Chrome 決定「這段漢字是繁體還是簡體」的順序是：先看網頁標的 `lang`，沒有的話看使用者瀏覽器設定的偏好語言，再看系統語言；全都判斷不出來就當成簡體中文[^chromium-layout-locale]。Chrome 在 Windows 上的簡中字型是微軟雅黑（Microsoft YaHei）[^chromium-win-fallback]。所以英文版 Windows、瀏覽器語言也是英文的使用者，在沒標 `lang` 的網頁上會看到簡中字形的字。
- **微軟正黑體沒有 Medium。** Windows 11 內建的微軟正黑體只有 Light、Regular、Bold 三種粗細[^win11-fonts]。CSS 的規則是：要求 500（Medium）但字型沒有時，先找 500，找不到就往細的找[^css-fonts-matching]，所以會用 Regular。在 iPhone 上用 Medium 的地方，在 Windows 上會比較細。

---

## 4. 替代字型比較

### 比較表

| 字型 | 授權 | 檔案大小（woff2） | 繁中字數 | 粗細 | 跟蘋方／SF 像不像 | 建議 |
|---|---|---|---|---|---|---|
| **Noto Sans TC**（Google Fonts） | OFL 1.1[^gf-notosanstc-ofl] | 完整可變字型 5.4MB；只取 Regular 2.9MB；Google 切片全部 4.3MB（108 片，Regular 和 Medium 共用）；一段 104 字的對話約 760KB | 字型本身 20,745 個字碼，Big5 的 13,053 個漢字和教育部 4,808 個常用字全部都有；Google 切片少了約 8,400 個字碼（見下方） | 100–900 連續可調，Regular、Medium 都有[^gf-notosanstc-meta] | 都是黑體、都照台灣的字形寫。設計者不同（Noto 是 Adobe 和三家東亞字型公司做的[^google-blog-cjk]），**沒有一手資料比較過兩者外觀** | **中文用這套** |
| **思源黑體 TW**（Adobe Source Han Sans） | OFL 1.1，保留字型名稱「Source」[^shs-license] | 台灣版可變字型 woff2 5.4MB[^shs-readme] | 跟 Noto Sans TC 同一套設計[^google-blog-cjk]，Adobe 這邊版本較新（2.005，2025-06）[^shs-release] | 7 種粗細／可變 | 同 Noto Sans TC | 不用另外選。Google Fonts 沒有，要自己架、自己做子集。依 OFL，自己做子集後不能沿用「Source」這個名字（見下方） |
| **Noto Sans HK**／**Chiron Hei HK**（Google Fonts） | OFL[^gf-other-meta] | 未測 | 未測 | 可變 | 字形依香港標準。Google 標的主要語言是粵語（yue_Hant）[^gf-other-meta]；Apple 也把台灣用的 PingFang TC 和港澳用的 PingFang HK 分成兩套[^apple-pages] | 不建議，有些字的寫法跟台灣不同 |
| **Inter**（Google Fonts） | OFL[^gf-inter-meta] | Google 的拉丁字母切片 48KB（Regular 和 Medium 共用一個檔） | 沒有中文 | 100–900 可變，還有依字級調整字形的軸[^gf-inter-meta] | 都是給螢幕介面設計的無襯線字；數字之間的冒號會自動置中[^gf-inter-desc]，SF 也有這個設計[^apple-fonts-page]。**沒有一手資料比較過兩者外觀** | **英數字用這套** |
| Noto Sans TC 本身的英數字 | 同 Noto Sans TC | 不用另外下載 | — | 同上 | 沒有一手資料比較 | 如果實機比對後覺得 Inter 不像，可以改成只用 Noto Sans TC 一套 |
| 蘋方、SF Pro | Apple 授權，不能放上網站（第 2 節） | — | — | — | — | 不能用 |
| 微軟正黑體 | 跟著 Windows 一起裝的字型 | — | — | 沒有 Medium | 不像 | 不能放上網站，也只有 Windows 有 |

### 字數是怎麼算的

字型檔來源：Noto Sans TC 完整檔是 Google Fonts 的原始碼庫裡的 `NotoSansTC[wght].ttf`[^gf-notosanstc-repo]；切片是用 Chrome 的瀏覽器識別字串向 Google Fonts 要 CSS（`family=Noto+Sans+TC:wght@400;500`），再把 CSS 裡 108 個 woff2 全部下載。用 fontTools 讀每個檔實際有哪些字，再跟 CSS 裡每片宣告的 `unicode-range` 取交集（瀏覽器只會用落在宣告範圍內的字）。

| 字表 | 字數 | 完整字型缺幾個 | Google 切片缺幾個 |
|---|---|---|---|
| 教育部「常用國字標準字體表」[^moe-4808] | 4,808 | 0 | 1（甽） |
| Big5 A440–C67E 這一段（一般叫常用字區） | 5,401 | 0 | 18（杗阬姅甽涊偭梡詨跦穋歜毚縿燸霤鶸觼鑤） |
| Big5 C940–F9D5 這一段（一般叫次常用字區） | 7,652 | 0 | 3,403 |
| 整套字型 | 20,745 個字碼（其中約 17,700 個漢字） | — | Google 切片只有 12,371 個字碼（約 11,000 個漢字） |

Big5 對應 Unicode 用的是 Python 內建的 big5 編碼表；「常用字區／次常用字區」是一般的說法，我沒找到 Big5 標準原文的線上版本可以引用。

一般聊天用字（我、們、嗎、喔、欸、囉、裡、麼、啦、咧……）都在切片裡。切片少的主要是罕用字，但人名、地名有時會用到。

### 檔案大小與載入方式

| 做法 | 下載量 | 涵蓋的字 | 說明 |
|---|---|---|---|
| 整套 Noto Sans TC 可變字型 | 5.4MB（一次） | 全部 20,745 | 最簡單，但第一次開網頁要等 5.4MB |
| 只取 Regular 和 Medium 兩個固定粗細 | 2.9MB + 3.0MB | 全部 | 比可變字型更大，不划算 |
| **Google Fonts 切片**（推薦用在預覽） | 依畫面上的字而定：104 個字的對話約 760KB；最多 4.3MB | 12,371 | 瀏覽器自己判斷要哪幾片 |
| 自己做「教育部 4,808 字＋標點英數」子集 | 可變 1.5MB；只取 Regular 0.8MB | 常用字 | 不建議：使用者打到常用字以外的字就會改用系統字 |
| **Google Fonts `text=`**（推薦用在輸出前補字） | 104 個字 16.6KB | 你指定的字，包括切片裡沒有的字（實測「甽」「丮」都有） | 每段對話要重新要一次。800 個不同字以內有效，超過就會改回給 108 片的 CSS；約 1,815 字以上直接回錯誤（實測，Google 文件沒寫上限）[^gf-getting-started] |
| 自己架補字檔（Google 少掉的 8,374 字碼） | 可變 2.5MB，只在打到這些字時才下載 | 補齊整套字型 | 搭配 Google 切片用，用 `unicode-range` 宣告；也可以再拆小 |

Inter 的拉丁字母切片 48KB，Regular 和 Medium 是同一個檔，幾乎不影響速度。

Google 自己的說明：要求字型時加上 `text=`，「This allows Google to return a font file that's optimized for your request. In some cases, this can reduce the size of the font file by up to 90%」，也支援中文等非英文字[^gf-getting-started]。瀏覽器支援 `unicode-range` 時，「the browser will select from the subsets supported by the font to get what it needs to render the text」[^gf-getting-started]，也就是只下載需要的切片。

### 使用者自己輸入任意中文時，子集化會怎樣

- **事先做好的子集（例如只放常用字）一定會漏字。** 我們沒辦法事先知道使用者會打什麼。漏掉的字不會變成空格，瀏覽器會改用清單裡的下一個字型，也就是使用者電腦的系統字（第 3 節）。結果是 PNG 裡同一句話混了兩種字型，而且在不同平台上混的字型不一樣。
- **Google 切片是按需下載，不算事先固定。** 使用者打新的字，瀏覽器就去下載那個字所在的切片。問題只剩上面說的「Google 切片本來就少掉的 8,374 個字碼」。
- **輸出前一定要等字型下載完。** 使用者剛打的字，所在的切片可能還在下載。CSS 字型載入規格的 `document.fonts.load(字型, 文字)` 會只載入範圍包含這些文字的字型檔[^css-font-loading]，等它完成再截圖。

### 改字型檔再放上網站，OFL 允許嗎

OFL 原文（Noto Sans TC 附的授權書）[^ofl-text]：

> Permission is hereby granted, free of charge, to any person obtaining a copy of the Font Software, to use, study, copy, merge, embed, modify, redistribute, and sell modified and unmodified copies of the Font Software, subject to the following conditions: […]
> 3) No Modified Version of the Font Software may use the Reserved Font Name(s) unless explicit written permission is granted by the corresponding Copyright Holder.

白話：可以免費使用、複製、修改、轉發。改過的版本不能用「保留名稱」。

OFL 官方問答[^ofl-faq]：

> 2.1 Can I make webpages using these fonts? Yes! Go ahead! […] The referenced fonts can be hosted on the same server as other site assets and content, or loaded from a separate webfont service.

白話：可以用在網頁上，字型檔可以放在自己的伺服器，也可以從字型服務載入。

> 2.6 Is subsetting a webfont considered modification? Yes. Removing any parts of the font when delivering a webfont to a browser, including unused glyphs and smart font code, is considered modification. This is permitted by the OFL but would not normally allow the use of RFNs.

白話：只留部分字也算修改。可以做，但改過的檔通常不能沿用保留名稱。

> 1.1.1 Does that restrict the license or distribution of that artwork? No. You remain the author and copyright holder of that newly derived graphic or object.

白話：用這套字型做出來的圖（我們的 PNG），著作權屬於做圖的人，不受字型授權限制。

**對我們的影響：** Noto Sans TC 授權書上的保留名稱只有「Source」[^gf-notosanstc-ofl]，所以自己做的子集還可以叫 Noto Sans TC。思源黑體（Source Han Sans）的保留名稱就是「Source」[^shs-license]，自己做子集的話要改名。這也是推薦 Noto Sans TC、不推薦自己處理思源黑體的原因之一。

---

## 5. 出處

[^sf-license]: Apple Developer「Fonts」頁面內附的《LICENSE AGREEMENT FOR THE APPLE SAN FRANCISCO FONT》全文（IMPORTANT NOTE、第 2.A、2.B 條）：https://developer.apple.com/fonts/
[^apple-fonts-page]: Apple Developer「Fonts」頁面（可下載的字型清單、San Francisco 和 SF Pro 的介紹，含「When indicating time, for example, the colon in San Francisco switches to a vertically centered form」）：https://developer.apple.com/fonts/
[^apple-fontlist]: Apple Support「Fonts included with macOS 27 Golden Gate」：https://support.apple.com/en-us/127491
[^apple-pages]: Apple Support「Format Chinese, Japanese, or Korean text in Pages on Mac」（「Traditional Chinese for Taiwan: PingFang TC」「Traditional Chinese for Hong Kong and Macau: PingFang HK」）：https://support.apple.com/guide/pages/format-chinese-japanese-or-korean-text-tanfbd4156e/mac
[^macos-sla]: 《SOFTWARE LICENSE AGREEMENT FOR macOS》（macOS 27）英文版第 1 條、第 2.E、2.J 條：https://www.apple.com/legal/sla/docs/macOS27.pdf
[^ios-sla]: 《iOS AND iPadOS SOFTWARE LICENSE AGREEMENT》（iOS 27）英文版第 3 條：https://www.apple.com/legal/sla/docs/iOS27_iPadOS27.pdf
[^webkit-system-font]: WebKit Blog「Using the System Font in Web Content」：https://webkit.org/blog/3709/using-the-system-font-in-web-content/
[^chromium-blinkmac]: Chromium 原始碼 `third_party/blink/renderer/platform/fonts/mac/font_cache_mac.mm`（`LegacySystemFontFamily()` 回傳 `kBlinkMacSystemFont`）：https://github.com/chromium/chromium/blob/main/third_party/blink/renderer/platform/fonts/mac/font_cache_mac.mm
[^chromium-mac-grd]: Chromium 原始碼 `chrome/app/resources/locale_settings_mac.grd`（`IDS_SANS_SERIF_FONT_FAMILY_TRADITIONAL_HAN`）：https://github.com/chromium/chromium/blob/main/chrome/app/resources/locale_settings_mac.grd
[^chromium-win-grd]: Chromium 原始碼 `chrome/app/resources/locale_settings_win.grd`（`IDS_SANS_SERIF_FONT_FAMILY` 是 Arial；`IDS_SANS_SERIF_FONT_FAMILY_TRADITIONAL_HAN` 是「,Noto Sans TC,Noto Sans CJK TC,Microsoft JhengHei」）：https://github.com/chromium/chromium/blob/main/chrome/app/resources/locale_settings_win.grd
[^chromium-win-fallback]: Chromium 原始碼 `third_party/blink/renderer/platform/fonts/win/font_fallback_win.cc`（繁中「Noto Sans TC, Noto Sans CJK TC, Microsoft JhengHei, pmingli」；簡中「Noto Sans SC, Noto Sans CJK SC, Microsoft YaHei, simsun」）：https://github.com/chromium/chromium/blob/main/third_party/blink/renderer/platform/fonts/win/font_fallback_win.cc
[^chromium-layout-locale]: Chromium 原始碼 `third_party/blink/renderer/platform/text/layout_locale.cc`（`LocaleForHan()` 依序看網頁語言、偏好語言、預設語言、系統語言；`ComputeScriptForHan()` 判斷不出來時用 `USCRIPT_SIMPLIFIED_HAN`）：https://github.com/chromium/chromium/blob/main/third_party/blink/renderer/platform/text/layout_locale.cc
[^firefox-prefs]: Firefox 原始碼 `modules/libpref/init/all.js`（Windows：`font.name-list.sans-serif.zh-TW` = "Arial, Microsoft JhengHei, PMingLiU, MingLiU, MingLiU-ExtB, Noto Sans CJK TC, Noto Sans TC"；Android：= "Roboto, Google Sans, Droid Sans, Noto Sans TC, Noto Sans SC, Noto Sans CJK TC, SEC CJK TC, Droid Sans Fallback"）：https://github.com/mozilla-firefox/firefox/blob/main/modules/libpref/init/all.js
[^android-fonts]: Android 原始碼 `frameworks/base/data/fonts/fonts.xml`（`<family name="sans-serif">` 是 Roboto；`<family lang="zh-Hant,zh-Bopo">` 是 NotoSansCJK-Regular.ttc）：https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/data/fonts/fonts.xml
[^win11-fonts]: Microsoft Learn「Font List Windows 11」（Microsoft JhengHei 只有 Light、Regular、Bold；清單裡沒有 Noto 字型）：https://learn.microsoft.com/en-us/typography/fonts/windows_11_font_list
[^css-fonts-matching]: W3C CSS Fonts Module Level 4，字型比對規則（font-weight 在 400 到 500 之間時的尋找順序）：https://drafts.csswg.org/css-fonts-4/#font-style-matching
[^css-font-loading]: W3C CSS Font Loading Module，`FontFaceSet.load(font, text)`（「if its defined unicode-range does not include the codepoint of at least one character in text, remove it from the list」）：https://drafts.csswg.org/css-font-loading/
[^gf-getting-started]: Google Fonts 開發者文件「Get Started with the Google Fonts API」（`text=` 參數、`unicode-range` 說明）：https://developers.google.com/fonts/docs/getting_started
[^gf-notosanstc-desc]: google/fonts 原始碼庫 `ofl/notosanstc/DESCRIPTION.en_us.html`（「an unmodulated ("sans serif") design for languages in Taiwan and Macau that use the Traditional Chinese variant」）：https://github.com/google/fonts/blob/main/ofl/notosanstc/DESCRIPTION.en_us.html
[^gf-notosanstc-meta]: google/fonts 原始碼庫 `ofl/notosanstc/METADATA.pb`（license OFL、wght 100–900、來源 notofonts/noto-cjk）：https://github.com/google/fonts/blob/main/ofl/notosanstc/METADATA.pb
[^gf-notosanstc-ofl]: google/fonts 原始碼庫 `ofl/notosanstc/OFL.txt`（「Copyright 2014-2021 Adobe (http://www.adobe.com/), with Reserved Font Name 'Source'」）：https://github.com/google/fonts/blob/main/ofl/notosanstc/OFL.txt
[^gf-notosanstc-repo]: google/fonts 原始碼庫 `ofl/notosanstc/`（`NotoSansTC[wght].ttf`，版本 2.004）：https://github.com/google/fonts/tree/main/ofl/notosanstc
[^google-blog-cjk]: Google Developers Blog「Noto: A CJK Font That is Complete, Beautiful and Right for Your Language and Region」（2014-07-15；「Google will release it as Noto Sans CJK as part of Google's Noto font family. Adobe will release it as Source Han Sans」；設計由 Adobe 主導，常州華文、岩田、Sandoll 繪製字形）：https://developers.googleblog.com/noto-a-cjk-font-that-is-complete-beautiful-and-right-for-your-language-and-region/
[^shs-license]: adobe-fonts/source-han-sans `LICENSE.txt`（「with Reserved Font Name 'Source'」）：https://github.com/adobe-fonts/source-han-sans/blob/release/LICENSE.txt
[^shs-readme]: adobe-fonts/source-han-sans README（台灣版子集可變字型 `SourceHanSansTW-VF.ttf.woff2`，下載大小 5,374,996 bytes）：https://github.com/adobe-fonts/source-han-sans/blob/release/README.md
[^shs-release]: adobe-fonts/source-han-sans 最新版 2.005R（2025-06-18）：https://github.com/adobe-fonts/source-han-sans/releases/tag/2.005R
[^gf-other-meta]: google/fonts 原始碼庫 `ofl/notosanshk/METADATA.pb`、`ofl/chironheihk/METADATA.pb`（primary_language 都是 yue_Hant）：https://github.com/google/fonts/tree/main/ofl/notosanshk 、https://github.com/google/fonts/tree/main/ofl/chironheihk
[^gf-inter-meta]: google/fonts 原始碼庫 `ofl/inter/METADATA.pb`（license OFL、設計者 Rasmus Andersson、檔名 `Inter[opsz,wght].ttf`）：https://github.com/google/fonts/blob/main/ofl/inter/METADATA.pb
[^gf-inter-desc]: google/fonts 原始碼庫 `ofl/inter/DESCRIPTION.en_us.html`（「carefully crafted & designed for computer screens」「contextual alternates that adjusts punctuation depending on the shape of surrounding glyphs」）：https://github.com/google/fonts/blob/main/ofl/inter/DESCRIPTION.en_us.html
[^gf-emoji]: google/fonts 原始碼庫 `ofl/notocoloremoji/METADATA.pb`（license OFL）：https://github.com/google/fonts/blob/main/ofl/notocoloremoji/METADATA.pb
[^ofl-text]: SIL Open Font License 1.1 官方全文：https://openfontlicense.org/open-font-license-official-text/ （Noto Sans TC 附的版本是 google/fonts 原始碼庫裡的 `ofl/notosanstc/OFL.txt`）
[^ofl-faq]: OFL 官方問答（第 1.1.1、2.1、2.6 題）：https://openfontlicense.org/ofl-faq/
[^moe-4808]: 教育部語文成果入口網「常用字下載」（教育部 4808 個常用字 .ods）：https://language.moe.gov.tw/material/info?m=9fe3ff5a-5a8c-4817-9e60-6337dd55a509
[^r02]: 本專案 [research/02-html-to-png-libraries.md](02-html-to-png-libraries.md) 第 1 節（snapdom 依 `unicode-range` 只嵌入有用到的切片）
