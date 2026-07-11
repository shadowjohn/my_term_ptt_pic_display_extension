Test results — hover-preview race fix

驗證步驟
1. 在專案根目錄執行：
   npm install
   npm test

輸出（本地執行）：

```
  img hover race
    ✔ does not let a previous slow load override the current preview


  1 passing (4ms)
```

環境註記
- 執行日期：2026-07-11
- 執行平台：Windows
- Node/npm：本地（見 package.json devDependencies: mocha, chai）
- 分支：fix/hover-preview-race

說明
此檔案用於將測試結果一並包含於 PR 的分支中，PR（#2）會自動顯示此 commit 的變更。
