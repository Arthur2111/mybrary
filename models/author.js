//normally the model file is a singular of the routes javascript file it correlates to eg, author.js = authors.js

const mongoose = require('mongoose')

const authorSchema= new mongoose.Schema({   
    name: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('Author', authorSchema)