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
        const payload = {name, email}; 
        
        const uniqEmail = await userCollection.findOne({email: email});
        
        if(uniqEmail) return res.json('email already exits');
        
        payload.pass = await bcrypt.hash(pass, 11);

        const result = await userCollection.insertOne(payload);
        res.json(result);
    } catch (err) {
        res.status(500).json('internal server error');
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

        if(!result) return res.status(401).json('wrong email & password 1');
        
        const hashPass = await bcrypt.compare(pass, result.pass);        

        const accessToken = CreateAccessToken({name: result.name, email});
        const refreshToken = CreateRefreshToken({name: result.name, email});

        //store refresh token in database
        const filter = { email: result.email };
        const update = { $push: {log: refreshToken} };
        const option = { upsert: true };

        const response = await userCollection.updateOne(filter, update, option);

        res.cookie('jwt', refreshToken, {
            domain: 'https://powerful-river-71836.herokuapp.com/'
            maxAge: 1000*60*60*24,
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
        })

        res.json({name: result.name, accessToken});
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
        console.log(error);   
        res.status(500).json('Internal server error');
    }   
}

authController.newAccessToken = async (req, res) => {
    try {
        const token = req?.cookies?.jwt;
        if(!token) return res.status(401).json('Authorization Failed');
        const validToken = await jwt.verify(token, process.env.REFRESHTOKEN);

        if(!validToken) return res.status(401).json('Authorization Failed');

        // const query = {log: { $in: [token] } };
        const query = {log: { $elemMatch: {$eq: token} } };

        const response = await userCollection.findOne(query);

        if(!response) return res.status(401).json('Authorization Failed');

        const newAccessToken = CreateAccessToken({name: validToken.name, email: validToken.email});

        res.json({accessToken: newAccessToken});
    } catch (error) {
        res.status(500).json('Internal server error');
    }
}

module.exports = authController;