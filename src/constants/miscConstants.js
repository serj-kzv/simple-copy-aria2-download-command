// UMD module for use in content scripts
(function (root, factory) {
    if (typeof module === "object" && module.exports) {
        module.exports = factory();
    } else {
        root.MISC_CONSTANTS = factory();
    }
}(typeof self !== "undefined" ? self : this, () => Object.freeze({
    CONTEXT_MENU_IDS: {
        COPY_ARIA2: "copy_aria2_download_command"
    },
    TRIAL_REQUEST_PARAM: "aria2TrialRequest",
    MESSAGE_ACTIONS: {
        INITIATE_TRIAL: "initiate_trial",
        TRIAL_RESPONSE: "trial_response"
    }
})));
