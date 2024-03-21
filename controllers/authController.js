import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import '../config/config.js';
import crypto from 'crypto';
import User from '../models/userModel.js';

const authController = {
  // POST /auth/register
  register: async (req, res) => {
    // check if username or email already exists
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({
        message: 'Username or email already exists',
      });
    }

    // If a partner code is provided, find the partner
    const partner = req.body.partnerCode
      ? await User.findOne({ where: { partnerCode: req.body.partnerCode } })
      : null;

    // If a partner code is provided but no partner is found or the partner have another role, return an error
    if ((req.body.partnerCode && !partner) || (partner && partner.role !== req.body.role)) {
      return res.status(400).json({
        message: 'Invalid partner code',
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // generate partner code
    let partnerCode;
    do {
      partnerCode = crypto.randomBytes(5).toString('hex'); // generate a new 10-character code
      // eslint-disable-next-line no-await-in-loop
    } while (await User.findOne({ where: { partnerCode } }));

    // create new user
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      role: req.body.role,
      password: hashedPassword,
      partnerCode,
      partnerId: partner?.id,
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

    // create and assign a token with a timeout of 1 hour
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT });
    return res.header('auth-token', token).json({ token });
  },
  verify: async (req, res) => {
    const token = req.header('auth-token');
    if (!token) {
      return res.status(401).json({
        message: 'Access denied',
      });
    }

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      return res.status(200).json(verified);
    } catch (err) {
      return res.status(400).json({
        message: 'Invalid token',
      });
    }
  },
};

export default authController;
