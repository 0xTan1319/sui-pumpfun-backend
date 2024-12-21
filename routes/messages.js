const express = require('express'),
	router = express.Router(),
	auth = require('../middleware/auth');

const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require("axios");

/* GET Product index */
router.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: "This is message page",
	})
});



module.exports = router;