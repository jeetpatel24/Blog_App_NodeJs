const router = require('express').Router();
const User = require('../models/User')
const StatusCodes = require('http-status-codes')
const { UnauthenticatedError, BadRequestError } = require('../errors')

//REGISTER
router.post('/register', async (req, res) => {
    try {
        const user = await User.create({ ...req.body });
        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ error });
    }
})


//LOGIN
router.post('/login', async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password');
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new UnauthenticatedError('Email does not exist');
    }

    //compare password
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Password does not match')
    }

    // const token = user.createJWT();

    const { password: user_password, ...others } = user._doc;          //._doc has the doc which contains all the properties od USER model 
    //this is done to remove password from the result        

    res.status(StatusCodes.OK).json({ others });
})

module.exports = router