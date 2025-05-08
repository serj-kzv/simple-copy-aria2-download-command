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
        name: 'name',
        headerParameterName: 'headerParameterName',
        useAllowedHeaders: 'useAllowedHeaders',
        allowedHeaders: 'allowedHeaders',
        useDisallowedHeaders: 'useDisallowedHeaders',
        disallowedHeaders: 'disallowedHeaders',
        commandTemplate: 'commandTemplate',
        escapeCmdUniversal: {
            escapeCmdUniversal: 'escapeCmdUniversal',
            enabled: 'enabled',
            platforms: 'platforms'
        },
    }),
    messageType: {
        execProbRequest: 'exec-prob-request',
        copyDownloadCommand: 'copy-download-command',
        copyDownloadCommandInBackground: 'copy-download-command-in-background',
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