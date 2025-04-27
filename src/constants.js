const Constants = Object.freeze({
    option: Object.freeze({
        options: 'options',
        firstStart: 'firstStart',
        extensionUuid: 'extensionUuid',
        tabIdUrlParameterName: prefix => `${prefix}tabId`,
        frameIdUrlParameterName: prefix => `${prefix}frameId`,
        urlPattern: 'urlPattern',
        urlPatternFlags: 'urlPatternFlags',
        useHeaders: 'useHeaders',
        headerParameterName: 'headerParameterName',
        useAllowedHeaders: 'useAllowedHeaders',
        allowedHeaders: 'allowedHeaders',
        commandTemplate: 'commandTemplate',
        escapeCmdUniversal: {
            escapeCmdUniversal: 'escapeCmdUniversal',
            enabled: 'enabled',
            platforms: 'platforms'
        },
    }),
    messageType: {
        execProbRequest: 'exec-prob-request',
        copyDownloadCommand: 'copy-download-command'
    },
    element: Object.freeze({
        contextMenuId: "simple-copy-aria2-download-command",
        config: 'config',
        reset: 'reset',
        save: 'save'
    }),
    changelog: 'changelog'
});

export default Constants;