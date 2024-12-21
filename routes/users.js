const express = require('express'),
	router = express.Router(),
	jwt = require('jsonwebtoken'),
	jwtdecode = require('jwt-decode'),
	auth = require('../middleware/auth');

const User = require('../models/UserSchema'),
	config = require('../config');
const { getHash } = require('../utils/common');


/* POST User register */

router.post('/register', async(req, res) => {
	const { username, password, email, refer_id } = req.body;
	let newUser = new User();

	newUser.username = username;
	newUser.password = await getHash(password);
	newUser.email = email;

	newUser.save(function (err, saved) {
		if (err) {
			console.log(err)
			return res.status(200).json({
				success: false, 
				message: "Duplication username",
				system_error: err
			})
		}

		res.status(200).json({
			success: true,
			message: "Successfully registered",
		})

		/* save refer id*/
		User.findOne({
			_id: refer_id
		}, (error, user) => {

			if(error || !user) return;

			const temp = user?.refer
			let flag = true
			
			for(let i = 0; i < temp.length; i++){
				if(temp[i].id == refer_id){
					flag = false
					break;
				}
			}
			if(flag){
				user.refer.push({id: newUser._id.toString(), name: username, email: email})
				user.save()
			}				
		})
	})
});

/* POST User login */
router.post('/login', (req, res) => {
	
		User.findOne({
			email: req.body.email
		}, async (error, user) => {
			if (error) return res.status(200).json({
				success: false,
				message: "There is something wrong with the system. Please contact Administrator immediately",
				system_error: error
			});
	
			if (user) {
				user.comparePassword(req.body.password, async(err, isMatch) => {
					console.log(err, req.body.password, isMatch, "isMatch")
					if(error) {
						return res.status(500).json({
							success: false,
							message: "Error",
							system_error: error
						})
					}
	
					if (isMatch) {

						user.last_login = new Date();
						user.save();

						var token = jwt.sign({
							id: user._id,
							email: user.email,
							username: user.username,
						}, config.JWT_SECRET, { expiresIn: '100h' });
						res.header('Authorization', `Bearer ${token}`);
						res.cookie('token', token).status(200).json({
							success: true,
							message: "Successfully logined",
							token
						})

					} else {
						res.status(200).json({
							success: false,
							message: "Invalid Username/Password",
						})
					}
				});
			} else {
				res.status(200).json({
					success: false,
					message: "No user found",
				})
			}
	})
	
});

/* GET Current user profile */
router.get('/whoami', auth.isAuthenticated, (req, res) => {
	const token =
		req.body.token ||
		req.query.token ||
		req.headers['x-access-token'] ||
		req.headers.authorization ||
		req.cookies.token;

	if (token) {
		let data = jwtdecode(token);
		res.status(200).json({
			success: true,
			message: "Successfully get user name",
			result: data?.username
		});
	} else {
		res.status(401).json({
			success: false,
			message: "You are not logged in",
		})
	}
})

/* GET Logout */
router.get('/logout', auth.isAuthenticated, (req, res) => {
	if (token) {
		res.status(200).json({
			success: true,
			message: "Successfully logout",
		});
	} else {
		res.status(401).json({
			success: false,
			message: "Server Error",
		})
	}
})

/* POST forgot_password */
router.post('/forgot_password', (req, res) => {
	const { mail } = req.body;
	
	User.findOne({
		email: mail
	}, (error, user) => {
		if(error) {
			return res.status(500).json({
				success: false,
				message: "Server Error"
			})
		}
		if(user){
			/* email sending */
			return res.status(200).json({
				success: true,
				message: "Successfully sent",
			})
		}else {
			res.status(500).json({
				success: false,
				message: "Empty User"
			})
		}
	})	
});

/* POST get refer */
router.post('/get_refer', auth.isAuthenticated, (req, res) => {
	const {user_id} = req.body;
	
	User.findOne({
		_id: user_id
	}, (error, user) => {
		if(error) {
			res.status(500).json({
				success: false,
				message: "Server Error"
			})
		}
		if(user){
			/* email sending */
			res.status(200).json({
				success: true,
				data: user.refer,
				message: "Successfully got",
			})
		}else {
			res.status(500).json({
				success: false,
				message: "Empty User"
			})
		}
	})
});

/* POST update notification info */
router.put('/notifications',  auth.isAuthenticated, (req, res) => {
	const {email, app} = req.body;
	
	User.findOne({
		email: req?.email
	}, (error, user) => {
		if(!user){
			return res.status(500).json({
				success: false,
				message: "Server Error",
				system_error: error
			});
		}else{
			if(email){
				user.notification = {
					...user.notification,
					email: !user.notification.email
				}
			}else{
				user.notification = {
					...user.notification,
					app: !user.notification.app
				}
			}
			
			user.save();

			console.log(user)
			return res.status(200).json({
				success: true,
				user:user,
				message: "Successfully updated",
			});
		}
	})

});

/* POST update user info */
router.post('/:username',  auth.isAuthenticated, (req, res) => {
	res.status(200).json({
		success: true,
		data: req.params.username,
		message: "Successfully updated",
	});
});

/* GET get detail according to username */
router.get('/:username',  auth.isAuthenticated, (req, res) => {
	res.status(200).json({
		success: true,
		data: req.params.username,
		message: "Successfully updated",
	});
})

module.exports = router;