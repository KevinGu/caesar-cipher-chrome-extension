# Privacy Policy — Caesar Cipher Decoder Chrome Extension

**Effective date:** 2026-04-22

## Summary

This extension does not collect, transmit, or store any personal or usage data. Everything runs locally in your browser.

## What the extension does

When you right-click selected text and choose "Decode as Caesar Cipher", the selected text is passed as a URL parameter to a results page bundled inside the extension. That page computes 26 candidate plaintexts in JavaScript running entirely on your machine and displays them.

## What the extension does NOT do

- It does not read the contents of any web page. It only receives the text you explicitly select and pass to it via the context menu.
- It does not make any network requests. Outbound links in the results page only open when you click them, and they go to publicly-listed pages on `caesarcipher.org` and `github.com`.
- It does not use cookies, `localStorage`, `chrome.storage`, or any form of persistent storage.
- It does not use any analytics, telemetry, or third-party services.
- It does not share data with any third party (no data is collected in the first place).

## Permissions

The extension requests only one Chrome permission: `contextMenus`. This is required to add the "Decode as Caesar Cipher" entry to the right-click menu. It does not grant access to page contents or browsing history.

## Compliance statement (Chrome Web Store questionnaire)

- **Personally identifiable information (PII):** not collected.
- **User activity (clicks, browsing history, interaction data):** not collected or tracked.
- **Cross-site data transfer:** none — no data ever leaves the user's device.
- **Use for advertising purposes:** this extension does not serve ads and is not used for any ad-related purpose.
- **Use for credit, employment, insurance, or housing eligibility:** this extension is not used for any of these purposes.

## Data retention

Because no data is collected, transmitted, or stored, there is no data retention.

## Outbound links

The results page contains links back to `caesarcipher.org` (the companion website) and to this extension's GitHub repository. Clicking these links opens them in a new tab; standard web-tracking rules of those destinations apply, independently of this extension.

## Changes

If this policy changes, the updated version will be published at this same URL with a new effective date.

## Contact

Questions or concerns: open an issue at `https://github.com/KevinGu/caesar-cipher-chrome-extension/issues`.
