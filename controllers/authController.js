import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import User from '../models/userModel.js';

config();

const authController = {
  // POST /auth/register
  register: async (req, res) => {
    // check if username or email already exists
    const userExists = await User.findOne({
      $or: [
        { username: req.body.username },
        { email: req.body.email },
      ],
    });

    if (userExists) {
      return res.status(400).json({
        message: 'Username or email already exists',
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // create new user
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      await user.save();
      return res.status(200).json({ id: user.id });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },
  // POST /auth/login
  login: async (req, res) => {
    // check if username exists
    const user = await User.findOne({ mail: req.body.mail });

    if (!user) {
      return res.status(400).json({
        message: 'Username or password is incorrect',
      });
    }

    // check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: 'Username or password is incorrect',
      });
    }

    // update last login
    user.lastLogin = new Date();
    await user.save();

    // create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    return res.header('auth-token', token).json({ token });
  },
};

export default authController;
