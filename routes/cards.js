var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/educards');

router.get('/', function(req, res) {
	var collection = db.get('cards');
	collection.find({}, function(err, cards) {
		if (err) throw err;
		res.json(cards);
	});
});

router.post('/', function(req, res) {
	var collection = db.get('cards');
	collection.insert({
		title: req.body.title,
		description: req.body.description,
		link: req.body.link,
		prior: req.body.prior,
		followup: req.body.followup
	}, function(err, card) {
		if (err) throw err;
		res.json(card);
	});
});

router.get('/byname/:name', function(req, res) {
	var collection = db.get('cards');
	collection.findOne({ title: req.params.name }, function(err, card) {
		if (err) throw err;

		res.json(card);
	});
});

router.get('/:id', function(req, res) {
	var collection = db.get('cards');
	collection.findOne({ _id: req.params.id }, function(err, card) {
		if (err) throw err;

		res.json(card);
	});
});

router.get('/edit/:id', function(req, res) {
	var collection = db.get('cards');
	collection.findOne({ _id: req.params.id }, function(err, card) {
		if (err) throw err;

		res.json(card);
	});
});

router.put('/edit/:id', function(req, res) {
	var collection = db.get('cards');
	collection.update({
		_id: req.params.id
	},
	{
		title: req.body.title,
		description: req.body.description,
		link: req.body.link,
		prior: req.body.prior,
		followup: req.body.followup
	}, function(err, card) {
		if (err) throw err;
		res.json(card);
	});
});

router.delete('/:id', function(req, res) {
	var collection = db.get('cards');
	collection.remove({ _id: req.params.id }, function(err, card) {
		if (err) throw err;
		res.json(card);
	});
});

module.exports = router;