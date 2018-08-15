const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


//user login
router.get('/login',(req,res)=>{
    res.render('users/login');
});

//users register
router.get('/register',(req,res)=>{
    res.render('users/register');
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
        res.send('passed');
    }
});

module.exports = router;