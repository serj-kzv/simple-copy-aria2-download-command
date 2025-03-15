const checkOrInitFn = (config, migrationScriptName, changelogName) => {
    const configChangelog = config[changelogName];

    if (configChangelog === undefined) {
        config[changelogName] = {};

        return false;
    }

    const configChangelogMigrationScript = configChangelog[migrationScriptName];

    return configChangelogMigrationScript === undefined || configChangelogMigrationScript === false;
};

export default checkOrInitFn;