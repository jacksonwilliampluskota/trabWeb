var Model = require('./model');

exports.pointer = function (req, res) {
	console.log(req.body);
	var form = {};
	form.pointer = parseInt(req.body.pointer);
	var model = new Model(form);
	model.save();

};

exports.bestPointer = function (req, res) {
	console.log(req.body);
	var form = {};
	Model.findOne({})
	.sort({pointer: -1})
	.exec(function (err, doc) {
		if (!err && doc) {
			res.json({pointer: doc.pointer});

		} else {

			res.json({pointer: 0});

		}
	});

};

