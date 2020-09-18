    // set up ========================
    var express  = require('express');
    var app      = express();                               // create our app w/ express
    var mongoose = require('mongoose');                     // mongoose for mongodb
    var morgan = require('morgan');             // log requests to the console (express4)
    var bodyParser = require('body-parser');    // pull information from HTML POST (express4)
    var methodOverride = require('method-override'); // simulate DELETE and PUT (express4)

    var arControlService = require('./ar-control-service');
    const Models = require('./models');
    const moment = require('moment');

    var localPath = '/public';
    // configuration =================

    // mongoose.connect('mongodb://node:nodeuser@mongo.onmodulus.net:27017/uwO3mypu');     // connect to mongoDB database on modulus.io

    app.use(express.static(__dirname + localPath));                // set the static files location /public/img will be /img for users
    app.use(morgan('dev'));                                         // log every request to the console
    app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
    app.use(bodyParser.json());                                     // parse application/json
    app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
    app.use(methodOverride());

    app.get('/', function (req, res) {
        res.sendfile(__dirname + localPath +'/index.html');
    });
    
    app.get('/slaves', function (req, res) {
        Models.models.slave.findAll().then(slaves=>{
            // const now = moment();
            // slaves.forEach(function(slave, index, slaves) {
            //     var lastPing = slaves[index].lastPingDate;
            //     slaves[index].diferenceLastPing = (now - lastPing);

            //     //console.log(slave);
            // });

            res.send(slaves);
        });
    });
    
    app.get('/slaves/:mac', function (req, res) {
        Models.models.slave.findOne({ where: {mac: req.params.mac}})
            .then(function(slave) {
               res.send(slave);
            });
    });
    
    app.put('/slaves/:mac', function (req, res) {
        res.send(Models.updateSlave(req.body, {mac: req.params.mac}));
    });

    app.delete('/slaves/:mac', function (req, res) {
        Models.models.slave.findOne({ where: {mac: req.params.mac}})
            .then(function(slave) {
                Models.models.slave.destroy({ where: {mac: slave.mac}});
                res.send();
            });
    });

    app.get('/slaves/:mac/ping', function (req, res) {
        Models.models.slave.findOne({ where: {mac: req.params.mac}})
            .then(function(slave) {
                arControlService.ping(slave.ip);
                res.send();
            });
    });

    app.get('/subnets', function (req, res) {
        Models.models.subnet.findAll().then(subnets=> {
            res.send(subnets);
        });
    });

    app.post('/subnets/', function (req, res) {
        Models.models.subnet.create({ name: req.body.name});
        res.send();
    });

    app.delete('/subnets/:name', function (req, res) {
        Models.models.subnet.findOne({ where: {name: req.params.name}})
            .then(function(subnet) {
                Models.models.subnet.destroy({ where: {name: subnet.name}});
                res.send();
            });
    });

    app.post('/subnets/check', function (req, res) {
        arControlService.pingNetwork(req.body.name);
        res.send();
    });


    app.listen(8080);
    console.log("App listening on port 8080");
