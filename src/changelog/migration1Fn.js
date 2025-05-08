import Constants from "../constants.js";

const migration1Fn = async config => {
    config[Constants.option.firstStart] = true;
    config[Constants.option.extensionUuid] = crypto.randomUUID();
};

export default migration1Fn;