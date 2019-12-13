const express = require("express");
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv/config');
app.use(express.json());
const cors = require('cors');

// connect to DB
mongoose.connect(
	process.env.DB_CONNECT,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	 () => {
		console.log('db connected')
});
// Middleware
app.use(cors())

// import Routes
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');

// Route MiddleWare
app.use('/api/user', authRoute);
app.use('/api/posts', postRoute);







app.listen(3000, () => console.log('Server Up and Running'));