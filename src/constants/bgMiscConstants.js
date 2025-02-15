// ES module for background constants
export const CONTEXT_MENU_IDS = Object.freeze({
    COPY_ARIA2: "simple-copy-aria2-download-url"
});

export const TRIAL_REQUEST_PARAM = "aria2TrialRequest";

export const MESSAGE_ACTIONS = Object.freeze({
    INITIATE_TRIAL: "initiate_trial",
    TRIAL_RESPONSE: "trial_response"
});

export const DEFAULT_ARIA2_OPTIONS = Object.freeze({
    s: 4,
    x: 4,
    k: "1M",
    maxTries: 0,
    retryWait: 0
});
