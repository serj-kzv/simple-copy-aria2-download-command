import Constants from "../constants.js";

const migration7Fn = async config => {
    const options = config[Constants.option.options];
    if (options.length === 1 && options[0].name === 'common') {
        options[0][Constants.option.disallowedHeaders] = ['Range', 'Host'];
    }
};

export default migration7Fn;