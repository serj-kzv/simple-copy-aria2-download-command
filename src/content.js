// content.js – Content script for the extension.
// Listens for messages from the background script to either perform the test GET request
// or copy the generated aria2 command to the clipboard.
// Uses ES2024 features, arrow functions, async/await, and Airbnb style.

browser.runtime.onMessage.addListener(async (message) => {
    if (message.type === 'performTestRequest' && message.url && message.uid) {
        // Append the unique UID as a query parameter to mark the test request.
        const urlObj = new URL(message.url, window.location.href);
        urlObj.searchParams.set('aria2test', message.uid);
        // Create an Image element to trigger the GET request.
        // This avoids fetch errors due to cancellation.
        const img = new Image();
        img.src = urlObj.toString();
        // Optionally, handle error events to suppress console error messages.
        img.onerror = () => {
            // console.warn('Test GET request image error (expected due to cancellation).');
        };
    } else if (message.type === 'copyCommand' && message.command) {
        try {
            // Copy the aria2 command to the clipboard using the Clipboard API.
            await navigator.clipboard.writeText(message.command);
        } catch (err) {
            console.error('Error copying command to clipboard:', err);
        }
    }
});
