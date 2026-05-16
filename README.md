# 喵喵小屋 Cat Nurture

一款以 iOS 手機體驗為優先的貓咪養成遊戲原型。玩家可以領養貓咪、替每隻貓取名並隨時修改，透過左右滑動在不同空間中照顧牠們。


## 重要：如果下載後完全沒有 `index.html`、`src`、`README.md`

如果你解壓縮後真的只有 `.gitkeep` 和一個 JSON 檔，請先停止。那份 ZIP 不是完整遊戲專案。

這通常不是你操作錯，而是你下載到 GitHub 的舊 `main` 分支；我的遊戲檔案是在 pull request / 工作分支裡，必須先合併，或直接下載 PR 分支，才會包含完整檔案。

請看 `DOWNLOAD_HELP.md`，裡面有更短的排錯說明。

## 先說重點：下載後變成 `.txt` 正常嗎？

不正常。這個遊戲不是一個 `.txt` 文字檔，而是一整個「資料夾專案」。資料夾裡應該至少看得到這些檔案與資料夾：

- `index.html`
- `package.json`
- `manifest.webmanifest`
- `src` 資料夾
- `test` 資料夾

如果你下載後只看到一個 `.txt` 檔，通常代表你只是把網頁上的文字複製下來，或瀏覽器把檔案另存成文字檔。請改用 GitHub 的 **Code → Download ZIP** 下載整個專案，下載完成後要先「解壓縮」。

## 完全新手啟動教學

### 第 1 步：下載整個專案

1. 打開這個專案的 GitHub 頁面。
2. 找到綠色的 **Code** 按鈕。
3. 點 **Download ZIP**。
4. 下載完成後，把 `.zip` 壓縮檔解壓縮。
5. 解壓縮後你應該會得到一個資料夾，而不是單一 `.txt` 檔。

### 第 2 步：安裝 Node.js

這個遊戲需要 Node.js 來執行開發指令。請到 Node.js 官方網站下載 **LTS** 版本並安裝：

<https://nodejs.org/>

安裝好之後，重新打開終端機。

### 第 3 步：打開終端機

終端機是用來輸入指令的工具：

- macOS：打開「終端機 Terminal」。
- Windows：打開「PowerShell」。

### 第 4 步：進入遊戲資料夾

請把下面的路徑換成你自己解壓縮後的資料夾位置。

如果你把資料夾放在桌面，macOS 通常可以輸入：

```bash
cd ~/Desktop/cat-nurture-ios-prototype
```

Windows PowerShell 通常可以輸入：

```powershell
cd "$HOME\Desktop\cat-nurture-ios-prototype"
```

如果出現「找不到指定的路徑」，代表資料夾名稱或位置不一樣。最簡單的做法是：先在檔案總管或 Finder 找到那個資料夾，再把資料夾拖進終端機視窗，終端機通常會自動貼上正確路徑。

### 第 5 步：安裝需要的東西

進入資料夾後，輸入：

```bash
npm install
```

這一步是準備專案環境。目前專案沒有額外套件，所以通常會很快完成。

### 第 6 步：啟動遊戲

輸入：

```bash
npm run start
```

看到終端機停在執行狀態是正常的，請不要關掉它。

### 第 7 步：打開瀏覽器測試

在瀏覽器打開：

```text
http://localhost:5173
```

如果你看到「喵喵小屋」畫面，就代表成功了。


## 常見錯誤：`Could not read package.json`

如果你看到類似這段錯誤：

```text
npm error enoent Could not read package.json
npm error path C:\game-main\package.json
```

意思是：你現在站在 `C:\game-main` 這個資料夾裡，但這個資料夾裡沒有 `package.json`。`npm install` 一定要在「有 `package.json` 的那一層資料夾」執行。

請照下面做：

1. 打開檔案總管。
2. 進入 `C:\game-main`。
3. 看看裡面是不是還有另一個資料夾，例如 `game-main`、`cat-nurture-ios-prototype`、`workspace`，或其他名字。
4. 一直點進去，直到你看得到 `package.json`、`index.html`、`src` 這幾個東西。
5. 在那個正確資料夾的空白處按住 `Shift`，再按滑鼠右鍵。
6. 選「在終端機中開啟」或「在 PowerShell 視窗中開啟」。
7. 再輸入：

```powershell
npm install
npm run start
```

