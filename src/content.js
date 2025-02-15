// Content script: listens for messages from background and triggers the trial request via an img tag.
// Also receives the generated aria2 command and copies it to the clipboard.
(() => {
    const {TRIAL_REQUEST_PARAM, MESSAGE_ACTIONS} = window.MISC_CONSTANTS;

    // Listen for messages from the background script.
    chrome.runtime.onMessage.addListener((message, sender) => {
        if (
            message &&
            message.action === MESSAGE_ACTIONS.INITIATE_TRIAL &&
            message.uid &&
            message.linkUrl
        ) {
            // Create an img element to trigger a trial GET request.
            const uid = message.uid;
            const linkUrl = message.linkUrl;
            try {
                const urlObj = new URL(linkUrl, window.location.href);
                // Append unique parameter to identify the trial request.
                urlObj.searchParams.set(TRIAL_REQUEST_PARAM, uid);
                const trialUrl = urlObj.toString();
                const img = new Image();
                // Hide the image.
                img.style.display = "none";
                img.src = trialUrl;
                document.body.appendChild(img);
                // Remove the element after a short delay.
                setTimeout(() => {
                    if (img.parentNode) img.parentNode.removeChild(img);
                }, 5000);
            } catch (error) {
                console.error("Error creating trial request:", error);
            }
        } else if (
            message &&
            message.action === MESSAGE_ACTIONS.TRIAL_RESPONSE &&
            message.uid &&
            message.command
        ) {
            // Upon receiving the command, copy it to clipboard.
            const {command} = message;
            // Use Clipboard API if available.
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(command)
                    .then(() => console.log("aria2 command copied to clipboard."))
                    .catch((err) => console.error("Failed to copy text: ", err));
            } else {
                // Fallback using a temporary textarea element.
                const textarea = document.createElement("textarea");
                textarea.value = command;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand("copy");
                    console.log("aria2 command copied to clipboard.");
                } catch (err) {
                    console.error("Fallback: Unable to copy", err);
                }
                document.body.removeChild(textarea);
            }
        }
    });
})();
