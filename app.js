const express = require('express');
const mongoUtil = require('./Utility/mongoUtil');
const cors = require('cors');
const cookieParser = require('cookie-parser');

//route method
const app = express();

const whiteList = ['http://127.0.0.1:5050', 'http://localhost:3000', 'https://quizzical-brahmagupta-875937.netlify.app'];

const axiosOption = {
    origin: (origin, callback) => {
        if(whiteList.indexOf(origin) !== -1){
            callback(null, true);
        }else{
            console.log(origin);
            callback(new Error('not allow by cors'))
        }
    },
    credentials: true,
    optionSuccessStatus: 200
}

//middleware
app.use(express.json());
app.use(cors(axiosOption));
app.use(cookieParser());

//database connection 
mongoUtil.connectToServer( function( err, client ){
    if (err) {
        console.log(err);
        res.status(500).send(err);
    }else{
        app.get('/', (req, res) => {
            res.send('hi this is yooda hostel');
        });

        const mealsRoute = require('./Routes/mealsRoute');
        const studentRoute = require('./Routes/studentRoute');
        const mealDistributionRoute = require('./Routes/mealDistributionRoute');
        const authRoute = require('./Routes/authRoute');
        
        app.use('/meal', mealsRoute);
        app.use('/student', studentRoute);
        app.use('/mealDist', mealDistributionRoute);
        app.use('/auth', authRoute);
        console.log('Server connected');
    }
});

//port variable
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('Server is running in port ' + port);
})