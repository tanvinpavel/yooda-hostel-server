const { ObjectId } = require('mongodb');
const mongoUtil = require('../Utility/mongoUtil');

const db = mongoUtil.getDb();

const students = db.collection('students');
const distribution = db.collection('distribution');

//moduleScaffolding
const studentController = {};

//load all student data
studentController.loadAllStudentData = async (req, res) => { 
    try{
        const cursor = students.find({});
        const count =  await cursor.count();
        const page = req.query.page;
        const size = parseInt(req.query.size);
        let student;
        if(page){
            student = await cursor.skip(size * (page-1)).limit(size).toArray();
        }else{
            student = await cursor.toArray();
        }

        res.status(200).json({count, student});
    }catch(err){
        res.status(500).json({
            error: 'data fetch failed'
        });
    }
};

//load student data by roll
studentController.searchStudent = (req, res) => {
    const query = { roll: req.body.roll}
    students.findOne(query, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'data fetch failed'
            });
        }else{
            res.status(200).json(data);
        }
    })
}

//load student data by id
studentController.loadStudentDataById = (req, res) => {
    const query = { _id: ObjectId(req.params.id) };
    students.findOne(query, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'data fetch failed'
            });
        }else{
            res.status(200).json(data);
        }
    })
}

//add a new student
studentController.addNewStudent = async (req, res) => {
    try{
        await students.insertOne(req.body);

        res.status(200).json({
            message: 'data insert successfully'
        })
    }catch(e){
        res.status(500).json({
            error: 'data insert Failed'
        })
    }
}

studentController.updateStudentInfoByID = (req, res) => {
    const query = {_id: ObjectId(req.params.id)};
    const payload = {$set: req.body};

    students.updateOne(query, payload, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'data update failed'
            });
        }else{
            res.status(200).json(data);
        }
    })
}

//delete a single student
studentController.deleteStudentById = async (req, res) => {
    try{
        let query = {_id: ObjectId(req.params.id)};
        let result = await students.deleteOne(query);
        
        res.status(200).json(result);
        
    }catch{
        res.status(500).json({
            error: 'data delete Failed'
        })
    }
}

//update multiple status
studentController.updateMultipleStatusActive = (req, res) => {
    const {status} = req.body;
    // console.log(status)

    let objId = status. map(s => ObjectId(s));

    students.updateMany({_id: {$in: objId}}, {$set: {status: 'active'}}, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'data update failed'
            });
        }else{
            res.status(200).json(data);
        }
    })
}

studentController.updateMultipleStatusInActive = (req, res) => {
    const {status} = req.body;

    let objId = status.map(s => ObjectId(s));

    students.updateMany({_id: {$in: objId}}, {$set: {status: 'inActive'}}, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'data update failed'
            });
        }else{
            res.status(200).json(data);
        }
    })
}

studentController.foodDistributionForm = (req, res) => {
    const query = { s_id: req.body.s_id, date: req.body.date };
    // if => shift: {day: true}; then the value of => key = 'day';
    console.log(req.body);

    distribution.findOne(query, (err, data) => {
        if(err){
            res.status(500).json({
                error: 'there is an error to find'
            });
        }else{
            if(data){
                const query = {_id: ObjectId(data._id)}
                const payload = {
                    $set: {
                        shift: {
                            ...data.shift,
                            ...req.body.shift
                        }
                    },
                    $push: {
                        foodList: { $each: [...req.body.foodList] },
                    }
                };
                distribution.updateOne(query, payload, (err, data) => {
                    if(err){
                        console.log(err)
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
                                console.log(data);
                                res.status(200).json(data);
                            }
                        })
                        console.log(data)
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

module.exports = studentController;