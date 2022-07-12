const express = require('express')
const author = require('../models/author')
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
        const authors = await Author.find(searchOptions) //if find argument is empty it will indicate to show everything
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
    }) //this will return a promise
    try {
        const newAuthor = await author.save()
        res.redirect(`authors/${newAuthor.id}`)
    } catch {
        res.render('authors/new', {
            author: author,
            errorMessage: 'error creating author'
        })
    }
    //note you will need a middleware to receive form information to direct to the end route ( urlencoded or json)
})

//Auther details route
router.get('/:id', (req, res) => {
    res.send('Show Auther ' + req.params.id)
})

//Edit route
// instead of new author we need to get the author from the database hence we need an async funtion and a try catch statement
router.get('/:id/edit', async (req, res) => {
    try {
        //FindByID method is build into from mongoose library
        const author = await Author.findById(req.params.id)
        res.render('authors/edit', { author: author })
    } catch {
        res.redirect('/authors')
    }

})


//Note from browser you can only do get and post request hence need to install a library method override
//Edit/Update Author 
router.put('/:id', async (req, res) => {
    let author //define author outside try so that it is accessible to catch as well
    try {
        author = await Author.findById(req.params.id)
        author.name = req.body.name //this allows you to take the updated name from the form and change the name before saving it 
        await author.save() // we save to existing author as defined above with the id 
        res.redirect(`/authors/${author.id}`)
    } catch {
        if (author == null) { //if author == null then fail to find author
            res.redirect('/')
        } else {
            res.render('authors/edit', {
                author: author,
                errorMessage: 'error updating author'
            })
        }
    }
})


//Delete Author
router.delete('/:id', async (req, res) => {
    let author //define author outside try so that it is accessible to catch as well
    try {
        author = await Author.findById(req.params.id) //find the author 
        await author.remove() // we remove the author  
        res.redirect(`/authors`)
    } catch {
        if (author == null) { //if author == null then fail to find author
            res.redirect('/')
        } else {
            res.redirect(`/authors/${author.id}`)
        }
    }
})


module.exports = router