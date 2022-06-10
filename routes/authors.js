const express = require('express')
const router = express.Router()
const Author = require('../models/author')

//To note Each endpoint already starts with /authors

//All Authors Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    //a get requests sends info through the query string(at the top of the website) 
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i') // 'i' is case insensitive, regexp allows is to search for part of the name instead of needing the full name

    }
    try {
        // apply a .find() method on the model Author  
        const authors = await Author.find(searchOptions)
        res.render('authors/index', { authors: authors, searchOptions: req.query })
    } catch {
        res.redirect('/')
    }

})

//New Author Route
// create a route to view the form to add a new Author then use the Post method within the form to post the data from the form to the end route in this case /authors and save it to the databasew
router.get('/new', (req, res) => {
    res.render('authors/new', { author: new Author() })
})

//Create New Author
router.post('/', async (req, res) => {
    const author = new Author({
        name: req.body.name
    })
    try {
        const newAuthor = await author.save()
        // res.redirect(`authors/${newAuthor.id}`)
        res.redirect('authors')
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'error creating author'
        })
    }
    //note you will need a middleware to receive form information to direct to the end route ( urlencoded or json)
})


module.exports = router