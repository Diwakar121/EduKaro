const mongoose = require('mongoose');
const Review = require('./User');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    class: {
        type:Number
    },
    adminRef:{
        type: mongoose.Types.ObjectId
    },
    teacherRef:{
        type: mongoose.Types.ObjectId 
    }
   
    
});


const Subject = mongoose.model('Subject',subjectSchema);

module.exports = Subject;