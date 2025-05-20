import migrationHelperFn from "./migrationHelperFn.js";

const startMigrationFn = async (originalConfig, changelog) => {
    const config = {...originalConfig};
    console.log('start migration', {changelog, config});

    for (const {name, migrationFn} of changelog) {
        console.log('start migration file', {config, name, migrationFn});
        await migrationHelperFn(config, name, migrationFn)
    }
    console.log('stop migration', {originalConfig, config});

    return config
};

export default startMigrationFn;