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
    students.findOne({
        $or: [{name: req?.body?.name}, {roll: req?.body?.roll}]
    }, (err, data) => {
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

studentController.updateMultipleStatus = async (req, res) => {
    const { action, statusIDList} = req.body;
    let statusObjID = statusIDList.map(item => ObjectId(item));

    if(action === 'active'){
        try {
            let result =  await students.updateMany({_id: {$in: statusObjID}}, {$set: {status: 'active'}});
            res.send(result);
        } catch (error) {
            res.status(500).json({
                error: "Internal Server Error"
            })
        }
    }else if(action === 'inActive'){
        try {
            let result = await students.updateMany({_id: {$in: statusObjID}}, {$set: {status: 'inActive'}});
            res.send(result);
        } catch (error) {
            res.status(500).json({
                error: "Internal Server Error"
            })
        }
    }
}

studentController.deleteMultipleStudent = async (req, res) => {
    try {
        const {statusIDList} = req.body;
        const query = statusIDList.map(i => ObjectId(i));
        const result = await students.deleteMany({_id: {$in: query}});
        
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({
            error: 'data delete Failed'
        })
    }
}

module.exports = studentController;