如果你不確定自己目前在哪個資料夾，可以在 PowerShell 輸入：

```powershell
dir
```

如果 `dir` 的結果沒有看到 `package.json`，就代表你還沒有進到正確資料夾。



## 常見錯誤：`Missing script: "start"`

如果你看到：

```text
PS C:\Users\你的名字> npm run start
npm error Missing script: "start"
```

先說結論：這幾乎一定代表你現在不在遊戲資料夾裡。你現在的位置是 `C:\Users\你的名字`，也就是 Windows 使用者資料夾，不是下載後的遊戲資料夾。

這個專案的 `package.json` 裡確實有 `start` 指令，所以如果你站在正確資料夾，`npm run start` 不會出現 `Missing script: "start"`。

請照下面一步一步做：

1. 打開檔案總管。
2. 找到你下載並解壓縮後的遊戲資料夾。
3. 點進資料夾，確認畫面上看得到 `package.json`。
4. 在檔案總管上方的路徑列輸入 `powershell`，然後按 Enter。
5. 這樣 PowerShell 會直接在目前資料夾打開。
6. 在 PowerShell 輸入：

```powershell
dir
```

7. 確認清單裡有 `package.json`。
8. 再輸入：

```powershell
npm run start
```

如果 `dir` 沒看到 `package.json`，請不要執行 `npm run start`，因為你還是在錯的資料夾。

你看到的 `npm install` 成功和 `28 vulnerabilities`，很可能是在 `C:\Users\js974` 裡的其他 Node 專案跑出來的結果，不是這個貓咪遊戲專案。這個貓咪遊戲目前沒有額外 npm dependencies。

## 常見狀況：資料夾裡只有 `.gitkeep` 和一個 JSON 檔

如果你的資料夾裡只有：

```text
.gitkeep
某個 .json 檔
```

那代表你下載到的不是完整遊戲專案，或你打開的是錯的資料夾。完整遊戲專案不只兩個檔案，至少要看得到：

```text
README.md
index.html
package.json
manifest.webmanifest
src
test
```

請先不要執行 `npm install`，因為在錯的資料夾執行一定會失敗。請改成這樣檢查：

1. 在目前資料夾按 `Ctrl + F` 搜尋 `package.json`。
2. 如果找得到 `package.json`，請進入那個 `package.json` 所在的資料夾。
3. 如果完全找不到 `package.json`，代表你沒有下載到完整專案，請重新用 GitHub 的 **Code → Download ZIP** 下載。
4. 下載的是 `.zip` 壓縮檔時，一定要先解壓縮。
5. 解壓縮後，請進入真正包含 `package.json`、`index.html`、`src` 的那一層資料夾。

在 Windows PowerShell 也可以用下面指令幫你找 `package.json`：

```powershell
dir C:\ -Filter package.json -Recurse -ErrorAction SilentlyContinue
```

這個搜尋可能會跑比較久。找到後，請看它顯示的資料夾路徑，再用 `cd` 進入那個資料夾。


## Windows 注意：現在不需要 Python

如果你輸入 `python3 --version` 沒有任何結果，沒關係。這個專案現在已經改成不需要 Python。

請在有 `package.json` 的遊戲資料夾裡直接輸入：

```powershell
npm run start
```

成功時會看到：

```text
喵喵小屋已啟動：http://127.0.0.1:5173
請保持這個視窗開著。要停止伺服器請按 Ctrl + C。
```

看到這段後，請不要關掉 PowerShell，然後用瀏覽器打開：

```text
http://127.0.0.1:5173
```

## 已實作功能

- 貓咪養成主題，預設入住 7 隻貓。
- 每隻貓都有名字、個性、活力與毛色。
- 名字可在「貓咪名冊」中即時修改，並保存到瀏覽器 `localStorage`。
- 每個空間最多顯示 7 隻貓。
- 最多可領養 100 隻貓。
- 空間依序切換為客廳、前庭、陽台、書房等不同場景。
- 支援左右滑動、左右箭頭鍵與按鈕切換空間。
- 貓咪有走動、擺尾、歪頭等簡單自然動畫。
- 加入 Web App manifest，方便後續包裝成 iOS PWA 或接入 Capacitor。

## 開發指令

```bash
npm install
npm run start
```

啟動後開啟 `http://localhost:5173`。

## 檢查與測試

```bash
npm run check
npm test
```
