const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const dotenv = require('dotenv')
const productRouters = require('./api/routes/products')
const mongoose = require('mongoose')
dotenv.config()
const app = express()

app.use(morgan('dev'))
mongoose.connect(
    'mongodb+srv://haless132:' +
        process.env.MONGOOSE_ATLAS_PW +
        '@cluster0.sla4oco.mongodb.net/?retryWrites=true&w=majority',
    () => {
        console.log('connected mongoose', process.env.MONGOOSE_ATLAS_PW)
    }
)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATH, DELETE')
        return res.status(200).json({})
    }

    next()
})

app.use('/api/products', productRouters)

app.use((req, res, next) => {
    const error = new Error('Internal Server Error')
    error.status = 500
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status).json({
        error: {
            message: error.message,
        },
    })
})

module.exports = app

//computers-service
