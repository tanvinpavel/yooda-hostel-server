const express = require('express');
const mongoUtil = require('./Utility/mongoUtil');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const credentials = require('./Middleware/credentials');
const corsOptions = require('./Config/corsOptions');

//route method
const app = express();

//middleware
app.use([
    express.json(),
    credentials,
    cors(corsOptions),
    cookieParser(process.env.COOKIE_SECRET)
]);

//database connection 
mongoUtil.connectToServer( function( err, client ){
    if (err) {
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