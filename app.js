var express = require('express');
// const dotenv = require('dotenv');
// dotenv.config();
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var database = require('./configs/database');

global.__basedir = __dirname
    // MONGOSE //
mongoose.Promise = global.Promise
mongoose.set('strictQuery', false);
mongoose.connect(database.db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database is connected');
    console.log('Your server available at localhost:3000');
}), error => {
    console.log('Cannot connect to database ' + error)
};
// END MOONGOSE //

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var cors = require('cors');

var app = express()
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/account', require('./routes/accounts'));
app.use('/cluster', require('./routes/clusters'));
app.use('/task', require('./routes/tasks'));
app.use('/shop', require('./routes/shops'));
app.use('/authenticator', require('./routes/authenticator'));
// app.use('/users', usersRouter);

module.exports = app;