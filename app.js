const express = require('express');
const session = require('express-session');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const flash = require('connect-flash');

//load routes
const ideas = require('./routes/ideas');
const users = require('./routes/users');

//map global promise - get rid of warning
mongoose.Promise = global.Promise;
//connect to database
mongoose.connect('mongodb://localhost/mavid',{
    useMongoClient: true
}).then(()=>console.log('mongodb connect')).catch(err => console.log(err));



//handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

//method override middleware
app.use(methodOverride('_method'));
//express session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  }));
//flash connect middleware
app.use(flash());

//global variables
app.use(function(req,res,next){
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//index route
app.get('/',(req,res)=>{
    const title = 'Welcome';
    console.log(req.name);
    res.render('index',{title: title});
});
//about 
app.get('/about',(req, res)=>{
    res.render('about');
});


//uses routes
app.use('/ideas',ideas);
app.use('/users',users);


const port = 3000;

app.listen(port , ()=>{
    console.log("helo this is server");
});

