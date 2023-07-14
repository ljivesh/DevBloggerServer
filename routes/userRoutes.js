const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const {authenticate, validate} = require('../utils/auth');

router.post('/register', validate,  async (req, res)=> {
    


    const newUserData = req.user;
    const resData = req.resData;

    const hash = await bcrypt.hash(newUserData.password, 10);

    const secureUser = {
        userName: newUserData.userName,
        password: hash,
        email: newUserData.email,
    };

    const newUser = User(secureUser);
        
    try {
        
        await newUser.save();
        console.log('User Registered Successfully');

        resData.success = true;
        res.json(resData);

    } catch(error) {
        console.log(error);
        res.json(resData);
        
    }

});

router.post('/login', authenticate, async (req, res)=> {
    

    const resData = req.resData;
   console.log(req.user); 

   resData.success = true;
   res.json(resData);

});

module.exports = router;