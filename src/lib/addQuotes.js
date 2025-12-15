const QUOTES = Object.freeze({
    SINGLE: 'SINGLE',
    DOUBLE: 'DOUBLE'
});
const addQuotes = (str, quotes) => {
    switch (quotes) {
        case QUOTES.SINGLE:
            return `'${str}'`;
        case QUOTES.DOUBLE:
            return `"${str}"`;
        default:
            return str;
    }
};

export default addQuotes;