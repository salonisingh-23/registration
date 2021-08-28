const express = require('express');
const app=express();
const path=require("path");
const hbs=require("hbs");
require("./db/conn");
const Register=require("./models/registers");
const { json }=require("express");
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


app.listen(port,()=> {
    console.log(`server is running at port no ${port}`);
})