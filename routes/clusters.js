const express = require('express');
const { MongoClient } = require("mongodb");
const router = express.Router();
const DB_NAME = 'scrumification'; // New database name
const uri = `mongodb+srv://admin:root@cluster0.bjaozha.mongodb.net/${DB_NAME}`;
const client = new MongoClient(uri);
const dbCollection = client.db(DB_NAME).collection('clusters');
const accountModel = require('../models/Account');
const ObjectId = require('mongodb').ObjectId;



router.get('/schema-example', function(req, res) {
    accountModel.find((error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});

router.get('/raw-example', async(req, res) => {
    try {
        // const client = new MongoClient(uri);
        // await client.connect();
        let clusters = await dbCollection.findAll({})
            // client.close();

        res.status(200).send({
            "status": "ok",
            "message": "Get clusters successfully",
            "clusters": clusters
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


router.get('/task/:id', async(req, res) => {
    try {
        // const client = new MongoClient(uri);
        // await client.connect();
        var o_id = new ObjectId(req.params.id);
        let tasks = await dbCollection.findOne({ _id: o_id })
            // client.close();

        res.status(200).send({
            "status": "ok",
            "message": "Get cluster task successfully",
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

router.get('/', async(req, res) => {
    try {
        // const client = new MongoClient(uri);
        // await client.connect();
        let clusters = await dbCollection.find({}).toArray();
        // client.close();

        res.status(200).send({
            "status": "ok",
            "message": "Get clusters successfully",
            "clusters": clusters
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

router.get('/points', async(req, res) => {
    try {
        // const client = new MongoClient(uri);
        // let clusters = await dbCollection.find({}, { point: 1, _id: 0 }).toArray();

        let clusters = await dbCollection.find({}, {
            projection: { point: 1, name: 1 }
        }).toArray();

        // let clusters = await dbCollection.find({}, { point: 1, _id: 1 }).toArray();
        // client.close();

        res.status(200).send({
            "status": "ok",
            "message": "Get clusters successfully",
            "clusters": clusters
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

router.get('/:id', async(req, res) => {
    try {
        // const client = new MongoClient(uri);
        const o_id = new ObjectId(req.params.id);
        let cluster = await dbCollection.findOne({ _id: o_id });
        // client.close();

        res.status(200).send({
            "status": "ok",
            "message": "Get clusters successfully",
            "cluster": cluster
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