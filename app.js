const express = require('express');
const app = express();
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
var methodOverride = require('method-override')

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

//form proses
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
            res.redirect('/ideas');
        })
    })
});
//delete
app.delete('/ideas/:id',(req,res)=>{
    Idea.remove({_id: req.params.id}).then(()=>{
        res.redirect('/ideas');
    })
});

const port = 3000;

app.listen(port , ()=>{
    console.log("helo this is server");
});

