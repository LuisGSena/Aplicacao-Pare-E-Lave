require("dotenv").config()
const express = require("express");
const session = require("express-session")
const MySQLStore = require("express-mysql-session")(session);
const mysql = require("mysql2")
const passport = require("passport")
const handlebars = require("express-handlebars")
const PORT = 8080
const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
//conexão com banco
const db = mysql.createConnection({
    host: 'localhost',
    user: process.env.USER_NAME,
    password: process.env.PASSWORD_BANKSQL,
    database: process.env.DATABASE_NAME,
  });


  db.connect((err) => {
    if (err) {
      console.error('Erro ao se conectar com o banco de dados', err);
    } else {
      console.log('Conexão com o banco estabelecida');
    }
  });
  const sessionStore = new MySQLStore(
    {
        expiration: null, 
        createDatabaseTable: true, 
    },
    db 
  );
//congig session
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie:{
        maxAge: null,
        httpOnly: true,
        //secure: true
    },
    store:sessionStore
}))

require("./passport-setup")
app.use(express.static('public'))

app.engine("handlebars", handlebars.engine({defaultLayout: "main"}))
app.set("view engine", "handlebars")

app.use(passport.initialize())
app.use(passport.session())

//config rotas
app.get("/", (req,res) => {
    res.render("pages/home")
})

app.get("/login", (req,res) => {
    res.render("pages/login")
})

app.get("/sobre", (req,res) => {
    res.render("pages/sobre")
})

app.get("/servicos", (req,res) => {
    res.render("pages/servicos")
})

app.get("/plano", (req,res) => {
    res.render("pages/plano")
})

app.get("/cadastroUsuario", (req,res) => {
    res.render("pages/usuarioCad")
})

app.get("/cadastroEmpresa", (req,res) => {
    res.render("pages/empresaCad")
})

app.post("/loginEmpr", (req,res) => {
    res.render("pages/empresa_login")
})

app.post("/loginUser",(req,res) => {
    res.render("pages/usuario_login")
})

app.get("/usuariohome", (req,res) =>{
    res.render("pages/usuariohome")
})

//cofig google authenticate

app.get("/google",passport.authenticate("google", {scope: ["email", "profile"] }))
app.get("/google/return", passport.authenticate("google", {failureRedirect: "/"}), (req,res)=>{
    res.redirect("/usuariohome")

})


app.listen(PORT, () => {
    console.log("Aplicação rodando na porta http://localhost:8080")
})