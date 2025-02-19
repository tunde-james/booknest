import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user.js';

const getCurrentUser = async (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decoded) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    const userDocument = await User.findById(decoded.id).select('-password');
    if (!userDocument) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json({ user: userDocument });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

const createUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      throw new Error('All fields are required.');
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    const usernameExist = await User.findOne({ username });
    if (usernameExist) {
      return res.status(400).json({ message: 'Username is taken.' });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const userDocument = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    if (userDocument) {
      const token = jwt.sign(
        { id: userDocument._id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        samesite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7days
      });
    }

    return res
      .status(201)
      .json({ user: userDocument, message: 'User created successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userDocument = await User.findOne({ email });
    if (!userDocument) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcryptjs.compareSync(
      password,
      userDocument.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    if (userDocument) {
      const token = jwt.sign(
        { id: userDocument._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '7d',
        }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        samesite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    return res.status(200).json({ message: 'Logged in successfully.' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Something went wrong.' });
  }
};

const LogoutUser = async (req, res) => {
  res.clearCookie('token');
  res.status(200).json({ message: 'Logged out successfully.' });
};

export default {
  getCurrentUser,
  createUser,
  LoginUser,
  LogoutUser,
};
