const router = require('express').Router();
const User = require('../models/User')
const Post = require('../models/Post')
const StatusCodes = require('http-status-codes')

//UPDATE
router.put('/:id', async (req, res) => {

    if (req.body.userId === req.params.id) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body
            },{new:true})
            // {new: true} -> to return the updated one in the response

            res.status(StatusCodes.OK).json({updatedUser});
        } catch (error) {
            res.status(500).json(error)
        }
    }
    else {
        res.status(401).send('you can update only your account');
    }
})

//DELETE
router.delete('/:id', async (req, res) => {

    if (req.body.userId === req.params.id) {
        try {
            const user = await User.findById(req.params.id)

            try {
                await Post.deleteMany({ username: user.username });
                await User.findByIdAndDelete(req.params.id)
                res.status(200).json('User has been deleted successfully');
            } catch (error) {
                res.status(500).json(error)
            }
        } catch (error) {
            res.status(404).json('user not found')
        }
    }
    else {
        res.status(401).send('you can delete only your account');
    }
})

//GET USER
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password, ...others} = user._doc;
        res.status(200).json(others);
    } catch (error) {
        res.status(400).json('user not found');
    }
})



module.exports = router