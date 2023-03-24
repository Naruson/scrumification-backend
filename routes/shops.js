const express = require('express');
const router = express.Router();
const shopModel = require('../models/Shop');

const { MongoClient } = require("mongodb");
const DB_NAME = 'scrumification'; // New database name
const uri = `mongodb+srv://admin:root@cluster0.bjaozha.mongodb.net/${DB_NAME}`;
const client = new MongoClient(uri);
const dbCollection = client.db(DB_NAME).collection('shops');
const accountModel = require('../models/Account');
const ObjectId = require('mongodb').ObjectId;

router.get('/', function(req, res) {
    shopModel.find((error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send({
                "status": "ok",
                'message': 'get shops sucessfully',
                'shops': data
            });
        }
    })
});

router.get('/notification', async function(req, res) {
    try {
        // const client = new MongoClient(uri);
        const notifications = await client.db(DB_NAME).collection('notifications').find().toArray();
        // client.close();

        res.status(200).send({
            "status": "ok",
            "message": "Get notification successfully",
            "notification": notifications.reverse()
        });

    } catch (e) {
        res.status(400);
        return res.json({
            status: false,
            data: "error",
            errorDetail: error.toString(),
        });
    }
});

router.post('/buy/:id', async function(req, res) {
    try {

        // api buy shop
        //receive param:itemid
        //        body: clusterId,

        // const client = new MongoClient(uri);
        // await client.connect();
        var o_id = new ObjectId(req.params.id);
        var c_id = new ObjectId(req.body.clusterId);
        let shop = await dbCollection.findOne({ _id: o_id })

        await client.db(DB_NAME).collection('clusters').updateOne({
            _id: c_id
        }, { $inc: { "point": -shop.point } })

        let cluster = await client.db(DB_NAME).collection('clusters').findOne({ _id: c_id })

        await client.db(DB_NAME).collection('notifications').insertOne({
            cluster: cluster.name,
            item_name: shop.name,
            point: shop.point,
            date: new Date().toLocaleString('en-US', { timeZone: process.env.TIME_ZONE }),
        });

        // client.close();
        res.status(200).send({
            "status": "ok",
            "message": "Buy item successfully",
            "shop": null
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

router.get('/:id', function(req, res) {
    const request = req.params;
    shopModel.findById(request.id, (error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});

router.post('/', function(req, res) {
    const request = req.body;
    shopModel.create(request, (error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});

router.delete('/:id', async(req, res) => {
    const request = req.params;
    shopModel.findByIdAndDelete(request.id, (error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});

router.put('/:id', async(req, res) => {
    // const request = req.params;
    shopModel.findByIdAndUpdate(req.params.id, {
        $set: req.body
    }, (error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});

module.exports = router;