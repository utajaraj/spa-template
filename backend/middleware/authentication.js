module.exports = {
    auth: (req, res, next) => {

        // retreive cookies start
        // create a variable to store parsed cookies and split every found cookie
        const cookies = {}, rc = req.headers.cookie?.split(";")

        // loop thorugh request cookies to set them a key value pair in a JS Object
        for (let i = 0; i < rc?.length; i++) {
            const parts = rc[i].split("=");
            cookies[parts.shift().trim()] = decodeURI(parts.join("="));
        }


        // retreive cookies end


        // verify token signature start

        // If sftjrzusr is defined within cookies check signature
        const isValidSignature = cookies.sftjrzerptkn ? jwt.verify(cookies.sftjrzerptkn, process.env.SIGNATURE) : false

        // return forbidden message on invalid signature
        if (!isValidSignature) {
            res.redirect("/login")
            return
        }


        res.cookie("sftjrzerptkn", sign(jwt.decode(cookies.sftjrzerptkn), process.env.SIGNATURE), { maxAge: 720000 })
        req.body.sftjrzerptkn = jwt.decode(cookies.sftjrzerptkn)
        next()

        // verify token signature start

    }
}