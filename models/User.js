const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique:true
    },
    role:{
        type: String,
        required: true
    },
    profilePic: {
        url:{ type: String,default:'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_960_720.png'},
        cid:{type:String,default:'0'}
    },
    rollno:{
        type:Number
    },
    class:{
        type:Number
    },
    mobile:{
        type:Number
    },
    adminRef:{
        type: mongoose.Types.ObjectId
    }



})

userSchema.plugin(passportLocalMongoose);

const User = mongoose.model('User', userSchema);

module.exports = User;