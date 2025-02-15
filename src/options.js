(() => {
    // Define storage keys and default aria2 options.
    const STORAGE_KEYS = { ARIA2_OPTIONS: "aria2Options" };
    const DEFAULT_ARIA2_OPTIONS = { s: 4, x: 4, k: "1M", maxTries: 0, retryWait: 0 };

    // Promisified storage get.
    const getOptions = () =>
        new Promise((resolve) => {
            chrome.storage.sync.get(STORAGE_KEYS.ARIA2_OPTIONS, (result) => {
                resolve(result[STORAGE_KEYS.ARIA2_OPTIONS] || DEFAULT_ARIA2_OPTIONS);
            });
        });

    // Promisified storage set.
    const saveOptions = (options) =>
        new Promise((resolve) => {
            chrome.storage.sync.set({ [STORAGE_KEYS.ARIA2_OPTIONS]: options }, () =>
                resolve()
            );
        });

    // Initialize form with stored values.
    const init = async () => {
        const options = await getOptions();
        document.getElementById("sValue").value = options.s;
        document.getElementById("xValue").value = options.x;
        document.getElementById("kValue").value = options.k;
        document.getElementById("maxTriesValue").value = options.maxTries;
        document.getElementById("retryWaitValue").value = options.retryWait;
    };

    // Handle form submission.
    document
        .getElementById("options-form")
        .addEventListener("submit", async (e) => {
            e.preventDefault();
            const newOptions = {
                s: parseInt(document.getElementById("sValue").value, 10),
                x: parseInt(document.getElementById("xValue").value, 10),
                k: document.getElementById("kValue").value,
                maxTries: parseInt(document.getElementById("maxTriesValue").value, 10),
                retryWait: parseInt(document.getElementById("retryWaitValue").value, 10)
            };
            await saveOptions(newOptions);
            const status = document.getElementById("status");
            status.textContent = "Options saved.";
            setTimeout(() => {
                status.textContent = "";
            }, 2000);
        });

    init();
})();
