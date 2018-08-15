const express = require('express');
const session = require('express-session');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const flash = require('connect-flash');
//map global promise - get rid of warning
mongoose.Promise = global.Promise;
//connect to database
mongoose.connect('mongodb://localhost/mavid',{
    useMongoClient: true
}).then(()=>console.log('mongodb connect')).catch(err => console.log(err));

//load idea model
require('./models/idea');
const Idea = mongoose.model ('ideas');

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

//idea index Page
app.get('/ideas',(req,res)=>{
    Idea.find({}).sort({date:''})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas:ideas
        });
    });
})

//add ideas form
app.get('/ideas/add',(req, res)=>{
    res.render('ideas/add');
});

//edit idea form
app.get('/ideas/edit/:id',(req,res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea =>{
        res.render('ideas/edit',{
            idea:idea
        });
    } );
    
});

//form add proses
app.post('/ideas',(req, res)=>{
    let errors = [];
    if(!req.body.title){
        errors.push({
            text:'Please add a title'
        })
    }
    if(!req.body.details){
        errors.push({
            text:'please add some details'
        })
    }
    if(errors.length > 0){
        res.render('ideas/add',{
            errors:errors,
            title:req.body.title,
            details:req.body.details 
        });
    }else {
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser).save().then(Idea =>{
            req.flash('succes_msg','your data added');
            res.redirect('/ideas');
        });
    }
});

//edit form process
app.put('/ideas/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    }).then(idea=>{
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then(idea=>{
            req.flash('succes_msg','your data update');
            res.redirect('/ideas');
        });
    })
});
//delete
app.delete('/ideas/:id',(req,res)=>{
    Idea.remove({_id: req.params.id}).then(()=>{
        req.flash('success_msg','your data removed');
        res.redirect('/ideas');
    });
});



const port = 3000;

app.listen(port , ()=>{
    console.log("helo this is server");
});

