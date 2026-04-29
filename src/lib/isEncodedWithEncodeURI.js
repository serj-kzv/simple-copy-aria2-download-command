// TODO: check and fix
const isEncodedWithEncodeURI = uri => {
    const allowed = /[A-Za-z0-9;,/?:@&=+$\-_.!~*'()#]/;
    const percentSeq = /%[0-9A-Fa-f]{2}/gi;
    let hasEncodedForbidden = false;
    let hasEncodedAllowed = false;

    for (const match of uri.matchAll(percentSeq)) {
        const seq = match[0];
        let decoded;
        try {
            decoded = decodeURIComponent(seq);
        } catch {
            return false;
        }
        if (allowed.test(decoded)) {
            hasEncodedAllowed = true;
        } else {
            hasEncodedForbidden = true;
        }
    }

    if (hasEncodedForbidden) return true;
    if (hasEncodedAllowed) return false;

    for (const ch of uri) {
        if (!allowed.test(ch)) {
            return false;
        }
    }

    return true;
};

export default isEncodedWithEncodeURI;