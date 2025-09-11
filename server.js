const express = require('express')
const mongoose = require('mongoose')
const connectDB = require('./configuration/connectBD')
require('dotenv').config()
const cors = require('cors')


const app = express()
const PORT = process.env.PORT || 3000

connectDB()

app.use(cors())

app.use(express.json())

app.use('/recipe' , require('./routes/recipe'))
app.use('/user' , require('./routes/user'))
app.use('/public' , express.static('public'))

mongoose.connection.once('open' , () => {
    console.log('Connected whith mongoDB')
    app.listen(PORT , () => {
    console.log(`Server is runing on port ${PORT}`)
})
})
mongoose.connection.on('error' , (err) => {
    console.log(err)
})