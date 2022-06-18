const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {
        if(allowedOrigins.indexOf(origin) !== -1){
            console.log('incoming origin', origin);
            callback(null, true);
        }else{
            console.log('incoming origin', origin);
            callback(new Error('not allow by cors'))
        }
    },
    credentials: true,
    optionSuccessStatus: 200
}

module.exports = corsOptions;