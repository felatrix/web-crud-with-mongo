const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


//user login
router.get('/login',(req,res)=>{
    res.send('login');
});

//users register
router.get('/register',(req,res)=>{
    res.send('register');
});

module.exports = router;