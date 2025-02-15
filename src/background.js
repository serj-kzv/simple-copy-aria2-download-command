// Import background constants (ES module style)
import {
    CONTEXT_MENU_IDS,
    TRIAL_REQUEST_PARAM,
    MESSAGE_ACTIONS,
    DEFAULT_ARIA2_OPTIONS
} from "./constants/bgMiscConstants.js";
import { STORAGE_KEYS } from "./constants/bgStorageKeys.js";

// Global variable to hold current aria2 options (loaded from storage)
let currentAria2Options = { ...DEFAULT_ARIA2_OPTIONS };

// Map to track pending trial requests: uid -> { tabId, linkUrl, tabUrl }
const pendingRequests = new Map();

// Helper: generate unique id using timestamp and random part
const generateUID = () =>
    `uid-${Date.now()}-${Math.random().toString(36).slice(2)}`;

// Create context menu item for links
chrome.contextMenus.create({
    id: CONTEXT_MENU_IDS.COPY_ARIA2,
    title: chrome.i18n.getMessage("contextMenuTitle"),
    contexts: ["link"]
});

// Listener for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (
        info.menuItemId === CONTEXT_MENU_IDS.COPY_ARIA2 &&
        info.linkUrl &&
        tab?.id != null
    ) {
        const uid = generateUID();
        pendingRequests.set(uid, {
            tabId: tab.id,
            linkUrl: info.linkUrl,
            tabUrl: tab.url
        });
        // Send message to the content script in the current tab to perform trial request via an img tag.
        chrome.tabs.sendMessage(tab.id, {
            action: MESSAGE_ACTIONS.INITIATE_TRIAL,
            uid,
            linkUrl: info.linkUrl
        });
    }
});

// Load stored aria2 options from sync storage
chrome.storage.sync.get(STORAGE_KEYS.ARIA2_OPTIONS, (result) => {
    currentAria2Options = result[STORAGE_KEYS.ARIA2_OPTIONS]
        ? { ...result[STORAGE_KEYS.ARIA2_OPTIONS] }
        : { ...DEFAULT_ARIA2_OPTIONS };
});

// Update options if they change
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes[STORAGE_KEYS.ARIA2_OPTIONS]) {
        currentAria2Options = { ...changes[STORAGE_KEYS.ARIA2_OPTIONS].newValue };
    }
});

// Intercept the trial request via webRequest API.
// This listener targets image requests (created in the content script).
chrome.webRequest.onBeforeSendHeaders.addListener(
    (details) => {
        try {
            const urlObj = new URL(details.url);
            if (!urlObj.searchParams.has(TRIAL_REQUEST_PARAM)) return;
            const uid = urlObj.searchParams.get(TRIAL_REQUEST_PARAM);
            if (!pendingRequests.has(uid)) return;
            const pending = pendingRequests.get(uid);
            // Verify that the request comes from the expected tab.
            if (details.tabId !== pending.tabId) return;
            // Retrieve all request headers.
            const { requestHeaders } = details;
            // Remove the trial parameter from the URL.
            urlObj.searchParams.delete(TRIAL_REQUEST_PARAM);
            const originalUrl = urlObj.toString();
            // Build header parts: each header as --header="Name: Value"
            const headerParts = requestHeaders
                .map(({ name, value }) => `--header="${name}: ${value}"`)
                .join(" ");
            // Build options part using current stored settings.
            const { s, x, k, maxTries, retryWait } = currentAria2Options;
            const optionsPart = `-c -s${s} -x${x} -k ${k} --max-tries=${maxTries} --retry-wait=${retryWait}`;
            // Form the complete aria2 command in one line.
            const command = `aria2 ${headerParts} ${optionsPart} "${originalUrl}"`;
            // Send the generated command back to the originating tab.
            chrome.tabs.sendMessage(pending.tabId, {
                action: MESSAGE_ACTIONS.TRIAL_RESPONSE,
                uid,
                command,
                linkUrl: pending.linkUrl
            });
            // Remove the processed request.
            pendingRequests.delete(uid);
        } catch (error) {
            console.error("Error in onBeforeSendHeaders:", error);
        }
        // Cancel the trial request so that it is never sent to the network.
        return { cancel: true };
    },
    { urls: ["<all_urls>"], types: ["image"] },
    ["blocking", "requestHeaders"]
);
