const express = require('express');
const router = express.Router();
const User = require('../models/User');
const passport = require('passport');
// const { isLoggedIn } = require('../middleware');
const { isLoggedIn ,isAdmin} = require('../middleware');


router.get('/deleteStudent/:did',isLoggedIn,isAdmin,async(req,res)=>{
    // console.log("problem is there");
    console.log( req.params.did);
    // res.render('addNewStudent');

    try {

        await User.findByIdAndDelete(req.params.did);
      
        
        req.flash('success', 'Deleted the user successfully');
        res.redirect('/myDashBoard');   
        }
        catch (e) {
            console.log(e.message);
            req.flash('error', 'Cannot delete this user');
            res.redirect('/error');
        }
});

router.get('/deleteTeacher/:did',isLoggedIn,isAdmin,async(req,res)=>{
    // console.log("problem is there");
    console.log( req.params.did);
    // res.render('addNewStudent');

    try {
        
        await User.findByIdAndDelete(req.params.did);
      
        
        req.flash('success', 'Deleted the user successfully');
        res.redirect('/myDashBoard');   
        }
        catch (e) {
            console.log(e.message);
            req.flash('error', 'Cannot delete this user');
            res.redirect('/error');
        }
});











module.exports = router;
