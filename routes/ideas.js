const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//load idea model
require('../models/idea');
const Idea = mongoose.model ('ideas');

//idea index Page
router.get('/',(req,res)=>{
    Idea.find({}).sort({date:''})
    .then(ideas=>{
        res.render('ideas/index',{
            ideas:ideas
        });
    });
})

//add ideas form
router.get('/add',(req, res)=>{
    res.render('ideas/add');
});

//edit idea form
router.get('/edit/:id',(req,res)=>{
    Idea.findOne({
        _id: req.params.id
    }).then(idea =>{
        res.render('ideas/edit',{
            idea:idea
        });
    } );
    
});

//form add proses
router.post('/',(req, res)=>{
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
            req.flash('success_msg','your data added');
            res.redirect('/ideas');
        });
    }
});

//edit form process
router.put('/:id',(req,res)=>{
    Idea.findOne({
        _id:req.params.id
    }).then(idea=>{
        //new values
        idea.title = req.body.title;
        idea.details = req.body.details;
        idea.save().then(idea=>{
            req.flash('success_msg','your data update');
            res.redirect('/ideas');
        });
    })
});
//delete
router.delete('/:id',(req,res)=>{
    Idea.remove({_id: req.params.id}).then(()=>{
        req.flash('success_msg','your data removed');
        res.redirect('/ideas');
    });
});

module.exports = router;