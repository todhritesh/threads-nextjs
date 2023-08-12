import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    id:{
        type:String,
        required:true,
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,required:true
    },
    bio:String,
    threads:[{
        type:mongoose.Types.ObjectId,
        ref:'Thread'
    }],
    onboarded:{
        type:Boolean,
        default:false
    },
    communities:[{
        type:mongoose.Types.ObjectId,
        ref:'Community'
    }],
    image:String

})

const User = mongoose.models.User || mongoose.model("User",userSchema)

export default User