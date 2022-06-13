const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif'] // types of file the server will accept


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
router.post('/', async (req, res) => { //upload is defined at the top using multer ('cover') comes from input name in ejs file
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        publishDate: new Date(req.body.publishDate), // req.body.publihDate returns a string hence need to swap to Date
        pageCount: req.body.pageCount,
        description: req.body.description
    })
    saveCover(book, req.body.cover) // note that coverImage is not saved in the model above as the coverImage is saved through this funtion 

    try {

        const newBook = await book.save()
        // res.redirect(`books/${newBook.id}`)
        res.redirect('books')
    } catch {
        // if (book.coverImageName != null) {
        //     removeBookCover(book.coverImageName)
        // }
        renderNewPage(res, book, true)
    }
})



// remove image if uploads incorrectly
// function removeBookCover(fileName) {
//     fs.unlink(path.join(uploadPath, fileName), err => { // path.join returns the path public/uploads/bookcover/1238281ih2u1i2hnd then fs.unlink will delete it
//         if (err) console.error(err)
//     })
// }

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

//save a cover to the database and not on server
function saveCover(book, coverEncoded) {
    if (coverEncoded == null) return
    const cover = JSON.parse(coverEncoded)
    if( cover != null && imageMimeTypes.includes(cover.type)) { //if cover is parsed correctly and is correct type the run function
        book.coverImage = new Buffer.from(cover.data, 'base64') //need to convert the cover.data into a buffer as per the requirements of the model buffer from based64 
        book.coverImageType= cover.type // save image type so that can extract buffer to image of correct type
    }
}


module.exports = router