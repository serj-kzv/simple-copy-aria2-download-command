import migrationHelperFn from "./migrationHelperFn.js";

const startMigrationFn = async (originalConfig, changelog) => {
    const config = {...originalConfig};
    console.debug('start migration', {changelog, config});

    for (const {name, migrationFn} of changelog) {
        console.debug('start migration file', {config, name, migrationFn});
        await migrationHelperFn(config, name, migrationFn)
    }
    console.debug('stop migration', {originalConfig, config});

    return config
};

export default startMigrationFn;