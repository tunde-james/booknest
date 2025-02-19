import express from 'express';

import bookController from '../controllers/book-controller.js';

const router = express.Router();

router.post('/add-book', bookController.addBook);
router.get('/', bookController.getBooks);
router.get('/:id', bookController.bookDetails);
router.put('/:id', bookController.updateBook);
router.get('/search', bookController.searchBook);
router.delete('/:id', bookController.deleteBook);

export default router;
