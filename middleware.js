const isAdmin = (req,res,next) => {
    if (req.user.role=='admin') {
        next();
    }
    else
    {
        req.flash('error', 'This is a secure route');
         res.redirect('/');
         return;
    }
    
}

const isLoggedIn = (req,res,next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Something went wrong');
        res.redirect('/');
        return;
    }
    else
    {
    next();
    }
}

const isTeacher = (req,res,next) => {
    if (req.user.role=='teacher') {
        next();
    }
    else
    {
        req.flash('error', 'This is a secure route,not for you');
         res.redirect('/');
         return;
    }
    
}


module.exports = {
    isLoggedIn,
    isAdmin,
    isTeacher
}

