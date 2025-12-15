import Constants from "../constants.js";

const migration9Fn = async config => {
    const options = config[Constants.option.options];
    if (options.length === 1 && options[0].name === 'common') {
        const escapeCmdUniversal = options[0][Constants.option.escapeCmdUniversal.escapeCmdUniversal];
        if (!!escapeCmdUniversal) {
            escapeCmdUniversal[Constants.option.escapeCmdUniversal.headerQuotes] = 'DOUBLE';
        }
    }
};

export default migration9Fn;