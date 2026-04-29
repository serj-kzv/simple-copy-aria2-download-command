import Constants from "../constants.js";

const migration10Fn = async config => {
    const options = config[Constants.option.options];
    if (options.length === 1 && options[0].name === 'common') {
        const escapeCmdUniversal = options[0][Constants.option.escapeCmdUniversal.escapeCmdUniversal];
        if (!!escapeCmdUniversal) {
            delete escapeCmdUniversal[Constants.option.escapeCmdUniversal.enabled];
            escapeCmdUniversal[Constants.option.escapeCmdUniversal.enabledUrlEscaping] = false;
            escapeCmdUniversal[Constants.option.escapeCmdUniversal.enabledUrlQuotes] = true;
        }
    }
};

export default migration10Fn;