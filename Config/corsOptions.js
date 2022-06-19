const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1 || true){
            callback(null, true);
        }else{
            callback(new Error('not allow by cors'))
        }
    },
    credentials: true,
    optionSuccessStatus: 200
}

module.exports = corsOptions;