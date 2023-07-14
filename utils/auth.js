const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const validate = async (req, res, next) => {
    
    const newUserData = {
        userName: req.body.userName,
        password: req.body.password,
        email: req.body.email,
    };

    const resData = {
        userExists: false,
        emailExists: false,
        success: false,
    }

    try {
        const user = await User.findByUser(newUserData.userName);
        
        if(user) {
            resData.userExists = true;

            if(user.email == newUserData.email) {

                resData.emailExists = true;
            }
            
            res.json(resData);

        }
        else {
            const otherUser = await User.findByEmail(newUserData.email);
            
            if(otherUser) {
                resData.emailExists = true;
                res.json(resData);
            }

            else {
                req.user = newUserData;
                req.resData = resData;
                next();
            } 
        }
    } catch(error) {
        console.log(error);
    }
}

const authenticate = async (req, res, next) => {

    const loginData = {
        userName: req.body.userName,
        password: req.body.password,
    };

    const resData = {
        userFound: false, 
        passwordMatched: false,
        success: false,
    };

    try {
        const user = await User.findByUser(loginData.userName);

        if(user) {
            
            resData.userFound = true;

            const match = await bcrypt.compare(loginData.password, user.password);

            if(match) {

                resData.passwordMatched = true;
                req.user = user;
                req.resData = resData;
                next();
            }

            else {
                res.send(resData);

            }
        }
        else res.send(resData);

    } catch(error) {
        console.log(error);
    }
}


module.exports = {
    authenticate,
    validate,
};