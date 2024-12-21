const express = require('express'),
    cookieParser = require('cookie-parser'),
    logger = require('morgan'),
    helmet = require('helmet'),
    cors = require('cors');

const indexRouter = require('../routes/index'),
    usersRouter = require('../routes/users'),
    memesRouter = require('../routes/memes'),
    messagesRouter = require('../routes/messages'),
    config = require("../config");

const app = express();

app.use(helmet());
app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("build"));

app.use('/', indexRouter);
app.use('/api/auth', usersRouter);
app.use('/api/meme', memesRouter);
app.use('/api/chat', messagesRouter);

require('../services/cron')

module.exports = app;
