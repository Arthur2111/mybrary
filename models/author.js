//normally the model file is a singular of the routes javascript file it correlates to eg, author.js = authors.js

const mongoose = require('mongoose')
const Book = require('./book') // '.' means from the current directory in this case models and  '..' means go out 1 directory


//create new schema
const authorSchema= new mongoose.Schema({   
    name: {
        type: String,
        required: true
    }
})


// we will run a function/method before we run the remove method
authorSchema.pre('remove', function(next) { //we dont use arrow function because we want to access the author model using this.
    Book.find({ author: this.id })
})

//create a model to wrap around the schema so that we can work on it
module.exports = mongoose.model('Author', authorSchema)