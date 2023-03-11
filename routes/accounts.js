var express = require('express');
var router = express.Router();
const accountModel = require('../models/Account');

router.get('/', function(req, res) {
    accountModel.find((error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});

router.get('/:id', function(req, res) {
    const request = req.params;
    accountModel.findById(request.id, (error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});

router.post('/', function(req, res) {
    const request = req.body;
    accountModel.create(request, (error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});

router.delete('/:id', async(req, res) => {
    const request = req.params;
    accountModel.findByIdAndDelete(request.id, (error, data) => {
        if (error) {
            res.status(400).send(error);
        } else {
            res.status(200).send(data);
        }
    })
});

router.put('/:id', async(req, res) => {
    // const request = req.params;
    accountModel.findByIdAndUpdate(req.params.id, {
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