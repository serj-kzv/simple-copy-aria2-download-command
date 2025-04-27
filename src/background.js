import Option from "./lib/Option.js";
import Constants from "./constants.js";
import startMigrationFn from "./lib/migration/migration.js";
import changelog from "./changelog/changelog.js";
import getUrlByTabIdAndFrameIdFn from "./lib/getUrlByTabIdAndFrameId.js";
import {escapeCmdUniversal, PLATFORM} from "./lib/escapeCmdUniversal.js";

const option = new Option();

browser.runtime.onInstalled.addListener(async ({reason}) => {
    if (['install', 'update'].includes(reason)) {
        console.log('start migration config', await option.get());
        console.log('start migration changelog', changelog);
        const config = await startMigrationFn(await option.get(), changelog);
        console.log('stop migration', await option.get());
        await option.save(config);
    }
});
browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({
        id: Constants.element.contextMenuId,
        title: browser.i18n.getMessage("contextMenuTitle"),
        contexts: ["link", "image", "video", "audio"]
    });
});
browser.contextMenus.onClicked.addListener(({menuItemId, linkUrl, frameId, srcUrl, mediaType}, {id: tabId}) => {
    if (menuItemId !== Constants.element.contextMenuId) {
        return;
    }
    if (["image", "video", "audio"].includes(mediaType)) {
        linkUrl = srcUrl;
    }
    console.log('send', Constants.messageType.execProbRequest);
    console.log('send linkUrl', linkUrl);
    browser.tabs.sendMessage(
        tabId,
        {
            type: Constants.messageType.execProbRequest,
            payload: {linkUrl, frameId, tabId, mediaType}
        },
        {frameId}
    );
});
const handleProbRequestFn = async ({url, requestHeaders, method}) => {
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
        if (Boolean(urlOption[Constants.option.useAllowedHeaders])) {
            const allowedHeaders = urlOption[Constants.option.allowedHeaders];
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

        escapedCmd = escapeCmdUniversal(urlString, currentPlatforms);
    } else {
        escapedCmd = urlString
    }
    console.debug('escapedCmd', escapedCmd);

    command = command.replace("%u", escapedCmd);

    console.log('command', command);

    console.log('tabId', tabId);
    console.log('frameId', frameId);

    browser.tabs.sendMessage(
        tabId,
        {
            type: Constants.messageType.copyDownloadCommand,
            payload: {command}
        },
        {frameId}
    );

    return {cancel: true};
};
browser.webRequest.onBeforeSendHeaders.addListener(async ({url, requestHeaders, method}) => {
        try {
            return await handleProbRequestFn({url, requestHeaders, method});
        } catch (e) {
            console.log('error', e);
            return {};
        }
    },
    {
        urls: ["<all_urls>"]
    },
    ["blocking", "requestHeaders"]
);
browser.runtime.onMessage.addListener(({type, payload: {command}}) => {
    if (type !== Constants.messageType.copyDownloadCommandInBackground) {
        return;
    }
    console.log('copy command in background', {type, payload: {command}});
    navigator.clipboard.writeText(command)
});