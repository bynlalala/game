# 下載不到完整檔案時請先看這裡

如果你解壓縮後只看到：

```text
.gitkeep
某個 .json 檔
```

那不是完整的貓咪遊戲專案。

完整專案至少應該看到：

```text
README.md
index.html
package.json
manifest.webmanifest
src
test
```

## 為什麼會這樣？

最常見原因是：你下載到的是 GitHub 的 `main` 分支，但我的遊戲檔案目前是在 pull request / 工作分支裡，還沒有被合併到 `main`。

也就是說，你不是操作錯，而是你下載的那個 ZIP 裡本來就沒有遊戲檔案。

## 你現在應該怎麼做？

請先確認 GitHub 上這個 PR 已經被合併。如果還沒合併，直接從 `main` 按 **Code → Download ZIP** 下載，就只會拿到舊的、不完整的內容。

如果你有權限合併 PR：

1. 打開這個 PR。
2. 按 **Merge pull request**。
3. 合併完成後回到專案首頁。
4. 確認分支是 `main`。
5. 再按 **Code → Download ZIP**。
6. 解壓縮後確認有 `index.html`、`package.json`、`src`。

如果你不能合併 PR：

1. 請專案擁有者先合併 PR。
2. 或請他提供「這個 PR 分支」的 ZIP，而不是 `main` 的 ZIP。

## 確認下載正確

解壓縮後，如果你看不到 `index.html` 和 `src`，請不要執行 `npm install`，因為那份資料不是完整遊戲。
