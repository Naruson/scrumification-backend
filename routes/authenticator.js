const { MongoClient } = require("mongodb");
const DB_NAME = 'scrumification'; // New database name
const uri = `mongodb+srv://admin:root@cluster0.bjaozha.mongodb.net/${DB_NAME}`;
const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bodyParser = require("body-parser");
const app = express();
const client = new MongoClient(uri);
const dbCollection = client.db(DB_NAME).collection('accounts');
const jwt = require("jwt-simple");
const passport = require("passport");
const { default: cluster } = require("cluster");
const ExtractJwt = require("passport-jwt").ExtractJwt;
const JwtStrategy = require("passport-jwt").Strategy;
const SECRET = "MY_SECRET_KEY";
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader("authorization"),
    secretOrKey: SECRET
};

const jwtAuth = new JwtStrategy(jwtOptions, (payload, done) => {
    try {
        MongoClient.connect(uri, function(err, client) {
            if (err) throw err;
            dbCollection.findOne({
                'id': payload.sub.id,
            }, function(err, result) {
                if (err) throw err;
                if (result === null) {
                    done(null, false);
                } else {
                    done(null, true);
                }
                client.close();
            });
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
passport.use(jwtAuth);
const requireJWTAuth = passport.authenticate("jwt", { session: false });
router.get("/view", requireJWTAuth, (req, res) => {
    const token = req.headers.authorization;
    res.send(jwt.decode(token, SECRET));
});

const loginMiddleWare = (req, res, next) => {
    try {
        const bank = req.body;
        const password = bank.password;
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        MongoClient.connect(uri, function(err, client) {
            if (err) throw err;
            dbCollection.findOne({
                'username': bank.username,
                'password': hashedPassword
            }, function(err, result) {
                if (err) throw err;
                if (result === null) {
                    res.status(400).send('Wrong username or password');
                } else {
                    next();
                }
                client.close();
            });
        });
    } catch (error) {
        res.status(400);
        return res.json({
            status: false,
            data: "error",
            errorDetail: error.toString(),
        });
    }
};

router.post("/login", loginMiddleWare, async(req, res) => {
    try {
        const password = req.body.password;
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        const client = new MongoClient(uri);
        await client.connect();
        let account = await dbCollection.findOne({
            'username': req.body.username,
            'password': hashedPassword
        })

        const payload = {
            sub: null,
            iat: new Date().getTime()
        };
        res.send({
            'message': "login successfully",
            'access_token': jwt.encode(payload, SECRET),
            'account': account
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

router.post("/register", async(req, res) => {
    try {
        const password = req.body.password;
        const hash = crypto.createHash('sha256');
        hash.update(password);
        const hashedPassword = hash.digest('hex');

        const client = new MongoClient(uri);
        await client.connect();

        let cluster = await client.db(DB_NAME).collection('clusters').findOne({ name: req.body.cluster })

        let account = await dbCollection.insertOne({
            username: req.body.username,
            password: hashedPassword,
            role: req.body.role,
            cluster_id: cluster._id,
            cluster_name: cluster.name
        })



        client.close();
        res.send(account);
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