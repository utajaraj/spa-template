const path = require("path")
var https = require("https")
const { readFileSync } = require("fs")
require("dotenv").config()
var privateKey = readFileSync(path.join(__dirname + process.env.KEYPATH), "utf8")
var certificate = readFileSync(path.join(__dirname + process.env.CERTPATH), "utf8")
var credentials = { key: privateKey, cert: certificate }
const express = require("express")
const app = express()
const serveStatic = require("serve-static")
const bodyParser = require("body-parser")
const { createDatabaseSchemas } = require("./database/setUp")
const { routes } = require("./router/router")
const { auth } = require("./middleware/authentication")
const ejs = require("ejs")
app.set('view engine', 'ejs')
const { signUserIn } = require("./factors/login/signUserIn")
const { isSignedIn } = require("./factors/login/isSignedIn")
const { checkCredentials } = require("./factors/login/checkCredentials")
const { needsSetUp } = require("./factors/login/needsSetUp")
const { createAdminUser } = require("./factors/login/createAdminUser")
const { knex } = require("./database/connection")
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
        if (good === true) {
            app.post("/setUp", async (req, res) => {
                if (needsSetUp()) {
                    const adminUsersIsCreated = await createAdminUser(req.body)
                    if (adminUsersIsCreated.status) {
                        const { username, password } = req.body
                        const areValidCredentials = await checkCredentials(username, password)
                        if (areValidCredentials) {
                            signUserIn(res, areValidCredentials)
                        } else {
                            res.status(400).send({ status: false, message: "Credenciales de usario invalidas" })
                        }
                    } else {
                        res.status(400).send({ status: false, message: adminUsersIsCreated.message })
                    }
                }
            })
            app.get("/login", async (req, res) => {
                if (isSignedIn(req)) {
                    res.redirect("/crm")
                } else {
                    const loadSetUp = await needsSetUp()
                    if (loadSetUp) {
                        res.status(200).render(__dirname + "/views/setUp.ejs")
                    } else {
                        const result = await knex("companies").select()
                        const title = result[0].company_name
                        res.status(200).render(__dirname + "/views/login.ejs",{title})
                    }
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
            app.use("/api/*", (req, res, next) => { auth(req, res, next) })
            app.use("/crm", (req, res, next) => { auth(req, res, next) })
            app.use("/crm", serveStatic(path.resolve(__dirname + "/public")))

        } else {
            app.all("*", (req, res) => {
                res.status(500).send("Error Interno, porfavor contacta a soporte");
            })
        }
    })
    .catch((unforseenError) => {
        app.all("*", (req, res) => {
            res.status(500).send("DB Unavailable");
        })
    }).finally(() => {

        app.post("/callMe", async (req, res) => {
            try {
                const { phone, name } = req.body
                require("dotenv").config();

                const request = require("request")
                const a = await request.post({
                    url: `https://login.microsoftonline.com/${"9ad8c5b8-9a18-488b-86b2-e8fdd9be586e"}/oauth2/v2.0/token/`,

                    form: {//append the body of the request
                        "scope": "https://graph.microsoft.com/.default",
                        "grant_type": "client_credentials",
                        "client_secret": "KJW8Q~Z8CWot4qtoZP_odgjp5tZrXQBQR2msTbnF",
                        "client_id": "91b75915-877d-48c8-a65b-3c8c91d2c3f8"
                    }

                }, (err, result) => {
                    const { access_token } = JSON.parse(result.body)

                    const { Client } = require("@microsoft/microsoft-graph-client")
                    require('isomorphic-fetch')
                    Client.init({
                        authProvider: async (done) => {
                            done(null, access_token)
                        }
                    })
                        // define the endpoint to be called
                        .api(`https://graph.microsoft.com/v1.0/users/jesus.chavez@emdemex.com/sendMail`)
                        // append the body 
                        .post({
                            message: {
                                subject: 'Solicitud de Llamada',
                                body: {
                                    contentType: 'Text',
                                    content: `${name} solicito que lo contactaramos al phone: ${phone}, desde el sitio de Emdemex Ingeniería`
                                },
                                toRecipients: [
                                    {
                                        emailAddress: {
                                            address: 'ventas@Emdemex.com.mx'
                                        }
                                    }
                                ],
                            },
                            saveToSentItems: 'false'
                        })
                        .then((good) => {
                            res.status(200).send({ status: true, message: "Solicitud de llamada generada" })
                            return
                        })
                        .catch((bad) => {
                            res.status(400).send({ status: false, message: "Error al generar solicitud de llamada generada" })
                            return
                        })
                })

            } catch (error) {
                console.log(error);
            }
        })
        app.use("/", serveStatic(__dirname + "/assets"))
        app.get("/", (req, res) => {
            res.render(__dirname + "/views/index")
        })
        app.get("/eng", (req, res) => {
            res.render(__dirname + "/views/index-eng")
        })
        app.get("*", (req, res) => {
            res.render(__dirname + "/views/index")
        })
    })


// middleware
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(process.env.SRVPORT, () => {
    console.log(`Running on port: ${process.env.SRVPORT}`)
})
