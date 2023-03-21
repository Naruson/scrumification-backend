const express = require('express');
const { MongoClient } = require("mongodb");
const router = express.Router();
const DB_NAME = 'scrumification'; // New database name
const uri = `mongodb+srv://admin:root@cluster0.bjaozha.mongodb.net/${DB_NAME}`;
const client = new MongoClient(uri);
const dbCollection = client.db(DB_NAME).collection('tasks');

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

module.exports = router;