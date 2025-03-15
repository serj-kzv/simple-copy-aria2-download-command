const getUrlByTabIdAndFrameIdFn = async (tabId, frameId) => {
    if (frameId < 1) {
        const tabs = await browser.tabs.get(tabId);

        if (tabs.length > 0) {
            return tabs[0].url;
        } else {
            console.warn("tab was not found " + tabId);
        }
    }

    const {url} = (await browser.webNavigation.getAllFrames({tabId}))
        .find(frame => frame.frameId === frameId);

    return url;
};

export default getUrlByTabIdAndFrameIdFn;