const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Subject = require('../models/Subject');
const Content = require('../models/Content');
const passport = require('passport');
const fs = require('fs');
const upload = require('../controllers/multer')
const cloudinary = require('../controllers/cloudinary')
const { isLoggedIn ,isAdmin,isTeacher} = require('../middleware');


router.get('/addNewSubject',isLoggedIn,isTeacher,async(req,res)=>{
    
res.render('addNewSubject');

});

router.post('/addNewSubject',isLoggedIn,isTeacher,async(req,res)=>{
    
    try {
        const teacher= await User.findById(req.user._id);
    console.log(teacher.adminRef);
    var subjBody ={name:req.body.subjectName,class:req.body.class,teacherRef:req.user._id,adminRef:teacher.adminRef};
    console.log(subjBody);
     await Subject.create(subjBody);
        req.flash('success', 'Added Successfully');
        res.redirect('/myDashBoard');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
    
    });

router.get('/addContent/:subjID',isLoggedIn,isTeacher,async(req,res)=>{
    
    res.render('content/addContent',{subjID:req.params.subjID});
        
});


router.post('/addContent/:subjID',isLoggedIn,isTeacher,upload.array('image'), async(req,res)=>{
    const uploader =async (path) => await cloudinary.uploads(path,'Images')
  
const reqObj = JSON.parse(req.body.extra);

    const images =[];
    const files = req.files
    const coverImg={}
    

    var i=0;
    var indx=0;
    for(let file of files)
    {    
        if(i== 0 && reqObj.imgCoverPresent=='true')
        {
        const {path} = files[0]
        const newPath = await uploader(path)
        coverImg.url=newPath.url;
        coverImg.cid=newPath.id;

        fs.unlinkSync(path);
        i+=1;
            continue;
        }

        const {path} = file
        const newPath = await uploader(path)
        var nwobj ={};
        nwobj.url =newPath.url;
        nwobj.id=newPath.id;
        nwobj.pos=reqObj.images[indx].pos;

        images.push(nwobj);

        fs.unlinkSync(path);
        indx+=1;
        i+=1;
    }


    try {
       
 var contentBody = {writer: req.user._id,subject:req.params.subjID,title:reqObj.title,imgCover:coverImg,desc:reqObj.desc,images:images,texts:reqObj.texts }
    var id;
  await Content.create(contentBody).then(savedDoc => id=savedDoc.id); 
    var user = await User.findById(req.user._id);
  
 
    req.flash('success', 'Content Added Successfully');  
    res.status(200).send({"code":"ok"});
    }

    catch(e) {
        console.log(e.message);
        req.flash('error',`error, Cannot Add content, Something is Wrong :- ${e.message}`);
        res.redirect('myDashBoard');
    }
});



router.get('/viewSubject/:subjID',isLoggedIn,async(req,res)=>{
    console.log(req.params.subjID);
    let contents= await Content.find({subject:req.params.subjID});
    let subject= await Subject.findById(req.params.subjID);
    console.log(contents);
    console.log(subject);
    res.render('viewSubject',{contents,subject});
});


router.get('/discussionRoom/',isLoggedIn,async(req,res)=>{

    res.render('discussionRoom');
});

router.get('/viewContent/:contentID',isLoggedIn,async(req,res)=>{
   
    let content= await Content.findById(req.params.contentID);
  
    console.log(content);

    res.render('content/viewContent',{content});
});

router.delete('/contents/:id',isLoggedIn,isTeacher,async (req, res) => {

    try {
        console.log(req.params.id);
        let content= await Content.findById(req.params.id);
        console.log(content.writer);
        
        if(!req.user._id.equals(content.writer))
        {throw Error("Unauthorized access");}
        
        await Content.findByIdAndDelete(req.params.id);

    
   req.flash('success', 'Deleted the content successfully');
    res.redirect('/myDashBoard');   
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot delete this content');
        res.redirect('/myDashBoard');
    }

})


router.get('/deleteSubject/:id',isLoggedIn,isTeacher,async (req, res) => {

    try {
        console.log(req.params.id);
        let subject= await Subject.findById(req.params.id);
        console.log(subject.teacherRef);
        
        if(!req.user._id.equals(subject.teacherRef))
        {throw Error("Unauthorized access");}
        
        await Subject.findByIdAndDelete(req.params.id);

    
   req.flash('success', 'Deleted the Subject successfully');
    res.redirect('/myDashBoard');   
    }
    catch (e) {
        console.log(e.message);
        req.flash('error', 'Cannot delete this Subject');
        res.redirect('/myDashBoard');
    }

})
module.exports = router;
