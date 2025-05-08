import Constants from "../constants.js";

const migration3Fn = async config => {
    const options = config[Constants.option.options];
    if (options.length === 1 && options[0].name === 'common') {
        options[0][Constants.option.commandTemplate] = 'aria2 -c -s4 -m0 %h %u';
    }
};

export default migration3Fn;