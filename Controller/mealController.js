const { ObjectId } = require('mongodb');
const mongoUtil  = require('../Utility/mongoUtil');
var db = mongoUtil.getDb();

const meals = db.collection('meals');

//module scaffolding
const mealController = {};

//controllers
mealController.loadAllMealData = async (req, res) => {
    try {
        const limitInt = parseInt(req.query.limit);
        const pageInt = parseInt(req.query.page);

        const cursor = meals.find({});
        const count = await cursor.count();
        let payload;

        if(pageInt){
            payload = await cursor.skip(limitInt * (pageInt-1)).limit(limitInt).toArray();
        }else{
            payload = await cursor.toArray();
        }
        res.status(200).json({count, payload})
    } catch (error) {
        res.status(500).json(error);
    }
};

mealController.loadMealDataById = (req, res) => {
    const query = { _id: ObjectId(req.params.id) };
    meals.findOne(query, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'data fetch failed'
            });
        }else{
            res.status(200).json(data);
        }
    })
}

mealController.addNewMeal = async (req, res) => {
    try{
        //type casting
        const priceInt = parseInt(req.body.price);
        //create payload
        const payload = {
            name: req.body.name,
            price: priceInt
        }
        await meals.insertOne(payload);

        res.status(200).json({
            message: 'data insert successfully'
        })
    }catch(e){
        res.status(500).json({
            error: 'data insert Failed'
        })
    }
}

mealController.updateMealById = (req, res) => {
    const query = {_id: ObjectId(req.params.id)};

    //type casting
    req.body.price && (req.body.price = parseInt(req.body.price));


    meals.updateOne(query, {$set: req.body}, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'data update failed'
            });
        }else{
            res.status(200).json(data);
        }
    })

}

mealController.deleteMealById = async (req, res) => {
    try{
        let query = {_id: ObjectId(req.params.id)};
        let result = await meals.deleteOne(query);

        if(result.deletedCount === 1){
            res.status(200).json(result);
        }
    }catch{
        res.status(500).json({
            error: 'data delete Failed'
        })
    }
}

mealController.deleteMany = async (req, res)  => {
    try {
        console.log(req.body);
        const {statusIDList} = req.body;
        const query = statusIDList.map(i => ObjectId(i));
        const result = await meals.deleteMany({_id: {$in: query}});
        
        res.send(result);
    } catch (error) {
        res.status(500).json({
            error
        })
    }
}

module.exports = mealController;