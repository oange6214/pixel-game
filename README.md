# 像素風闖關問答遊戲 (Pixel Art Quiz Game)

這是一個以 2000 年代街機風格 (Pixel Art) 為主題的網頁問答遊戲。遊戲前端使用 React + Vite 建構，並透過 Google Apps Script (GAS) 將題庫與結算成績串接到 Google Sheets 進行管理。

## 專案功能特色
- 👾 **復古街機風格**：採用 `Press Start 2P` 像素字體與立體陰影按鈕，並加入 `DotGothic16` 支援中文字體的像素化呈現。
- 👤 **動態像素關主**：每次遊玩都會透過 DiceBear API 自動生成不同的像素風格關主圖片。
- 📊 **無伺服器後端**：利用 Google Sheets 與 Google Apps Script 作為輕量級的資料庫與後端 API。
- 🛡️ **防呆機制**：在未串接 GAS 的開發初期，系統會自動使用預設的 Dummy Data，讓開發體驗零中斷。
- 📝 **結算覆盤 (Review)**：遊戲結束後會自動整理作答結果，清楚標示使用者的答案與正確解答。
- 🚀 **CI/CD 自動打包**：內建 GitHub Actions 配置，發布更新一鍵自動部署至 GitHub Pages！

---


## 🛠️ 安裝與本地端執行

1. **安裝依賴套件**
   確保你的電腦已安裝 Node.js，接著在專案根目錄下執行：
   ```bash
   npm install
   ```

2. **啟動開發伺服器**
   ```bash
   npm run dev
   ```
   啟動後，開啟瀏覽器瀏覽終端機顯示的本地網址 (通常是 `http://localhost:5173`)。

---

## 📄 Google Sheets 與 Google Apps Script 設定教學

為了讓遊戲能正確讀取題庫與紀錄成績，請依照以下步驟設定您的 Google Sheets：

### 第一步：建立 Google Sheets 工作表
1. 建立一份新的 Google 試算表。
2. 建立兩個工作表，分別命名為：
   - **`題目`**
   - **`回答`**

### 第二步：設定欄位標題 (第一列)
在 **`題目`** 工作表的第一列依序填入以下標題：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| 題號 | 題目 | A | B | C | D | 解答 |

在 **`回答`** 工作表的第一列依序填入以下標題：
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| ID | 闖關次數 | 總分 | 最高分 | 第一次通關分數 | 花了幾次通關 | 最近遊玩時間 |

### 第三步：部署 Google Apps Script
1. 點擊試算表頂部選單的 **「擴充功能」 -> 「Apps Script」**。
2. 將編輯器內原本的程式碼清空，將本專案目錄下的 `gas_script.gs` 檔案內容完整貼上。
3. 點擊右上角的 **「部署」 -> 「新增部署作業」**。
4. 點選「選取類型」旁的齒輪圖示，選擇 **「網頁應用程式」**。
5. 設定如下：
   - 說明：(可留白或自訂)
   - 執行身分：**我**
   - 誰可以存取：**所有人** (非常重要，否則前端無法抓取資料)
6. 點擊「部署」，並在授權提示中允許存取。
7. 複製部署完成後顯示的 **網頁應用程式網址 (Web App URL)**。

### 第四步：設定專案環境變數
在專案根目錄下，您可以複製 `.env.example` 變成 `.env` 檔案，並將剛剛複製的 GAS 網址貼入對應欄位：
```env
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/你的部署ID/exec
VITE_PASS_THRESHOLD=3
VITE_QUESTION_COUNT=5
```
設定儲存後，重新啟動 `npm run dev` 即可完整串接！

---

## 🚀 GitHub Pages 自動化部署教學 (CI/CD)

本專案已為您準備好了 `deploy.yml` 腳本，只要將這份專案發布至您的 GitHub 儲存庫，就能免主機自動上架為公開網頁！

### 步驟 1：啟用 GitHub Pages 的 Actions 設定
1. 到 GitHub 儲存庫的 **Settings** -> 左側選單選 **Pages**。
2. 在 `Build and deployment` 的 **Source** 選單中，選擇 **GitHub Actions**。

