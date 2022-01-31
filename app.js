// load Express.js
const express = require('express')
const app = express()
const cors = require('cors')
// parse the request parameter
app.use(cors())
sapp.use(express.json())// connect to MongoDB

app.use(function (req, res, next) {
    console.log("Request IP: " + req.url); 
    console.log("Request date: " + newDate());
    next(); // this should stop the browser from hanging
});

    var path = require("path");
    var staticPath = path.resolve(__dirname, "public");
    app.use(express.static(staticPath));

    const MongoClient = require('mongodb').MongoClient;
    MongoClient.connect('mongodb+srv://JE451:Deacon34@cluster-lesson.8cspb.mongodb.net/', (err, client) => {
        db = client.db('app')
    })

    // get the collection name
    app.param('collectionName', (req, res, next, collectionName) => {
        req.collection = db.collection(collectionName)
        // console.log('collection name:', req.collection)
        return next()
    })

    // dispaly a message for root path to show that API is working
    app.get('/', function (req, res) { res.send('Select a collection, e.g., /collection/messages') })

    // retrieve all the objects from an collection
    app.get('/collection/:collectionName', (req, res) => {
        req.collection.find({}).toArray((e, results) => {
            if (e) return next(e)
            res.send(results)
        })
    })

    // retrieve an object by mongodb ID
    const ObjectID = require('mongodb').ObjectID; app.get('/collection/:collectionName/:id', (req, res, next) => {
        req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
            if (e) return next(e)
            res.send(result)
        })
    })

    // add an object
    app.post('/collection/:collectionName', (req, res, next) => {
        req.collection.insert(req.body, (e, results) => {
            if (e) return next(e)
            res.send(results.ops)
        })
    })

    // update an object by ID
    app.put('/collection/:collectionName/:id', (req, res, next) => {
        req.collection.update({ _id: new ObjectID(req.params.id) }, { $set: req.body }, { safe: true, multi: false }, (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
        })
    })

    // delete an object by ID
    app.delete('/collection/:collectionName/:id', (req, res, next) => {
        req.collection.deleteOne({ _id: ObjectID(req.params.id) }, (e, result) => {
            if (e) return next(e)
            res.send((result.result.n === 1) ? { msg: 'success' } : { msg: 'error' })
        })
    })

    const port = process.env.PORT || 3000
    app.listen(port)