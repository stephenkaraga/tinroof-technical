const express = require('express');
const app = express();
const monk = require('monk');
const mongoskin = require('mongoskin');
const bodyParser = require('body-parser');
const path = require('path');
const db = mongoskin.db('mongodb://tinroof:tinroof1@ds141128.mlab.com:41128/tinroof-app', {safe:true});
db.createCollection('todos');

app.use(function(req, res, next) {
  req.db = {};
  req.db.todos = db.collection('todos');
  next();
});

app.use(express.static(__dirname + '/public'));

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'todo' database");
        db.collection('todos', {strict:true}, function(err, data) {
            if (err) {
                console.log(err);
            } else {
            	app.listen(3000);
            }
        });
    }
});

app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});
app.get('/todos', getAll);
app.put('/todos/:name', edit);
app.post('/todos/:name', add);
app.delete('/todos/:name', deleteTodo);

function add(req, res) {
    db.collection('todos').save(req.body, function(err, result) {
	    if (err) return console.log(err);
	    console.log('Saved to database');
  	});
}

function getAll(req, res) {
	db.collection('todos').find({}, {}, function(err, docs) {
		res.json({data:docs});
	});
};

function edit(req, res) {
    db.collection('todos')
	  .findOneAndUpdate({name: req.params.name}, {
	    $set: {
	      name: req.body.newName,
	    }
	  }, {
	    sort: {_id: -1},
	    upsert: true
	  }, (err, result) => {
	    if (err) return res.send(err)
	    res.send(result)
	  });
}

function deleteTodo(req, res) {
    db.collection('todos').findOneAndDelete({name: req.params.name},
	  function(err, result) {
	    if (err) return res.send(500, err)
	    res.send('Deleted')
  	});
}
