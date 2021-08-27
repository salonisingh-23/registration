const mongoose=require("mongoose");
const employeeSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    pass:{
        type:String,
        required:true,
        unique:true
    }
})
const Register=new mongoose.model("Register",employeeSchema);
module.exports=Register;