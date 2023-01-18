const { sign } = require("jsonwebtoken")
const { AES } = require("crypto-js")

module.exports = {
    signUserIn: (res, id) => {
        try {
            const tokenCookie = sign(id,process.env.JWTSIGNATURE).toString()
            const encryptedCookie = AES.encrypt(tokenCookie, process.env.AESKEY).toString()
            res.cookie('grtkn', encryptedCookie, { httpOnly: true });
            res.status(200).send({ status: true, message: "Bienvenido" })
        } catch (error) {
            res.status(400).send({ status: false, message: "Error al logear usuario", data:error.toString() })
        }
    }
}