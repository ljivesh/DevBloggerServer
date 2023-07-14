const User = require('../models/userModel');
const Session = require('../models/sessionModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const configs = require('../configs');

const validate = async (req, res, next) => {
    
    const newUserData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
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
                req.user = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    email: user.email
                };
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

const generateToken = async (userName)=> {

    console.log(userName);

    try {
        const token = jwt.sign({userName: userName}, configs.jwtSecret, {expiresIn: '4h'});

        const decoded = jwt.verify(token, configs.jwtSecret);
        const sessionData = {
            userName: userName,
            iat: decoded.iat,
        };

        const session = new Session(sessionData);
        try {
            await session.save();
            return token;
        } catch(error) {
            console.log(error);
        }

    } catch(error) {
        console.log(error);
    }
}

const validateToken = async (req, res, next) => {
    
    if (!req.headers.authorization) {
        return res.status(401).json({ error: "Not Authorized" });
      }
    
    // Bearer <token>>
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    
    
    try {
        const payload = jwt.verify(token, configs.jwtSecret);
        
        const session = await Session.findSession(payload.userName, payload.iat);


        if(session) {
            
            try {
                const user = await User.findByUser(session.userName);
                req.user = {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    userName: user.userName,
                    email: user.email,
                };
                next();
            } catch(error) {
                console.log(error);
            }
        }

        else {
            res.status(401).json({ error: "Not Authorized" });
        }


    } catch (error) {
        return res.status(401).json({ error: "Not Authorized" });
    }
}

const devalidateToken = async (token)=> {
    const payload = jwt.verify(token, configs.jwtSecret);
    try {
        await Session.deleteSession(payload.userName, payload.iat);
        return true;
    }
    catch (error) {
        console.log(error);
        return false;
    }
}

module.exports = {
    authenticate,
    validate,
    generateToken,
    validateToken,
    devalidateToken,
};