### 步驟 2：設定 GitHub Secrets (專案金鑰) 能被編譯到網頁
因為 React Vite 只能讀取建置 (build) 當下的環境變數，您需要把機密的 API 網址貼給 GitHub 讓它知道如何打包進去：
1. 到 GitHub 儲存庫的 **Settings** -> 左側選單選 **Secrets and variables** -> **Actions**。
2. 切換到 `Secrets` 分頁 (環境機密)，點擊 **New repository secret**（或者可以去 `Variables` 分頁設定也可以）。
3. **依序新增以下三個變數**（設定值請參考您的 `.env` 或 `.env.example`）：
   - 名稱：`VITE_GOOGLE_APP_SCRIPT_URL` | 值：您的 Google Apps Script 部署 URL
   - 名稱：`VITE_PASS_THRESHOLD` | 值：自訂通關門檻 (例如 `3`)
   - 名稱：`VITE_QUESTION_COUNT` | 值：每次題目抽題數 (例如 `5`)

### 步驟 3：推送程式碼
以上都設定完畢後，直接 **Push / 提交程式碼到 GitHub 的 `main` 分支**。
等待 1~3 分鐘後點擊 GitHub 專案上的 **Actions** 頁籤，看到變成綠色勾勾就代表專案已經上線了！您可以再回去 **Settings -> Pages** 看見系統為您產生的專屬「公開發表網址」！

---

## 🎯 測試題庫：生成式 AI 基礎知識 (可直接複製貼上至 Google Sheets)

請將以下內容直接從「題號」開始圈選，複製後「貼上」到您 Google Sheets 的 **`題目`** 工作表第二列開始的位置（第一列請保留標題）：

| 題號 | 題目 | A | B | C | D | 解答 |
|---|---|---|---|---|---|---|
| AI-01 | 生成式 AI 的主要功能是什麼？ | 將文字轉為圖片 | 讓機器具有自我意識 | 產生新的文字、圖像或音訊 | 取代人類所有工作 | C |
| AI-02 | ChatGPT 是由哪家公司開發的？ | OpenAI | Google | Microsoft | Meta | A |
| AI-03 | GPT 的全稱是什麼？ | Generative Pre-trained Transformer | General Purpose Technology | Global Positioning Tracker | Graphic Processing Thread | A |
| AI-04 | 哪種技術用於將外部知識庫結合到 AI 生成內容中？ | RAG (檢索增強生成) | Prompt Engineering | Fine-tuning | SQL Injection | B |
| AI-05 | RAG 技術的主要優點之一是什麼？ | 確保 AI 不會犯錯 | 降低模型產生幻覺 (Hallucination) | 讓模型運算速度變快 | 減少伺服器耗電量 | B |
| AI-06 | 哪一個程式語言在開發 AI 模型中最普及？ | Python | HTML | C++ | Assembly | A |
| AI-07 | 哪個不是生成圖片的 AI 工具？ | DALL-E | Midjourney | Stable Diffusion | ChatGPT | D |
| AI-08 | RAG（檢索增強生成）中的「檢索」指的是什麼？ | 提供額外的外部知識庫供參考 | 擴充模型的參數量 | 改變模型的架構 | 重新訓練整個模型 | A |
| AI-09 | AI 的「幻覺 (Hallucination)」是指什麼？ | AI 模型學習到的錯誤或虛構資訊 | 螢幕顯示器故障 | 伺服器連線中斷 | 駭客入侵的現象 | A |
| AI-10 | 下列哪個是大語言模型 (LLM) 目前較容易面臨的挑戰？ | 一次只能處理一個字 | 沒有記憶能力 | 缺乏對人類情感的真正理解 | 無法處理數學問題 | C |

*(註：您可以根據需求自行替換選項內容或增刪題目。前端會自動隨機抽取 `VITE_QUESTION_COUNT` 數量的題目。)*
