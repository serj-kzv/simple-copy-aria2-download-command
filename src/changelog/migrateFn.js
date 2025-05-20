import changelog from "./changelog.js";
import startMigrationFn from "../lib/migration/migration.js";

const migrateFn = async config => {
    console.log('start migration config', config);
    console.log('start migration changelog', changelog);
    const migratedConfig = await startMigrationFn(config, changelog);
    console.log('stop migration', migratedConfig);
    return migratedConfig;
};

export default migrateFn;