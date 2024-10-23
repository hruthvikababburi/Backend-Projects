require('dotenv').config() //loading .env file
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(cors())



const PORT = process.env.PORT || 3000


const transactionsRoutes = require('./routes/transactions')
const userRoutes = require('./routes/users')
app.use('./users',userRoutes)

app.use('/transactions',transactionsRoutes)

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})