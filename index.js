require('dotenv').config()
const express = require('express')
const morgan = require('morgan')

const route = require('./src/routes')
const connectDB = require('./src/configs/database')

// Connect to the database
connectDB()

const PORT = process.env.PORT || 3000

const app = express()

app.use(express.json())

app.use(morgan('short'))

// Routes initialization
route(app)

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`)
})
