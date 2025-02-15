// background.js – Background script running as a module.
// This script creates a context menu, generates a unique UID for each copy operation,
// intercepts the test GET request using the UID as a unique marker,
// compares the originalUrl and tabId to ensure uniqueness,
// and builds an aria2 command using captured request headers.
// ES2024, arrow functions, and async/await are used following the Airbnb style.

const TEST_PARAM = 'aria2test';
const CONTEXT_MENU_ID = 'copy-aria2-command';

// Map to hold pending requests. Key: UID, Value: { tabId, originalUrl }.
const pendingRequests = new Map();

// Helper to build the aria2 command.
const buildAria2Command = (originalUrl, requestHeaders) => {
    // Map each header into a --header option.
    const headersPart = requestHeaders
        .map(({name, value}) => `--header="${name}: ${value}"`)
        .join(' ');
    // Construct the aria2 command with minimal options:
    // -c for resume support, -s4 for 4 splits, -x4 for 4 connections per server.
    return `aria2 -c -s4 -x4 ${headersPart} "${originalUrl}"`;
};

// Create a context menu item for links using i18n for the title.
browser.contextMenus.create({
    id: CONTEXT_MENU_ID,
    title: browser.i18n.getMessage('contextMenuTitle'),
    contexts: ['link']
});

// When the context menu item is clicked, generate a UID and send a message to the content script.
browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === CONTEXT_MENU_ID && info.linkUrl && tab?.id != null) {
        try {
            const uid = crypto.randomUUID();
            // Save the UID along with the tabId and original URL.
            pendingRequests.set(uid, {tabId: tab.id, originalUrl: info.linkUrl});
            // Send message with the URL and UID to the content script.
            await browser.tabs.sendMessage(tab.id, {type: 'performTestRequest', url: info.linkUrl, uid});
        } catch (err) {
            console.error('Error sending message to content script:', err);
        }
    }
});

// Intercept outgoing requests and capture headers for our test GET request.
browser.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        try {
            const urlObj = new URL(details.url);
            // Retrieve the UID from the test parameter.
            const uid = urlObj.searchParams.get(TEST_PARAM);
            if (!uid || !pendingRequests.has(uid)) return {};
            const pending = pendingRequests.get(uid);
            // Remove the UID parameter to obtain the actual URL.
            urlObj.searchParams.delete(TEST_PARAM);
            const requestUrl = urlObj.toString();
            // Compare the stored originalUrl with the URL from the intercepted request.
            if (pending.originalUrl !== requestUrl) {
                console.warn(`Original URL mismatch: expected ${pending.originalUrl} but got ${requestUrl}`);
                return {};
            }
            // Check that the tabId matches.
            if (pending.tabId !== details.tabId) {
                console.warn(`Tab ID mismatch: expected ${pending.tabId} but got ${details.tabId}`);
                return {};
            }
            // Build the aria2 command using the captured request headers.
            const command = buildAria2Command(pending.originalUrl, details.requestHeaders || []);
            // Send the generated command to the originating tab.
            if (details.tabId >= 0) {
                browser.tabs.sendMessage(details.tabId, {type: 'copyCommand', command, uid})
                    .catch((err) => console.error('Error sending copyCommand message:', err));
            } else {
                console.warn('No tabId associated with the request.');
            }
            // Remove the pending request entry.
            pendingRequests.delete(uid);
            // Cancel the test request so it never reaches the network.
            return {cancel: true};
        } catch (error) {
            console.error('Error in onBeforeSendHeaders listener:', error);
            return {};
        }
    },
    {urls: ['<all_urls>']},
    ['blocking', 'requestHeaders']
);
