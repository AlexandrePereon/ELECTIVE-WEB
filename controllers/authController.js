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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT });
    return res.header('auth-token', token).json({ token });
  },
  verify: async (req, res) => {
    console.log('verify1');
    console.log('req: ', req);
    // check if the route is public
    const url = req.originalUrl;
    console.log('url: ', url);
    const publicRoutes = ['/auth/register', '/auth/login', '/restaurant/api-docs'];
    if (publicRoutes.includes(url)) {
      console.log('verify2');
      return res.status(200).send();
    }

    // check if token is provided
    const token = req.headers.authorization;
    console.log('token: ', token);
    if (!token) {
      console.log('verify3');
      return res.status(401).json({
        message: 'Access denied',
      });
    }

    try {
      console.log('verify4');
      // verify the token
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      // get the user
      const user = await User.findByPk(verified.id);

      // Set the useful information in the header
      const userHeader = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        partnerCode: user.partnerCode,
      };

      // Add user information to the header
      res.setHeader('X-User', JSON.stringify(userHeader));

      console.log('verify5');
      return res.status(200).json(verified);
    } catch (err) {
      console.log('verify6');
      return res.status(400).json({
        message: 'Invalid token',
      });
    }
  },
};

export default authController;
