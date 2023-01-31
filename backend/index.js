var https = require("https")
const { readFileSync } = require("fs")
var privateKey = readFileSync(__dirname + "/garlecloud.key", "utf8")
var certificate = readFileSync(__dirname + "/garlecloud.crt", "utf8")
var credentials = { key: privateKey, cert: certificate }
const express = require("express")
const app = express()
const serveStatic = require("serve-static")
const bodyParser = require("body-parser")
const { createDatabaseSchemas } = require("./database/setUp")
const { routes } = require("./router/router")
const { auth } = require("./middleware/authentication")
const { signUserIn } = require("./factors/login/signUserIn")
const { isSignedIn } = require("./factors/login/isSignedIn")
const { checkCredentials } = require("./factors/login/checkCredentials")
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", req.headers.origin)
    res.header(
        "Access-Control-Allow-Methods",
        "GET,PUT,POST,PATCH,DELETE,OPTIONS"
    )
    res.header(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
    )
    res.header("Access-Control-Allow-Credentials", true)
    if (req.method === "OPTIONS") {
        // The request is using the POST method
        res.status(200).header("HTTP/1.1 200 OK").send()
        return
    }
    next()
})

require("dotenv").config()
app.use(express.json()) //enable JSON middleware for requests
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
) //parse urlencoded request bodies
createDatabaseSchemas()
    .then((good) => {
        if(good===true){

            app.use("/", serveStatic(__dirname + "/assets"))
            app.get("/login", (req, res) => {
                if (isSignedIn(req)) {
                    res.redirect("/")
                } else {
                    res.status(200).sendFile(__dirname + "/html/login.html")
                }
            })
            app.post("/login", async (req, res) => {
                const { username, password } = req.body
                const isAlreadyAuthenticated = isSignedIn(req)
                if (isAlreadyAuthenticated) {
                    res.status(200).send({ status: true, message: "Usario ya cuenta con sesión" })
                } else {
                    const areValidCredentials = await checkCredentials(username, password)
                    if (areValidCredentials) {
                        signUserIn(res, areValidCredentials)
                    } else {
                        res.status(400).send({ status: false, message: "Credenciales de usario invalidas" })
                    }
                }
            })
            app.use("/api/v1", (req, res, next) => { auth(req, res, next) })
            app.use("/api/v1", routes)
            app.use("/*", (req, res, next) => { auth(req, res, next) })
            app.use("/", serveStatic(__dirname + "/public"))
            app.all("*", (req, res) => {
                res.status(200).send({ status: 200, message: "Unknow route" });
            })
        }else{
            app.all("*", (req, res) => {
                res.status(500).send("Error Interno, porfavor contacta a soporte");
            })
        }
    })
    .catch((unforseenError) => {
        app.all("*", (req, res) => {
            res.status(500).send("DB Unavailable");
        })
    })

// middleware
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(8000, () => {
    console.log(`Running on port: 8000`)
})
