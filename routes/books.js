const express = require('express')
const router = express.Router()
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const uploadPath = path.join('public', Book.coverImageBasePath)
const Author = require('../models/author')
const multer = require('multer')
const { query } = require('express')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'] // types of file the server will accept
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, imageMimeTypes.includes(file.mimetype))
    }
})

//To note Each endpoint already starts with /books
//All Books Route
router.get('/', async (req, res) => {
    let query = Book.find()
    if (req.query.title != null && req.query.title != "") {
        query= query.regex('title', new RegExp(req.query.title, 'i'))
    }
    if (req.query.publishedBefore != null && req.query.publishedBefore != "") {
        query= query.lte('publishDate', req.query.publishedBefore)
    }
    if (req.query.publishedAfter != null && req.query.publishedAfter != "") {
        query= query.gte('publishDate', req.query.publishedAfter)
    }
    
    try {
        const books = await query.exec()
        res.render('books/index', {
            books: books,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')

    }

})


//New Book Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
})

//Create New Book
router.post('/', upload.single('cover'), async (req, res) => { //upload is defined at the top using multer ('cover') comes from input name in ejs file
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), // req.body.publihDate returns a string hence need to swap to Date
        pageCount: req.body.pageCount,
        coverImageName: fileName,
        description: req.body.description
    })

    try {

        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch {
        if (book.coverImageName != null) {
            removeBookCover(book.coverImageName)
        }
        renderNewPage(res, book, true)
    }
})

function removeBookCover(fileName) {
    fs.unlink(path.join(uploadPath, fileName), err => {
        if (err) console.error(err)
    })
}

async function renderNewPage(res, book, hasError = false) {
    try {
        const authors = await Author.find({})
        const params = {
            authors: authors,
            book: book
        }
        if (hasError) params.errorMessage = 'Error Creating Book'
        res.render('books/new', params)
    } catch {
        res.redirect('/books')
    }
}



module.exports = router