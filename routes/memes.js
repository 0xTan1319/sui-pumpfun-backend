const express = require('express'),
	router = express.Router(),
	auth = require('../middleware/auth');

const multer = require('multer');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const axios = require("axios");

const Meme = require('../models/MemeSchema'),
	User = require('../models/UserSchema'),
	Message = require('./../models/ChatSchema'),
	config = require('../config');

const storage =  multer.diskStorage({
	destination: function (req, file, callback) {      
		if(!fs.existsSync(config.product_images)){
			fs.mkdirSync(config.product_images)
		}          
		callback(null, config.product_images);
	},
	filename: function (req, file, callback) {
		callback(null, Date.now() + "-" + file.originalname );
	}
});

const upload = multer({ storage : storage})

/* GET Meme index */
router.get('/', (req, res) => {
	res.status(200).json({
		success: true,
		message: "This is meme page",
	})
});

/* POST create new meme */
router.post('/create', auth.isAuthenticated, upload.single('file'), async(req, res) => {
	try{

		const { name } = req.body;
	
		let newProduct = new Meme();
	
		newProduct.name_id = uuidv4();
		newProduct.name_name = name;
		newProduct.created_at = new Date();
		
		newProduct.save(function (err, saved) {
				if (err) {
					console.log(err)
					return res.status(500).json({
						success: false, 
						message: "Something has gone wrong!",
						system_error: err
					})
				}
	
				res.status(200).json({
					success: true,
					message: "Successfully created",
					data: newProduct
				})
		})
	}catch(err){
		console.log("create_meme error:", err)
		res.status(500).json({
			success: false, 
			message: "Something has gone wrong",
			system_error: err
		})
	}
});

/* POST Meme create order the product */
router.put('/update', auth.isAuthenticated, upload.single('file'), (req, res) => {
	try{

		const { product_name, product_cost, product_desc, product_type, product_link, product_payment, product_qrcode, wallet, product_id,
			product_category, product_delivery, quantity, delivery_cost } = req.body;

		Product.findOne({
			product_id
		}, (error, product) => {
			if(error){
				console.log(err)
				return res.status(500).json({
					success: false, 
					message: "Something has gone wrong!",
					system_error: err
				})
			}
			if(product){
				product.product_name = product_name;
				product.product_cost = product_cost;
				product.product_desc = product_desc;
				product.product_type = product_type;
				product.product_link = product_link;
				product.product_payment = product_payment;
				product.product_qrcode = product_qrcode;
				product.product_category = product_category;
				product.product_delivery = product_delivery;
				product.quantity = quantity;
				product.delivery_cost = delivery_cost;					
				product.product_file = req.file.filename;
				product.wallet = req.file.wallet;
				product.save();
				res.status(200).json({
					success: true,
					message: "Successfully updated",
					data: product
				})
			}else{
				res.status(200).json({
					success: true,
					message: "No Product",
				})
			}
		})
	
	}catch(err){
		console.log("create_order error:", err)
		res.status(500).json({
			success: false, 
			message: "Something has gone wrong",
			system_error: err
		})
	}
});

/* POST Meme get all products */
router.post('/get_products', auth.isAuthenticated, (req, res) => {
	Meme.find({
		$or: [
			{ payment_status: 0 },
			{ payment_status: 1 }
		]
	}, (error, products) => {
		if (error) return res.status(500).json({
			success: false,
			message: "There is something wrong with the system. Please contact Administrator immediately",
			system_error: error
		});

		res.status(200).json({
			success: true,
			message: products,
		});
	})
});

module.exports = router;