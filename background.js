const getDomainCookies = async (linkUrl) => {
    try {
        const cookies = await chrome.cookies.getAll({url: linkUrl});
        return cookies.map(c => `${c.name}=${c.value}`).join('; ');
    } catch (error) {
        console.error('Error getting cookies:', error);
        return '';
    }
};

const getTabInfo = async (tabId) => {
    try {
        const [userAgent, referer] = await Promise.all([
            chrome.scripting.executeScript({
                target: {tabId},
                func: () => navigator.userAgent
            }),
            chrome.scripting.executeScript({
                target: {tabId},
                func: () => {
                    try {
                        return new URL(window.location.href).origin;
                    } catch {
                        return window.location.href;
                    }
                }
            })
        ]);
        return {
            userAgent: userAgent[0]?.result || '',
            referer: referer[0]?.result || ''
        };
    } catch (error) {
        console.error('Error getting tab info:', error);
        return {userAgent: '', referer: ''};
    }
};

chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'aria2-download',
        title: chrome.i18n.getMessage('contextMenuTitle'),
        contexts: ['link']
    });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== 'aria2-download' || !info.linkUrl || !tab?.id) return;

    try {
        const [cookieHeader, {userAgent, referer}] = await Promise.all([
            getDomainCookies(info.linkUrl),
            getTabInfo(tab.id)
        ]);
        const command = [
            'aria2 -x 4 -k 1M -c --max-tries=0 --summary-interval=3 --retry-wait=0',
            `--header="Referer: ${referer}"`,
            `--header="Cookie: ${cookieHeader}"`,
            `--header="User-Agent: ${userAgent}"`,
            `"${info.linkUrl}"`
        ].join(' ');

        await navigator.clipboard.writeText(command);
    } catch (error) {
        console.error('Error generating command:', error);
    }
});