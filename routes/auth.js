const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
// const { isLoggedIn } = require('../middleware');
const { isLoggedIn ,isAdmin} = require('../middleware');

router.post('/login',
    passport.authenticate('local',
        {
            failureRedirect: '/',
            failureFlash: true
        }
    ), (req, res) => {
             
        req.flash('success', `Welcome Back!! ${req.user.username}`)
        res.redirect('/myDashBoard');
});

//admin register
router.post('/adminRegister', async (req, res) => {
    
    try {
        if(req.body.secret!=process.env.AdminSecret)
        {throw new Error("Secret Code is wrong , contact site administrator");}

        const user = new User({ username: req.body.username, email: req.body.email,role:"admin" });
        const newUser = await User.register(user, req.body.password);
        req.flash('success', 'Registered Successfully');
        res.redirect('/login');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/adminRegister');
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out Successfully');
    res.redirect('/');
})

router.get('/addNewStudent',isLoggedIn,isAdmin,(req,res)=>{
    console.log("problem is there");
    res.render('addNewStudent');
})

router.post('/addNewStudent',isLoggedIn,isAdmin,async (req,res)=>{
    console.log(req.body);
    console.log(req.user);
 
    try {
        const user = new User({ username: req.body.username, email: req.body.email, role:"student", class:req.body.class, rollno:req.body.rollno, mobile:req.body.mobile,adminRef:req.user._id});
        const newUser = await User.register(user, req.body.password);
        req.flash('success', 'Registered Successfully');
        res.redirect('/myDashBoard');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
})

router.get('/addNewTeacher',isLoggedIn,isAdmin,(req,res)=>{
 
    res.render('addNewTeacher');
})
router.post('/addNewTeacher',isLoggedIn,isAdmin,async (req,res)=>{
    console.log(req.body);
    console.log(req.user);
 
    try {
        const user = new User({ username: req.body.username, email: req.body.email, role:"teacher", class:req.body.class, rollno:req.body.rollno, mobile:req.body.mobile,adminRef:req.user._id});
        const newUser = await User.register(user, req.body.password);
        req.flash('success', 'Registered Successfully');
        res.redirect('/myDashBoard');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/');
    }
})

router.post('/changePassword',isLoggedIn,async(req,res)=>{
    console.log(req.body);
    try {
      const user= await User.findById(req.user._id);
    await user.changePassword(req.body.oldPassword, req.body.newPassword,(err)=>{throw Error(err)});
    req.flash('success', 'password changed Successfully');
        res.redirect('/myDashBoard');
    }
    catch(e){
        req.flash('error', e.message);
        res.redirect('/');
    }

});

module.exports = router;
