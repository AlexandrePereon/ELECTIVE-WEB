import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';

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
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    try {
      const savedUser = await user.save();
      return res.json({ id: savedUser._id });
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

    const tempToken = 'tempToken';

    // create and assign a token
    const token = jwt.sign({ _id: user._id }, tempToken);
    return res.header('auth-token', token).json({ token });
  },
};

export default authController;
