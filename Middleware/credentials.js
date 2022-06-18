const allowedOrigins = require('../Config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req?.headers?.origin;
    if(allowedOrigins.includes(origin) !== -1){
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = credentials;