// load Express.js
const express = require('express')
const app = express()
const cors = require('cors')
const fs = require("fs");
const path = require("path");
// parse the request parameter
app.use(cors())
app.use(express.json())// connect to MongoDB

app.use(function (req, res, next) {
    console.log("Request IP: " + req.url);
    next(); // this should stop the browser from hanging
});

app.use(function (req, res, next) {
    // Uses path.join to find the path where the file should be
    var filePath = path.join(__dirname, "images", req.url);
    // Built-in fs.stat gets info about a file    
    fs.stat(filePath, function (err, fileInfo) {
        if (err) {
            next();
            return;
        }
        if (fileInfo.isFile()) res.sendFile(filePath);
        else next();
    });
});
const MongoClient = require('mongodb').MongoClient;
MongoClient.connect('mongodb+srv://JE451:Deacon34@cluster-lesson.8cspb.mongodb.net/', (err, client) => {
    db = client.db('app')
})

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

// dispaly a message for root path to show that API is working
app.get('/', function (req, res) {
    res.send('welcome to mongodb server' + ' and ' + 'Select a collection, e.g., /collection/database')
})

// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

// add an object
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e)
        res.send(results.ops)
    })
})

// retrieve an object by mongodb ID
const ObjectId = require('mongodb').ObjectId;
app.get('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.findOne({ _id: new ObjectId(req.params.id) }, (e, result) => {
        if (e) return next(e)
        res.send(result)
    })
})

// update an object by ID
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update({ _id: new ObjectId(req.params.id) },
        { $set: req.body }, { safe: true, multi: false }, (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ?
                { msg: 'success' } : { msg: 'error' })
        })
})

// delete an object by ID
app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne({ _id: ObjectId(req.params.id) }, (e, result) => {
        if (e) return next(e)
        res.send((result.result.n === 1) ?
            { msg: 'success' } : { msg: 'error' })
    })
})

const port = process.env.PORT || 3000
app.listen(port)
