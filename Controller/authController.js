const mongoUtil = require('../Utility/mongoUtil');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var db = mongoUtil.getDb();
require('dotenv').config();

const userCollection = db.collection('users');

// moduleScaffolding
const authController = {};

authController.signup = async (req, res) => {
    try {
        const {email, pass, name} = req.body;
        
        const uniqEmail = await userCollection.findOne({email: email});
        
        if(uniqEmail) return res.status(403).json('Email already exits');
        
        const encryPass = await bcrypt.hash(pass, 11);

        const userObj = {
            "UserInfo": {
                email,
                "roles": {
                    "User": 3986
                }
            }
        }

        const accessToken = CreateAccessToken(userObj);
        const refreshToken = CreateRefreshToken({name, email});
        
        // store userInfo & refresh token in database
        const result = await userCollection.insertOne({
            ...userObj,
            pass: encryPass,
            log: [ refreshToken ]
        });
        
        res.cookie('jwt', refreshToken, {
            path: "/",
            secure: true,
            httpOnly: true,
            maxAge: 1000*60*60*24,
            sameSite: 'none'
        });
        
        res.status(200).json({name, accessToken, roles: { User: 3986 }});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const CreateAccessToken = (info) => {
    return jwt.sign(info, process.env.ACCESSTOKEN, {
        expiresIn: '15m'
    });
};
const CreateRefreshToken = (info) => {
    return jwt.sign(info, process.env.REFRESHTOKEN, {
        expiresIn: '1d'
    });
};

authController.login = async (req, res) => {
    try {
        const {email, pass} = req.body;
        const result = await userCollection.findOne({email});

        if(!result) return res.status(401).json('Wrong email & password');
        
        const isValidPassword = await bcrypt.compare(pass, result.pass);
        
        if(!isValidPassword) return res.status(401).json('Wrong email & password');

        const roles = Object.values(result.roles);

        const userObj = {
            "UserInfo": {email, roles}
        }

        const accessToken = CreateAccessToken(userObj);
        const refreshToken = CreateRefreshToken({name: result.name, email});

        //store refresh token in database
        const filter = { email: result.email };
        const update = { $push: {log: refreshToken} };
        const option = { upsert: true };

        const response = await userCollection.updateOne(filter, update, option);

        res.cookie('jwt', refreshToken, {
            maxAge: 1000*60*60*24,
            httpOnly: true,
            secure: true,
            sameSite: 'none'
        })

        res.status(200).json({name: result.name, accessToken, roles });
    } catch (error) {
        res.status(500).json('Internal server error');
    }
}

authController.logout = async (req, res) => {
    try {
        const refreshToken = req?.cookies?.jwt;
        if(!refreshToken) return res.status(401).json('Authorization Failed');
        
        //remove refreshToken from db
        const filter = { email: req.userEmail };
        const query = { $pull: { log: refreshToken } };

        const response = await userCollection.updateOne(filter, query);
        //remove cookie
        res.cookie('jwt', '', { maxAge: 0 });
        
        res.json(response);
    } catch (error) { 
        res.status(500).json('Internal server error');
    }   
}

authController.newAccessToken = async (req, res) => {
    try {
        const token = req?.cookies?.jwt;
        if(!token) return res.status(401).json('Authorization Failed');
        const validToken = await jwt.verify(token, process.env.REFRESHTOKEN);

        if(!validToken) return res.status(401).json('Authorization Failed');

        const query = {log: { $elemMatch: {$eq: token} } };

        const findUser = await userCollection.findOne(query);

        if(!findUser) return res.status(401).json('Authorization Failed');

        const userObj = {
            "UserInfo": {
                email: findUser.email,
                roles: findUser.roles,
            }
        };

        const newAccessToken = CreateAccessToken(userObj);

        res.json({accessToken: newAccessToken});
    } catch (error) {
        res.status(500).json('Internal server error');
    }
}

module.exports = authController;