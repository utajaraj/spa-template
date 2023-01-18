const {AES, enc} = require("crypto-js");
const {verify} = require("jsonwebtoken")
const turnReqCookiesIntoObject = (req) => {
    const list = {};
    const cookieHeader = req.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function (cookie) {
        let [name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

module.exports = {
    isSignedIn: (req) => {
        let { grtkn } = turnReqCookiesIntoObject(req)
        if (grtkn) {
            const { grtkn } = turnReqCookiesIntoObject(req)
            try {
                var bytes = AES.decrypt(grtkn, process.env.AESKEY);
                var jwt = bytes.toString(enc.Utf8);
                const isValidCookie = verify(jwt,process.env.JWTSIGNATURE)
                return isValidCookie
            } catch (error) {
                return false
            }

        } else {
            return false
        }

    }
}