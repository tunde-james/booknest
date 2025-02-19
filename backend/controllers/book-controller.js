import cloudinary from 'cloudinary';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';
import Book from '../models/book.js';

const getBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ createdAt: -1 });

    return res.status(200).json({ books });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Something went wrong.' });
  }
};

const addBook = async (req, res) => {
  const { image, title, subtitle, author, link, review } = req.body;

  const { token } = req.cookies;
  if (!token) {
    res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const imageResponse = await cloudinary.v2.uploader.upload(image, {
      folder: 'booknest',
    });

    console.log('Image Resposne: ', imageResponse);

    const userDocument = await User.findById(decoded.id).select('-password');

    const book = await Book.create({
      image: imageResponse.secure_url,
      title,
      subtitle,
      author,
      link,
      review,
      user: userDocument,
    });

    return res.status(201).json({ book, message: 'Book added successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const bookDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate('user', ['username']);

    return res.status(200).json({ book });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const updateBook = async (req, res) => {
  const { image, title, subtitle, author, link, review } = req.body;
  const { token } = req.cookies;

  const { id } = req.params;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const book = await Book.findById(id);

    if (image) {
      // Delete the prvious image first
      const imagePath = book.image.split('/');
      const fileName = imagePath[imagePath.length - 1];

      const imageId = fileName.split('.')[0];

      cloudinary.v2.uploader
        .destroy(`booknest/${imageId}`)
        .then((result) => console.log(result));

      // Upload new image
      const imageResponse = await cloudinary.v2.uploader.upload(image, {
        folder: '/booknest',
      });

      // Update book in db
      const updatedBook = await Book.findByIdAndUpdate(id, {
        image: imageResponse.secure_url,
        title,
        subtitle,
        author,
        link,
        review,
      });

      return res
        .status(200)
        .json({ book: updateBook, message: 'Book updated successfully' });
    }

    const updatedBook = await Book.findByIdAndUpdate(id, {
      title,
      subtitle,
      author,
      link,
      review,
    });

    return res
      .status(200)
      .json({ book: updateBook, message: 'Book updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const searchBook = async (req, res) => {
  try {
    const searchTerm = req.query.searchTerm || '';
    console.log('Search: ', searchTerm);
    const books = await Book.find({
      title: { $regex: searchTerm, $options: 'i' },
    }).sort({ createdAt: -1 });

    return res.status(200).json({ books });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const deleteBook = async (req, res) => {
  const { id } = req.params;
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const book = await Book.findById(id);

    // Delete the image first
    const imagePath = book.image.split('/');
    const fileName = imagePath[imagePath.length - 1];

    const imageId = fileName.split('.')[0];

    cloudinary.v2.uploader
      .destroy(`booknest/${imageId}`)
      .then((result) => console.log(result));

    // Delete the book from db
    await Book.findByIdAndDelete(id);

    return res.status(200).json({ message: 'Book deleted successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export default {
  getBooks,
  bookDetails,
  addBook,
  updateBook,
  deleteBook,
  searchBook,
};
