//normally the model file is a singular of the routes javascript file it correlates to eg, author.js = authors.js

const mongoose = require('mongoose')
// path where you will be saving the cover images

const path = require('path')

const coverImageBasePath = 'uploads/bookCovers'


//create new schema
const bookSchema= new mongoose.Schema({   
    title: {
        type: String,
        required: true
    },
    descripction: {
        type: String,
    },
    publishDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },
    coverImageName: {
        type: String,
        required:true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, //references the mongoose author object model inside collection
        required:true,
        ref: 'Author' //reference model must be identical to model name referenced to ('author')
    },
})

//virtual allows to create a virtual property in a schema that derives value from its variables
bookSchema.virtual('coverImagePath').get(function() {
    if (this.coverImageName != null) {
        return path.join('/', coverImageBasePath, this.coverImageName) // returns public uploads bookcovers

    }
})

//create a model to wrap around the schema so that we can work on it
module.exports = mongoose.model('Book', bookSchema)
module.exports.coverImageBasePath= coverImageBasePath