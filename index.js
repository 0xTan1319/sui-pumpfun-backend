#!/usr/bin/env node

const 
	http = require('http'),
	mongoose = require('mongoose'),
	config = require('./config');

const { server } = require('./services/socket.io');

const port = process.env.PORT || 7000;

mongoose.set('strictQuery', false);
mongoose.connect(config.mongoURI,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
	}
)
.then(() => {
	console.log("MongoDB is Connected");
})
.catch((error) => {
	console.log("MongoDB is not connected because of: " + error);
})

server.listen(port, ()=>{
	console.log('Listening on ' + port);
});