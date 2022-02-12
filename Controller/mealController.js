const { ObjectId } = require('mongodb');
const mongoUtil  = require('../Utility/mongoUtil');
var db = mongoUtil.getDb();

const meals = db.collection('meals');

//module scaffolding
const mealController = {};

//controllers
mealController.loadAllMealData = (req, res) => {
    meals.find().toArray((err, data) => {
        if(err){
            res.status(500).json({
                error: 'data fetch failed'
            });
        }else{
            res.status(200).json(data);
        }
    })  
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
        await meals.insertOne(req.body);

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
    const payload = {$set: req.body};

    meals.updateOne(query, payload, (err, data) => {
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

module.exports = mealController;