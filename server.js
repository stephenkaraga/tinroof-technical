const express = require('express');
const app = express();
const monk = require('monk');
const mongoskin = require('mongoskin');
const bodyParser = require('body-parser');
const path = require('path');
const db = mongoskin.db('mongodb://tinroof:tinroof1@ds141128.mlab.com:41128/tinroof-app', {safe:true});
const util = require('util');

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
	res.sendFile('public/index.html');
});
app.get('/todo', getAll);
app.put('/todo/:name', edit);
app.post('/todo', add);
app.delete('/todo/:name', deleteTodo);

function add(req, res) {
	console.log('testing');
	console.log(req.body);
    db.collection('todos').insert(req.body, function(err, result) {
	    if (err) {
	    	console.log(err);
	    } else {
	    	console.log('Successfully saved to the database.');
		    console.log(result);
		    console.log('Saved to database');
	    }
  	});
};

function getAll(req, res) {
	db.collection('todos').find().toArray(function(err, result) {
	    if (err) throw err;
	    res.json(result);
	});
};

function edit(req, res) {
    db.collection('todos')
	  .findOneAndUpdate({'name': req.params.name}, {
	    $set: {
	      name: req.body.name,
	      modified_at: req.body.modified_at
	    }
	  }, {
	    sort: {_id: -1},
	    upsert: true
	  }, (err, result) => {
	    if (err) return res.send(err)
	    res.send(result)
	  });
};

function deleteTodo(req, res) {
    db.collection('todos').remove({'name': req.params.name},
	  function(err, result) {
	    if (err) return res.send(500, err);
	    console.log(req.params.name + ' deleted.');
	    res.send('Deleted')
  	});
};
