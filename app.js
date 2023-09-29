require("dotenv").config()
const express = require("express");
const session = require("express-session")
const MongoDBStore = require("connect-mongodb-session")(session)
const mongosse = require("mongoose")
const passport = require("passport")
const handlebars = require("express-handlebars")
const PORT = 8080
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
//conexão com banco
mongosse.connect("mongodb://127.0.0.1:27017/banco_tcc").then(()=>{
    console.log("Conexão com o banco estabelecida")
}).catch((err)=>{
    console.log("Erro ao se conectar com o banco")
})

const data = new MongoDBStore(
    {
        uri: 'mongodb://127.0.0.1:27017/banco_tcc',
        collection: "sessions"
    }
)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: null,
        httpOnly: true,
        //secure: true
    },
    store:data
}))

require("./passport-setup")
app.use(express.static('public'))

app.engine("handlebars", handlebars.engine({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(passport.initialize())
app.use(passport.session())

app.get("/login", (req,res) =>{
    res.render("pages/login")
})

app.get("/", (req,res)=>{
    res.render("pages/home")
})

app.get("/google",passport.authenticate("google", {scope: ["email", "profile"] }))
app.get("/google/return", passport.authenticate("google", {failureRedirect: "/"}), (req,res)=>{
    res.redirect("/succes")

})

app.post("/cadEmpr", (req,res)=>{
    res.render("pages/empresaCad")
})

app.post("/cadUser",(req,res)=>{
    res.render("pages/usuarioCad")
})

app.listen(PORT, ()=>{
    console.log("Aplicação rodando na porta http://localhost:8080")
})