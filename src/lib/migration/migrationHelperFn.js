import Constants from "./constants.js";
import checkOrInitFn from './checkOrInitFn.js';

const migrationHelperFn = async (config, migrationScriptName, migrationFn) => {

    if (checkOrInitFn(config, migrationScriptName, Constants.changelog)) {
        config[Constants.changelog][migrationScriptName] = true;

        await migrationFn(config);
    }
};

export default migrationHelperFn;