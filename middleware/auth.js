const jwt = require('jsonwebtoken'),
    config = require('../config');

module.exports = {
    isAuthenticated: function (req, res, next) {
        const token =
            req.body.token ||
            req.query.token ||
            req.headers['x-access-token'] ||
            req.headers.authorization ||
            req.cookies.token;
        if (!token) {
            res.status(401).send({success: false, message: 'Unauthorized: No token provided'});
        } else {
            const data = jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
                if (err) {                   
                    return {success:false}                    
                } else {
                    req.username = decoded.username;
                    req.email = decoded.email;
                    req.id = decoded.id;
                    return {success: true}
                }
            });
            if(data.success){
                next()
            }else{ 
                const decodedToken = jwt.decode(token);
                if(!decodedToken) return res.status(401).send({success: false, message: 'Invalide token'});
                const tk = jwt.sign({
                        id: decodedToken?.id,
                        email: decodedToken?.email,
                        username: decodedToken?.username,
                        points: decodedToken?.points,
                        stripe_account: decodedToken?.stripe_account
                    }, config.JWT_SECRET, { expiresIn: '1h' });	
                    
                res.status(401).send({success: true, message: 'Updated token', token:tk});
            }
        }
    }
};
