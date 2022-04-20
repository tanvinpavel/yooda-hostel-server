const { ObjectId } = require('mongodb');
const mongoUtil = require('../Utility/mongoUtil');

const db = mongoUtil.getDb();

const distribution = db.collection('distribution');

//moduleScaffolding
const mealDistribution = {};

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