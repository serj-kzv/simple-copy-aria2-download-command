import Constants from "../constants.js";

const migration4Fn = async config => {
    const options = config[Constants.option.options];
    if (options.length === 1 && options[0].name === 'common') {
        options[0][Constants.option.commandTemplate]
            = 'aria2c -c -s4 -m0 -k1M --stream-piece-selector=inorder --summary-interval=1 --console-log-level=notice %h %u';
        options[0][Constants.option.useDisallowedHeaders] = true;
        options[0][Constants.option.disallowedHeaders] = ['Range'];
    }
};

export default migration4Fn;