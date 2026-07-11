# Extension Source Split Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 將 jQuery 4.0.0、圖片資產與 PTT 業務程式拆開，同時維持 Chrome、Firefox 與打包流程可用。

**Architecture:** Chrome 的 service worker 依序注入本機 `vendor/jquery-4.0.0.min.js` 與 `content.js`。Firefox 產生器複製同一份來源，將兩檔登記為 content scripts；圖片由 `assets/` 實體檔透過 `chrome.runtime.getURL()` 取得。

**Tech Stack:** Manifest V3、Manifest V2、JavaScript、PHP、Mocha

---

### Task 1: 鎖定分檔與打包契約

**Files:**
- Create: `test/extension-package.test.js`

- [x] 先測試 Chrome/Firefox manifest 的注入順序、jQuery 版本、主檔不含 Base64、所有資產存在。
- [x] 執行 `npm test`，確認測試因尚未分檔而失敗。

### Task 2: 拆分 Chrome 原始碼

**Files:**
- Create: `my_term_ptt_pic_display_extension/content.js`
- Create: `my_term_ptt_pic_display_extension/vendor/jquery-4.0.0.min.js`
- Create: `my_term_ptt_pic_display_extension/assets/*.png`
- Modify: `my_term_ptt_pic_display_extension/background.js`

- [x] 將業務程式移至 `content.js`，事件 API 改用 `.on()`/`.off()`。
- [x] 將 Base64 PNG 解碼成實體檔，改用 extension URL。
- [x] 讓 background 只按順序注入兩個本機檔案。

### Task 3: 簡化 Firefox 產生與驗證

**Files:**
- Modify: `chrome2firefox.php`
- Modify: `package.json`

- [x] 產生器完整複製 Chrome 來源，Firefox manifest 登記 jQuery 與 content script。
- [x] 新增 `npm run build:firefox` 與 `npm run check`。
- [x] 執行產生器、全部測試、JS/PHP 語法檢查與 `git diff --check`。
