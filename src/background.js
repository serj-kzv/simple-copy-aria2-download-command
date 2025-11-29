import Option from "./lib/Option.js";
import Constants from "./constants.js";
import getUrlByTabIdAndFrameIdFn from "./lib/getUrlByTabIdAndFrameId.js";
import {escapeCmdUniversal, PLATFORM} from "./lib/escapeCmdUniversal.js";
import executeOnPageClosedCallback from "./lib/executeOnPageClosedFn.js";
import migrateFn from "./changelog/migrateFn.js";

console.log('start background script');

console.log('option will be created');
const option = new Option();
console.log('option was created');

(async () => {
    const makeContextMenuFn = async () => {
        await browser.contextMenus.create({
            id: Constants.element.contextMenuId,
            title: browser.i18n.getMessage("contextMenuTitle"),
            contexts: ["link", "image", "video", "audio"]
        });
    };

    await makeContextMenuFn();

    console.log('browser.runtime.onInstalled.addListener will be started');

    browser.runtime.onInstalled.addListener(async ({reason}) => {
        if (reason === 'install' || reason === 'update') {
            console.log('It is the first installation or update, the extension config will be migrated');
            const config = await migrateFn(await option.get());
            if (reason === 'install') {
                console.log('It is the first installation, the extension uuid will be generated');
                config[Constants.option.extensionUuid] = crypto.randomUUID();
                console.log('It is the first installation, the extension uuid was generated', config[Constants.option.extensionUuid]);
            }
            await option.save(config);

            console.log('New context menu will be added');
            await browser.contextMenus.removeAll();
            await makeContextMenuFn();
            console.log('New context menu was added');
        }
    });

    console.log('browser.contextMenus.onClicked.addListener will be started');
    browser.contextMenus.onClicked.addListener((details, tab) => {
        console.log('browser.contextMenus.onClicked.addListener details', details);
        const {menuItemId, frameId, srcUrl} = details;
        let {linkUrl, mediaType} = details;
        console.log('browser.contextMenus.onClicked.addListener tab', tab);
        if (!linkUrl && !srcUrl) {
            console.warn('Invalid element url (there are no linkUrl and srcUrl), ' +
                'probably the element uses a blob: url or some another invalid url. It will not be proceeded.', details);
            return;
        }

        const {id: tabId, url: tabUrl} = tab;
        if (menuItemId !== Constants.element.contextMenuId) {
            return;
        }
        console.log('current contextMenus.onClicked is', {
            menuItemId,
            linkUrl,
            frameId,
            srcUrl,
            mediaType
        }, {tabId, tabUrl});
        if (mediaType === undefined) { // treat undefined as a link
            mediaType = 'link';
        }
        if (["image", "video", "audio"].includes(mediaType)) {
            linkUrl = srcUrl;
        }
        console.log('send', Constants.messageType.execProbRequest);
        console.log('send linkUrl', linkUrl);
        let listener;
        const clearOnBeforeSendHeadersListener = () => {
            console.log('onBeforeSendHeaders listener will be removed', {tabId, tabUrl});
            browser.webRequest.onBeforeSendHeaders.removeListener(listener);
            console.log('onBeforeSendHeaders listener was removed', {tabId, tabUrl});
        };
        listener = async ({url, requestHeaders, method}) => {
            try {
                if (method !== 'GET') {
                    return {};
                }
                url = new URL(url);

                const {searchParams} = url;
                const config = await option.get();
                const urlParameterName = config[Constants.option.extensionUuid];

                if (!searchParams.has(urlParameterName)) {
                    return {};
                }
                console.log('clearOnBeforeSendHeadersListener will be called.');
                clearOnBeforeSendHeadersListener();
                console.log('clearOnBeforeSendHeadersListener was called.');
                console.log('{url, requestHeaders, method}', {url, requestHeaders, method});
                console.log('urlParameterName', urlParameterName);

                const tabIdUrlParameterName = Constants.option.tabIdUrlParameterName(urlParameterName);
                const frameIdUrlParameterName = Constants.option.frameIdUrlParameterName(urlParameterName);
                const tabId = Number(searchParams.get(tabIdUrlParameterName));
                const frameId = Number(searchParams.get(frameIdUrlParameterName));

                searchParams.delete(urlParameterName);
                searchParams.delete(tabIdUrlParameterName);
                searchParams.delete(frameIdUrlParameterName);

                const urlString = url.toString();
                const domainUrl = await getUrlByTabIdAndFrameIdFn(tabId, frameId);
                console.log('domainUrl', domainUrl);
                const urlOption = config[Constants.option.options].find(({urlPattern, urlPatternFlags}) =>
                    new RegExp(urlPattern, urlPatternFlags).test(domainUrl));

                if (urlOption === undefined) {
                    return {cancel: true};
                }

                console.log('config', config)
                console.log('urlOption', urlOption)

                let command = urlOption[Constants.option.commandTemplate];

                if (Boolean(urlOption[Constants.option.useHeaders])) {
                    if (Boolean(urlOption[Constants.option.useDisallowedHeaders])) {
                        const disallowedHeaders = urlOption[Constants.option.disallowedHeaders] || [];
                        console.log('disallowedHeaders', disallowedHeaders);
                        requestHeaders = requestHeaders.filter(({name}) => !disallowedHeaders.includes(name));
                    }
                    if (Boolean(urlOption[Constants.option.useAllowedHeaders])) {
                        const allowedHeaders = urlOption[Constants.option.allowedHeaders] || [];
                        console.log('AllowedHeaders', allowedHeaders);
                        requestHeaders = requestHeaders.filter(({name}) => allowedHeaders.includes(name));
                    }

                    const headerParameterName = urlOption[Constants.option.headerParameterName];
                    const headers = requestHeaders
                        .map(({
                                  name,
                                  value
                              }) => `${headerParameterName}="${name}: ${value}"`)
                        .join(" ");

                    command = command.replace("%h", headers);
                } else {
                    command = command.replace("%h", '');
                }

                const escapeOption = urlOption[Constants.option.escapeCmdUniversal.escapeCmdUniversal];
                let escapedCmd;

                if (escapeOption !== undefined && Boolean(escapeOption[Constants.option.escapeCmdUniversal.enabled])) {
                    const platforms = escapeOption[Constants.option.escapeCmdUniversal.platforms];
                    const currentPlatforms = platforms.length > 0 ? platforms : [PLATFORM.AUTO];
                    const encodeUrlMode = escapeOption[Constants.option.escapeCmdUniversal.encodeUrlMode];

                    escapedCmd = escapeCmdUniversal(urlString, currentPlatforms, encodeUrlMode);
                } else {
                    escapedCmd = urlString;
                }
                console.log('escapedCmd', escapedCmd);

                command = command.replace("%u", `"${escapedCmd}"`);

                console.log('command', command);

                console.log('tabId', tabId);
                console.log('frameId', frameId);

                console.log('copy command in background', command);
                try {
                    await navigator.clipboard.writeText(command);
                } catch (e) {
                    console.warn('Suppress an error with clipborad, the copy command WILL WORK ANYWAY!', e);
                }
                console.log('command was copied in background', command);

                return {cancel: true};
            } catch (e) {
                console.log('error', e);
                return {};
            }
        };
        console.log('clearOnBeforeSendHeadersListener on page closed callback will be set', {tabId, tabUrl});
        executeOnPageClosedCallback(tabId, tabUrl, clearOnBeforeSendHeadersListener);
        console.log('clearOnBeforeSendHeadersListener on page closed callback was set', {tabId, tabUrl});

        console.log('browser.webRequest.onBeforeSendHeaders.addListener will be started', {tabId, tabUrl});
        browser.webRequest.onBeforeSendHeaders.addListener(
            listener,
            {
                urls: ["<all_urls>"],
                tabId
            },
            ["blocking", "requestHeaders"]
        );
        browser.tabs.sendMessage(
            tabId,
            {
                type: Constants.messageType.execProbRequest,
                payload: {linkUrl, frameId, tabId, mediaType}
            },
            {frameId}
        );
    });
})();