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

module.exports = router;