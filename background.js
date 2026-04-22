const MENU_ID = "caesar-decode";
const MAX_LEN = 2000;
const UNINSTALL_URL = "https://caesarcipher.org/?utm_source=chrome-ext&utm_medium=uninstall";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_ID,
    title: "Decode as Caesar Cipher",
    contexts: ["selection"],
  });
  chrome.runtime.setUninstallURL(UNINSTALL_URL);
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID) return;
  const raw = (info.selectionText || "").trim();
  if (!raw) return;

  const text = raw.length > MAX_LEN ? raw.slice(0, MAX_LEN) : raw;
  const truncated = raw.length > MAX_LEN ? "1" : "0";

  const url = chrome.runtime.getURL(
    `result/result.html?text=${encodeURIComponent(text)}&truncated=${truncated}`
  );
  chrome.tabs.create({ url });
});
