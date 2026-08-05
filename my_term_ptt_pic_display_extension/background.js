chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status !== "complete" || !tab.url ||
        (!tab.url.includes("term.ptt.cc") && !tab.url.includes("www.ptt.cc"))) {
        return;
    }

    chrome.scripting.executeScript({
        target: { tabId },
        files: ['vendor/jquery-4.0.0.min.js', 'previewRace.js', 'content.js']
    }).catch(error => console.error("PTT 圖片預覽注入失敗", error));
});
