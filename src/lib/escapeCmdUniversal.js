const escapeCmdUniversal = str => {
    if (navigator.platform.indexOf('Win') >= 0) {
        return str.replace(/%/g, '%%').replace(/([&<>|^"()!])/g, '^$1');
    } else {
        return `'${str.replace(/'/g, `'\\''`)}'`;
    }
};

export default escapeCmdUniversal;