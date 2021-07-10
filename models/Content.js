const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title: {
        type: String,
        required:true
    },
    imgCover: {
        url:{ type: String},
        cid:{type:String}
    },
    
    desc: {
        type: String
    },
    images:[{ pos:{type:String} ,
        url:{type:String},
        cid:{type:String}
    }],

    texts:[{ pos:{type:Number} ,
        value:{type:String}}] ,
    
    writer: {
                type: mongoose.Schema.Types.ObjectId,
                required:true
            },

    subject:{
        type: mongoose.Schema.Types.ObjectId,
        required:true 
    }
    
});


const Content = mongoose.model('Content',contentSchema);

module.exports = Content;