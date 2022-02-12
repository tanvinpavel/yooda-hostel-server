const express = require('express');
const mongoUtil = require('./Utility/mongoUtil');
const cors = require('cors');


//route method
const app = express();

//middleware
app.use(express.json());
app.use(cors());



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

        app.use('/meal', mealsRoute);
        app.use('/student', studentRoute);
        console.log('Server connected');
    }
});

const errorHandlerMiddleware = (err, req, res, next) => {
    if(err){
        console.log(err);
        res.status(500).send(err);
    }
};

//call error handler
app.use(errorHandlerMiddleware);

//port variable
const port = process.env.PORT || 4000;

app.listen(port, () => {
    console.log('Server is running in port ' + port);
})