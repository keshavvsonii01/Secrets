require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs")
const mongoose = require("mongoose")
const encrypt =require("mongoose-encryption");
const { Console } = require("console");

const app = express();

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));

const encodedPass = encodeURIComponent("Heroku#01");
mongoose.connect("mongodb+srv://admin-keshav:" + encodedPass + "@workstarters.v1bdm8s.mongodb.net/secretsDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = process.env.SECRET_KEY;
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});


const User = new mongoose.model("User", userSchema);




app.get("/", function(req,res){
    res.render("home")
})


app.get("/login", function(req,res){
    res.render("login")
})


app.get("/register", function(req,res){
    res.render("register")
});

app.post("/register", function(req,res){
    const newUser = new User({
        email: req.body.username,
        password: req.body.password
    });
    newUser.save();
    res.render("secrets");
});


app.post("/login", function(req,res){
    const username = req.body.username;
    const password = req.body.password;
    async function login(){
        const findedUsername = await User.findOne({email: username})
        if(findedUsername.email === username){
            if(findedUsername.password === password){
                res.render("secrets")
            }
        }
    }
    login();
})















app.listen(3000, function(){
    console.log("CHALU HOGYA BC!")
})