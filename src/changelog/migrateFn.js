import changelog from "./changelog.js";
import startMigrationFn from "../lib/migration/migration.js";

const migrateFn = async config => {
    console.debug('start migration config', config);
    console.debug('start migration changelog', changelog);
    const migratedConfig = await startMigrationFn(config, changelog);
    console.debug('stop migration', migratedConfig);
    return migratedConfig;
};

export default migrateFn;