const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

//load user model 
require('../models/User');
const User = mongoose.model('users');


//user login
router.get('/login',(req,res)=>{
    res.render('users/login');
});

//users register
router.get('/register',(req,res)=>{
    res.render('users/register');
});

//login form post
router.post('/login',(req,res,next)=>{
    passport.authenticate('local',{
        succesRedirect:'/ideas',
        failureRedirect:'/users/login',
        failureFlash:true
    })(req,res,next);
});

//register form POST
router.post('/register',(req,res)=>{
    let errors = [];

    if(req.body.password != req.body.password2){
        errors.push({
            text:"you didnt type same password"
        });
    }

    if(req.body.password < 4 && req.body.password2 < 4){
        errors.push({
            text:"password atleast 4 characters"
        });
    }

    if(errors.length > 0 ){
        res.render('users/register',{
            errors:errors,
            name:req.body.name,
            email:req.body.email,
            password:req.body.password,
            password2:req.body.password2
        });
    } else {
        User.findOne({email:req.body.email}).then(user=>{
            if(user){
                req.flash('error_msg','Email already registered');
                res.redirect('/users/register');
            }
        })
        const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        });
        bcrypt.genSalt(10,(err,salt)=>{
            bcrypt.hash(newUser.password,salt,(err,hash)=>{
                if(err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(user=>{
                    req.flash('success_msg','you are now register and can login');
                    res.redirect('/users/login');
                }).catch(err=>{
                    console.log(err);
                    return;
                })
            });
        })
       
    }
});

module.exports = router;