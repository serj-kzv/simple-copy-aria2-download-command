const executeOnPageClosedCallback = (currentTabId, currentTabUrl, onPageClosedCallback) => {
    if (currentTabId === undefined || currentTabUrl === undefined) { // It is probably a chrome:// url.
        console.log('The page is a chrome:// or a moz page, the onPageClosedCallback will not be called!');
        return;
    }

    let
        isCompleted = false,
        isMemoryCleared = false,
        onRemovedListener,
        onReplacedListener,
        onUpdatedListener;
    const clearMemory = () => {
        if (!isMemoryCleared) {
            isMemoryCleared = true;
            browser.tabs.onRemoved.removeListener(onRemovedListener);
            console.log('onRemovedListener was unset');
            browser.tabs.onReplaced.removeListener(onReplacedListener);
            console.log('onReplacedListener was unset');
            browser.tabs.onUpdated.removeListener(onUpdatedListener);
            console.log('onUpdatedListener was unset');
            console.log('onPageClosedCallback will be called');
            onPageClosedCallback();
            console.log('onPageClosedCallback was called');
        }
    };

    // clear memory on a tab is closed event
    onRemovedListener = tabId => {
        const isRunAndCurrent = currentTabId === tabId;

        if (isRunAndCurrent) {
            clearMemory();
            console.log('onRemovedListener, memory was cleared');
        }
    };

    // clear memory on a tab is replaced event
    onReplacedListener = (_, removedTabId) => {
        const isRunAndCurrent = currentTabId === removedTabId;

        if (isRunAndCurrent) {
            clearMemory();
            console.log('onReplacedListener, memory was cleared');
        }
    };

    // clear memory on a tab content is replaced event
    onUpdatedListener = (tabId, changeInfo, {url, status}) => {
        const isRunAndCurrent = currentTabId === tabId;

        if (isRunAndCurrent) {
            // checks if an original tab content was replaced
            if (!isCompleted && status === 'complete' && currentTabUrl === url) {
                isCompleted = true;
            } else if (currentTabUrl !== url) {
                clearMemory();
                console.log('onUpdatedListener, memory was cleared');
            }
        }
    };

    browser.tabs.onRemoved.addListener(onRemovedListener);
    console.log('onRemovedListener was set');
    browser.tabs.onReplaced.addListener(onReplacedListener);
    console.log('onReplacedListener was set');
    browser.tabs.onUpdated.addListener(onUpdatedListener);
    console.log('onUpdatedListener was set');
};


export default executeOnPageClosedCallback;