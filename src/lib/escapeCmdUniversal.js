const PLATFORM = Object.freeze({
    AUTO: 'AUTO',
    OFF: 'OFF',
    WINDOWS: 'WINDOWS',
    LINUX: 'LINUX'
});
const ENCODE_URL_MODE = Object.freeze({
    RFC3986: 'RFC3986',
    RFC5987: 'RFC5987'
});

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#examples
const encodeRFC3986URIComponent = str => {
    return encodeURIComponent(str).replace(
        /[!'()*]/g,
        (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
    );
};

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent#examples
const encodeRFC5987ValueChars = str => {
    return (
        encodeURIComponent(str)
            // The following creates the sequences %27 %28 %29 %2A (Note that
            // the valid encoding of "*" is %2A, which necessitates calling
            // toUpperCase() to properly encode). Although RFC3986 reserves "!",
            // RFC5987 does not, so we do not need to escape it.
            .replace(
                /['()*]/g,
                (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
            )
            // The following are not required for percent-encoding per RFC5987,
            // so we can allow for a little better readability over the wire: |`^
            .replace(/%(7C|60|5E)/g, (str, hex) =>
                String.fromCharCode(parseInt(hex, 16)),
            )
    );
};
const escapeCmdUniversal = (str, platforms = [PLATFORM.AUTO], encodeUrlMode) => {
    if (platforms.length < 1 || platforms.includes(PLATFORM.OFF)) {
        console.log('escapeCmdUniversal is off');
        return str;
    }
    console.log('escapeCmdUniversal is on for:', platforms);

    switch (encodeUrlMode) {
        case ENCODE_URL_MODE.RFC3986: {
            console.log('escapeCmdUniversal with encodeUrlMode', encodeUrlMode);
            return encodeRFC3986URIComponent(str);
        }
        case ENCODE_URL_MODE.RFC5987: {
            console.log('escapeCmdUniversal with encodeUrlMode', encodeUrlMode);
            return encodeRFC5987ValueChars(str);
        }
        default: {
            console.log('escapeCmdUniversal with default encodeUrlMode', encodeUrlMode);
            return encodeRFC5987ValueChars(str);
        }
    }
};

export {escapeCmdUniversal, PLATFORM, ENCODE_URL_MODE};