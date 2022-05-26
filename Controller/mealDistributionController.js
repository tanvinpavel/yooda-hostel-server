const { ObjectId } = require('mongodb');
const mongoUtil = require('../Utility/mongoUtil');

const db = mongoUtil.getDb();

const distribution = db.collection('distribution');
const students = db.collection('students');

//moduleScaffolding
const mealDistribution = {};

//save mel distribution info
mealDistribution.foodDistributionForm = (req, res) => {
    const query = { s_id: req.body.s_id, date: req.body.date };

    distribution.findOne(query, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'there is an error to find'
            });
        }else{
            const fList = req.body.foodList.map(item => ObjectId(item));
            req.body.foodList = fList;
            if(data){
                const query = {_id: ObjectId(data._id)};
                const payload = {
                    $set: {
                        shift: {
                            ...data.shift,
                            ...req.body.shift
                        }
                    },
                    $push: {
                        foodList: { $each: fList },
                    }
                };
                distribution.updateOne(query, payload, (err, data) => {
                    if(err){
                        res.status(500).json({
                            error: 'data update failed'
                        });
                    }else{
                        const id = req.body.s_id;
                        const payload = {
                                $push: {
                                    "receive.shift": req.body.shift
                                }
                        };
                        students.updateOne({_id: ObjectId(id)}, payload, (err) => {
                            if(err){
                                res.status(500).json({
                                    error: 'data update failed'
                                });
                            }else{
                                res.status(200).json(data);
                            }
                        });
                    }
                })
            }else{
                distribution.insertOne(req.body, (err, data) => {
                    if(err){
                        res.status(500).json({
                            error: 'data update failed'
                        });
                    }else{
                        const id = req.body.s_id;
                        const payload = { $set: {
                            receive: {
                                date: req.body.date,
                                shift: [req.body.shift],
                            }
                        }};
                        students.updateOne({_id: ObjectId(id)}, payload, { upsert: true }, (err) => {
                            if(err){
                                res.status(500).json({
                                    error: 'data update failed'
                                });
                            }else{
                                res.status(200).json(data);
                            }
                        })
                    }
                })
            }
        }
    })
}

//get monthly bill
mealDistribution.getMemo = async(req, res) => {
    try {
        const id = req.params.id;
        const query = {s_id: id};
        const cursor = distribution.aggregate([
            { $match: query },
            {
                $lookup:
                   {
                     from: "meals",
                     localField: "foodList",
                     foreignField: "_id",
                     as: "foodList"
                   }
             }
        ]);

        const data = await cursor.toArray();
        res.send(data);
    } catch (error) {
        res.status(500).json({
            error: 'data update failed'
        });
    }
}

module.exports = mealDistribution;