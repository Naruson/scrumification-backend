const express = require('express');
const { MongoClient } = require("mongodb");
const router = express.Router();
const DB_NAME = 'scrumification'; // New database name
const uri = `mongodb+srv://admin:root@cluster0.bjaozha.mongodb.net/${DB_NAME}`;
const client = new MongoClient(uri);
const dbCollection = client.db(DB_NAME).collection('tasks');
const ObjectId = require('mongodb').ObjectId;

// ====== for schema example ====== //
const accountModel = require('../models/Account');

router.get('/schema-example', function(req, res) {
    accountModel.find((error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});
// ======= end for schema example ==== //

router.get('/', async(req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        let tasks = await dbCollection.find().toArray();

        await client.close();
        res.status(200).send({
            "status": "ok",
            "message": "Get tasks successfully",
            "tasks": tasks
        });
    } catch (error) {
        res.status(400);
        return res.json({
            status: false,
            data: "error",
            errorDetail: error.toString(),
        });
    }
});

router.get('/:taskId', async(req, res) => {
    try {
        const client = new MongoClient(uri);
        await client.connect();
        const o_id = new ObjectId(req.params.taskId);
        let task = await dbCollection.findOne({ _id: o_id });
        await client.close();

        res.status(200).send({
            "status": "ok",
            "message": "Get task successfully",
            "task": task
        });
    } catch (error) {
        res.status(400);
        return res.json({
            status: false,
            data: "error",
            errorDetail: error.toString(),
        });
    }
});

router.post('/cluster', async(req, res) => {
    try {

        //receive
        // body: clusterId,taskId,point createdAt

        const client = new MongoClient(uri);
        await client.connect();
        const t_id = new ObjectId(req.body.taskId);
        const c_id = new ObjectId(req.body.clusterId);
        let task = await dbCollection.findOne({ _id: t_id });

        const [year, month, day] = req.body.createdAt.split("-");
        const formattedDate = `${day}/${month}/${year}`;


        const newTaskTransaction = {
            _id: new ObjectId(),
            task_id: t_id,
            name: task.name,
            point: req.body.point,
            created_at: formattedDate
        };

        let updateCluster = await client.db(DB_NAME).collection('clusters').updateOne({ _id: c_id }, { $push: { task_transactions: newTaskTransaction } });
        await client.close();

        res.status(200).send({
            "status": "ok",
            "message": "Check task successfully",
            "cluster": updateCluster,
        });
    } catch (error) {
        res.status(400);
        return res.json({
            status: false,
            data: "error",
            errorDetail: error.toString(),
        });
    }
});

module.exports = router;