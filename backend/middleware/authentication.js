const {isSignedIn} = require("../factors/login/isSignedIn")

module.exports = {
    auth: (req, res, next) => {

    
        const userIsAuthenticated = isSignedIn(req)
        // return forbidden message on invalid signature
        if (!userIsAuthenticated) {
            res.redirect("/login")
            return
        }

        next()

        // verify token signature start

    }
}