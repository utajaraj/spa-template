var https = require("https")
const { readFileSync } = require("fs")
var privateKey = readFileSync(__dirname+"/garlecloud.key", "utf8")
var certificate = readFileSync(__dirname+"/garlecloud.crt", "utf8")
var credentials = { key: privateKey, cert: certificate }
const express = require("express")
const app = express()
const serveStatic = require("serve-static")
const bodyParser = require("body-parser")
const { createDatabaseSchemas } = require("./database/setUp")
const { routes } = require("./router/router")
const { auth } = require("./middleware/authentication")
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

app.use(express.json()) //enable JSON middleware for requests
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
) //parse urlencoded request bodies
createDatabaseSchemas()
    .then((good) => {
        app.get("/login",(req,res)=>{
            res.status(200).sendFile(__dirname+"/html/login.html")
        })
        app.use("/api/v1", (req, res, next) => { auth(req, res, next) })
        app.use("/api/v1", routes)
        app.use("/*", (req, res, next) => { auth(req, res, next) })
        app.use(serveStatic(__dirname + "/build"))
        app.all("*", (req, res) => {
            res.status(200).send({ status: 200, message: "Unknow route" });
        })
    })
    .catch((unforseenError) => {
        console.log(unforseenError);
        app.all("*", (req, res) => {
            res.status(500).send("DB Unavailable");
        })
    })

// middleware
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(9000, () => {
    console.log(`Running on port: 9000`)
})
