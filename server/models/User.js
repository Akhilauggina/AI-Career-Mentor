const mongoose=require("mongoose");
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    skills:{
        type:[String],
        default:[]
    },
    education:[{
        degree:String,
        college:String,branch:String,
        cgpa:Number,
        passingYear:Number
    }
       
],
    carrerGoal:{
        type:String,
        default:""
    },
    profilePicture:{
        type:String,
        default:""}

    },{timestamps:true});

module.exports=mongoose.model("User",userSchema);