const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const {authenticate, validate, devalidateToken, generateToken, validateToken} = require('../utils/auth');


router.post('/profile', validateToken, (req, res)=> {
    const profileData = req.user;
    res.json(profileData);
});


router.post('/register', validate,  async (req, res)=> {
    


    const newUserData = req.user;
    const resData = req.resData;

    const hash = await bcrypt.hash(newUserData.password, 10);

    const secureUser = {
        firstName : newUserData.firstName,
        lastName: newUserData.lastName,
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

    const token = await generateToken(req.user.userName);

   resData.success = true;

   resData.token = token;
   res.json(resData);

});

router.post('/logout', async (req, res)=> {
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Not Authorized" });
      }
    
    // Bearer <token>>
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];

    try {
        await devalidateToken(token);
        res.status(200).json({
            "success": true,
            "message": "Logout Success"
        });
    } catch(error) {
        res.status(500).json({
            "success": false,
            "message": "Logout Failed"
        })
    }

});

module.exports = router;