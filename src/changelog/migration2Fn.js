import Constants from "../constants.js";

const migration2Fn = async (config) => {
    const options = config[Constants.option.options];
    if (options.length === 1 && options[0].name === undefined) {
        options[0][Constants.option.name] = 'common';
        options[0][Constants.option.commandTemplate] = 'aria2 -c -s 4 -x 4 -k 1M --max-tries=0 %h %u';
    }
};

export default migration2Fn;