//normally the model file is a singular of the routes javascript file it correlates to eg, author.js = authors.js

const mongoose = require('mongoose')


//create new schema
const authorSchema= new mongoose.Schema({   
    name: {
        type: String,
        required: true
    }
})


//create a model to wrap around the schema so that we can work on it
module.exports = mongoose.model('Author', authorSchema)