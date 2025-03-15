import Constants from "./constants.js";
import Option from "./lib/Option.js";

const option = new Option();

browser.runtime.onMessage.addListener(async ({type, payload: {linkUrl, tabId, frameId}}) => {
    if (type !== Constants.messageType.execProbRequest) {
        return;
    }

    console.log('start prob req', Constants.messageType.execProbRequest);
    console.log('linkUrl', linkUrl);

    let url;

    try {
        url = new URL(linkUrl);
    } catch (e) {
        console.log('url', url);
        console.error(e);
    }

    console.log('OPTION', option)
    const config = await option.get();
    console.log('config', config)
    const urlParameterName = config[Constants.option.extensionUuid];
    const tabIdUrlParameterName = Constants.option.tabIdUrlParameterName(urlParameterName);
    const frameIdUrlParameterName = Constants.option.frameIdUrlParameterName(urlParameterName);

    url.searchParams.append(urlParameterName, '');
    url.searchParams.append(tabIdUrlParameterName, tabId);
    url.searchParams.append(frameIdUrlParameterName, frameId);

    console.log('send prob', url)
    fetch(url.toString(), {cache: 'no-store'})
        .catch(() => {
        });
});
browser.runtime.onMessage.addListener(({type, payload: {command}}) => {
    if (type !== Constants.messageType.copyDownloadCommand) {
        return;
    }
    console.log('command', command)
    navigator.clipboard.writeText(command);
});