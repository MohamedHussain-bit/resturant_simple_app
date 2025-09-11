const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')
const { decrypt } = require('dotenv')

const router = express.Router()

router.post('/register' , async (req , res) => {
    const {email , password} = req.body
    if(!email || !password){
        res.status(404).json({message : 'All fileds required'})
    }
    let user = await User.findOne({email})
    if(user){
        res.status(400).json({message : 'User already exists'})
    }
    const hashedPassword = await bcrypt.hash(password , 10)
    const newUser = new User({
        email ,
        password : hashedPassword,
    })

    await newUser.save()

    let token = jwt.sign({email , id : newUser._id} ,
         process.env.SECRET_KEY,
        {expiresIn : '1w'})
    return res.status(201).json({message : 'User registered successfully',
         token,
         user : newUser
        })    
})

router.post('/signin' , async (req , res) => {
    const {email , password} = req.body
    if(!email || !password){
        res.status(404).json({message : 'All fileds required'})
    }
    let user = await User.findOne({email})
    if(user && await bcrypt.compare(password , user.password)){
            let token = jwt.sign({email , id : user._id} ,
            process.env.SECRET_KEY,
            {expiresIn : '1w'})
        return res.status(201).json({message : 'User registered successfully',
            token,
            user
            })    
    }else{
        return res.status(400).json({message : 'Invalid email or password'})
    }
})

router.get('/:id' , async (req , res) => {
    const {id} = req.params
    const user = await User.findById(id)
    if(!user){
        res.status(404).json({message : 'User not found'})
    }
    res.status(200).json({user})
})

module.exports = router