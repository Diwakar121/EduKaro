
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const { isLoggedIn ,isAdmin} = require('./middleware');





// //models
const User = require('./models/User');

// // Routes
const authRoutes =require('./routes/auth');
// const myDashBoard = require('./routes/myDashBoard');
const subjectRoutes = require('./routes/subject');
const userRoutes = require('./routes/user');
const Subject = require('./models/Subject');


app.set('view engine', 'ejs')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json({limit:'1mb'}))
app.use(methodOverride('_method'));

const sessionConfig = {
    secret: 'itisarandomsecret123',
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionConfig));
 app.use(flash());



// Initilising the passport and sessions for storing the users info
app.use(passport.initialize());
app.use(passport.session());

// configuring the passport to use local strategy
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    next();
})




mongoose.connect(process.env.DB_URL,
 {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{console.log("DB connected Sucessfully")})
.catch((e)=>{console.log("error occured");
             console.log(e.message);
});
mongoose.set('useFindAndModify',false);

app.get('/',(req,res)=>{res.render('index');})
app.get('/adminRegister',(req,res)=>{res.render('adminSignup');})



app.use(authRoutes);
app.use(subjectRoutes);
app.use(userRoutes);

app.get('/myDashBoard',isLoggedIn,async(req,res)=>{

    
    if(req.user.role=='admin')
    {  var students=[];
        for(let k=1;k<=12;k++)
        {
            let classStudent = await User.find({role:'student',adminRef:req.user._id,class:k});
            console.log(classStudent);
            students.push(classStudent);
              
        }

        let teachers = await User.find({role:'teacher',adminRef:req.user._id});
    console.log(students);

    res.render('myDashBoard',{students,teachers});
    }   
    else if(req.user.role=='teacher')
    { 
        const teacher= await User.findById(req.user._id);

        var subjects=await Subject.find({adminRef:teacher.adminRef,teacherRef:req.user._id});

        res.render('myDashBoard',{subjects}); 
    }
    else if(req.user.role=='student')
    { 
        
        var subjects=await Subject.find({adminRef:req.user.adminRef,class:req.user.class});

        res.render('myDashBoard',{subjects}); 
    }
    
});

app.get('/mySettings',isLoggedIn,(req,res)=>{

    res.render('mySettings');
});


app.get('*',(req,res)=>{
    res.send('<h1>Looks like you are lost ,go to </h1><a href="/">home</a>');
})



const http = require('http');
const socketio = require('socket.io');
const server = http.createServer(app);
const io = socketio(server);
const rooms={};





io.on('connection', (socket) => {
    
    socket.on('enter', (data) => {
    socket.join(data.room)
    console.log("here")
    console.log(data)
   // console.log(name)
    if(rooms[data.room]==null)
    { 
            rooms[data.room]={users:{}}
    }
    rooms[data.room].users[socket.id] = data.name
    console.log(rooms);
    
   

    })

    socket.on('send_msg', (data) => {
        console.log(data);
        socket.to(data.room).emit('rcvd_msg', { msg: data.msg, name: rooms[data.room].users[socket.id] })
        console.log(data);
        
      })

})


server.listen(process.env.PORT || 3001, () => {
    console.log('server running at http://localhost:3001');
})