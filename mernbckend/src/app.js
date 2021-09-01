const express = require('express');
const app=express();
const path=require("path");
const hbs=require("hbs");
// const ejs=require('ejs');
require("./db/conn");
const Register=require("./models/registers");
const { json }=require("express");
const Article = require('./models/articles');
// const methodOverride = require('method-override');
const articleRouter = require('./../routes/articles.js');
const port=process.env.PORT || 3000;

const static_path=path.join(__dirname,"../public");
const template_path=path.join(__dirname,"../templates/views");
const partials_path=path.join(__dirname,"../templates/partials");
app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views",template_path);
hbs.registerPartials(partials_path);


app.get("/",(req,res)=> {
res.render("index")
//res.send("hey saloni")
});

app.get("/register",(req,res)=>{
    res.render("register");
    // console.log(`${email}`);
    // console.log(req.body.pass);
})
app.get("/login",(req,res)=>{
    res.render("login");
})
app.get("/forgot",(req,res)=>{
    res.render("forgot");
})
app.get("/home",(req,res)=>{
    res.render("home");
})
app.post('/forgot',async(req,res)=>{
    try{
    const email=req.body.email;
    const newpass=req.body.newpass;
    const cpass=req.body.cpass;
    //const usermail=await Register.findOne({email:email});
    if(newpass===cpass){
    await Register.findOneAndUpdate({email:email},{$set:{pass:newpass}});
    res.render("index");
   }
   else{
       res.send("Passwords don't match");
   }
    }
    catch(error){
        console.log(error);
    }
})
app.post("/login",async(req,res)=>{
    try{
        const email=req.body.email;
        const pass=req.body.pass;
        // console.log(`${email} and password is ${password}`)
        const useremail=await Register.findOne({email:email});
        if(useremail.pass=== pass)
        {
            res.status(201).render("home");
        }
        else{
            res.send("Password entered is wrong");
        }
        // res.send(useremail);
        // console.log(useremail);
    }
   catch(error){
       res.status(400).send("Invalid Email");
   }
})

app.post("/register",async(req,res)=>{
  try{
     
const registerEmployee=new Register({
    email: req.body.email,
    pass: req.body.pass 
})
const registered=await registerEmployee.save();
res.status(201).render("index");
  }
  catch(error){
res.status(400).send(error);
  }
})

app.use('/articles', articleRouter)


app.get('/articles', async (req, res) => {
    const articles = await Article.find().sort({ createdAt: 'desc' })
    res.render('articles/index', { articles: articles })
  })

app.post("/articles",async(req,res)=>{

    

    // res.render('posts/home',{posts:posts})
    try{
            const email=req.body.sign_username;
            const pass=req.body.sign_password;

            const uname=await Register.findOne({email:email});

            console.log(uname);
            if(uname.pass===pass){

                const articles = await Article.find().sort({ createdAt: 'desc' })
                res.render('articles/index', { articles: articles })
                // res.status(201).render("articles/index");
                // res.render("articles/index.ejs",{posts:posts});
            }
            else{
                res.send("<h1>Password/username did not match</h1>");
            }
    }
    catch(error){
            res.send("invalid username/password");
        }
    
})
app.listen(port,()=> {
    console.log(`server is running at port no ${port}`);
})