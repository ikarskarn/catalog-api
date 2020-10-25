require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const {CLIENT_ORIGIN} = require('./config');
const helmet = require('helmet')
const { NODE_ENV } = require('./config');
const CategoriesRouter = require('./Categories/categories-router');
const LearningTracksRouter = require('./LearningTracks/learning-tracks-router');
const Courses = require('./Courses/courses-router');

const app = express()

const morganOption = (NODE_ENV === 'production')
	? 'tiny'
	: 'common';

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors({origin: CLIENT_ORIGIN}))

//routes
app.use('/api/categories', CategoriesRouter);
app.use('/api/learning-tracks', LearningTracksRouter);
app.use('/api/courses', Courses);

app.get('/', (req, res) => {
    res.send('Hello, world!');
})

app.use(function errorHandler(error, req, res, next) {
	let response
	if(NODE_ENV === 'production') {
		response = { error: { message: 'server error' } }
	} else {
		console.error(error)
		response = { message: error.message, error }
	}
	res.status(500).json(response)
})

module.exports = app