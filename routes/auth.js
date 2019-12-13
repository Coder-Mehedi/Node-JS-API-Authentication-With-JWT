const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
	const { name, email, password } = req.body

	// lets validate the data
	const { error } = registerValidation(req.body)
	if(error) return res.status(400).send(error.details[0].message);

	// checking if the user already in the database
	const emailExit = await User.findOne({email});
	if(emailExit) return res.status(400).send('Email Already Exists');


	// Hash the Password
	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(password, salt);


	// Create a new user
    const user = new User({ name, email, password: hashPassword });

    try {
    	const savedUser = await user.save();
    	res.send(savedUser);
    }catch(err) {
    	res.status(400).send(err)
    }

})

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	// lets validate the data
	const { error } = loginValidation(req.body)
	if(error) return res.status(400).send(error.details[0].message);

	// checking if the user already in the database
	const user = await User.findOne({email});
	if(!user) return res.status(400).send('No User Found with this email');

	// check if password is correct
	const validPass = await bcrypt.compare(password, user.password);
	if(!validPass) return res.status(400).send('Invalid Password');

	// Create and assign a token
	const token = jwt.sign({ _id: user.id }, process.env.TOKEN_SECRET);
	res.header('auth-token', token)

	res.send(token);
})


module.exports = router;