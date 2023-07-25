const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/userModel');
const {authenticate, validate, devalidateToken, generateToken, validateToken} = require('../utils/auth');
const Profile = require('../models/profileSchema');


router.get('/profile', validateToken, async (req, res)=> {
    const currentUser = req.user;

        //Make profile data schema and seperate user auth info with user profile info
    try {
        const profile = await Profile.getUserProfile(currentUser.userName);
        res.json(profile);
    }

    catch(error) {
        console.log(error);
        res.status(404).json({msg: "Profile Not Found or something"});
    }

});

router.put('/profile', validateToken, async (req, res)=> {

    const user = req.user;
    const profileData = req.body.profileData;

    try {
        console.log(profileData);
        await Profile.updateProfile(user.userName, profileData);
        res.status(200).json({success: true})
    }
    catch(error) {
        console.log("Failed to update Profile Data");
        res.status(500).json({success: false});
    }

});


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

        const profileData = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            contact: req.body.contact,
            dob: req.body.dob,
            userName: req.body.userName,
        };

        const newProfile = Profile(profileData);
        await newProfile.save();
        console.log('User profile data saved.');

        resData.success = true;
        res.json(resData);

    } catch(error) {
        console.log(error);
        res.json(resData);
        
    }

});

router.put('/changePassword', validateToken, async (req, res)=> {
    const currentUser = req.user.userName;

    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;

    try {
        const userData = await User.findByUser(currentUser);
        if(userData) {
            const match = await bcrypt.compare(oldPassword, userData.password);
            if(match) {

                const hash = await bcrypt.hash(newPassword, 10);

                await User.updatePassword(currentUser, hash);
                res.status(200).json({"msg": "Password updated success"});
            }

            else {
                res.status(403).json({msg: "Wrong Password"});
            }
        }

        else {
            res.status(500).json({msg: "User not found in database"});
        }

    } catch(error) {
        res.send(error);
    }
});

router.post('/login', authenticate, async (req, res)=> {
    

    const resData = req.resData;

    const token = await generateToken(req.user.userName);

   resData.success = true;

   resData.token = token;
   res.json(resData);

});

router.get('/logout', async (req, res)=> {
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