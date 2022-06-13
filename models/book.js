//normally the model file is a singular of the routes javascript file it correlates to eg, author.js = authors.js

const mongoose = require('mongoose')
// path where you will be saving the cover images

//create new schema
const bookSchema = new mongoose.Schema({
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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId, //references the mongoose author object model inside collection
        required: true,
        ref: 'Author' //reference model must be identical to model name referenced to ('author')
    },
})

//virtual allows to create a virtual property in a schema that derives value from its variables
bookSchema.virtual('coverImagePath').get(function () {
    //if coverimage and coverimagetype exists, return source of image object, take buffer data and use as source
    if (this.coverImage != null && this.coverImageType != null) {
        return `data:${this.coverImageType}; charset=utf-8;base64,${this.coverImage.toString('base64')}`

    }
})

//create a model to wrap around the schema so that we can work on it
module.exports = mongoose.model('Book', bookSchema)