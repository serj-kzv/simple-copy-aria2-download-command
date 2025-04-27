const PLATFORM = Object.freeze({
    AUTO: 'AUTO',
    OFF: 'OFF',
    WINDOWS: 'WINDOWS',
    LINUX: 'LINUX'
});
const escapeCmdUniversal = (str, platforms = [PLATFORM.AUTO]) => {
    if (platforms.length < 1 || platforms.includes(PLATFORM.OFF)) {
        console.debug('escapeCmdUniversal is off');
        return str;
    }
    if (platforms.includes(PLATFORM.AUTO)) {
        console.debug('escapeCmdUniversal is on for:', platforms);

        if (platforms.includes(PLATFORM.WINDOWS)
            && navigator.platform.indexOf('Win') >= 0) {
            console.debug('escapeCmdUniversal current platform is:', PLATFORM.WINDOWS);
            return str.replace(/%/g, '%%').replace(/([&<>|^"()!])/g, '^$1');
        } else if (platforms.includes(PLATFORM.LINUX)) {
            console.debug('escapeCmdUniversal current platform is:', PLATFORM.LINUX);
            return `'${str.replace(/'/g, `'\\''`)}'`;
        }
    }
};

export {escapeCmdUniversal, PLATFORM};