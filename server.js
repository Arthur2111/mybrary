if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const expressLayout = require('express-ejs-layouts')
const bodyParser= require('body-parser')
const methodOverride = require('method-override')



app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(methodOverride('_method'))
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({limit:'10mb',extended:false}))

const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

const indexRouter = require( './routes/index')
app.use('/', indexRouter)

const authorRouter = require( './routes/authors')
// In authors.js all routes begin with /authors
app.use('/authors', authorRouter)

const bookRouter = require( './routes/books')
app.use('/books', bookRouter)



app.listen(process.env.PORT || 3000)