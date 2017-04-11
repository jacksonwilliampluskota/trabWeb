var Model = require('./model');

exports.auth = function (req, res) {
	console.log(req.body);
	console.log(req.body['authResponse[userID]']);

	Model.findOne({idFb: req.body['authResponse[userID]']})
	.exec(function(err, data) {
		if (!err && data) {
			console.log('login ja salvo');
			res.json({success: false})
		} else if(!err && !data) {
			var add = {};
			add.status = req.body.status;
			add.idFb = req.body['authResponse[userID]'];

			var form = new Model(add);

			form.save(function (err, data) {
				if (!err) {
					res.json({success: true});
				}
			});
		}
	});

};