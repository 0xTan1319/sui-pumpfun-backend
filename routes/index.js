var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
	res.status(200).json({
		version: '1.0',
		msg: "From PumpFun"
	});
});

module.exports = router;
