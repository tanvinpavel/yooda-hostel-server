const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
    optionSuccessStatus: 200
}

module.exports = corsOptions;