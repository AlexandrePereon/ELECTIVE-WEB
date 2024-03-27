import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import '../config/config.js';
import crypto from 'crypto';
import User from '../models/userModel.js';
import openRoutes from '../config/openRoutes.js';
import restaurantClient from '../client/restaurantClient.js';

const authController = {
  // POST /auth/register
  register: async (req, res) => {
    // check if username or email already exists
    const userExists = await User.findOne({
      where: { email: req.body.email },
    });

    if (userExists) {
      return res.status(400).json({
        message: 'Email déjà utilisé',
      });
    }

    // If a partner code is provided, find the partner
    const partner = req.body.partnerCode
      ? await User.findOne({ where: { partnerCode: req.body.partnerCode } })
      : null;

    // If a partner code is provided but no partner is found or the partner have another role, return an error
    if ((req.body.partnerCode && !partner) || (partner && partner.role !== req.body.role)) {
      return res.status(400).json({
        message: 'Code de parainnage invalide',
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
      return res.status(200).json({ id: user.id, message: 'Votre compte a été créé' });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },
  // POST /auth/login
  login: async (req, res) => {
    // check if username exists
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(400).json({
        message: 'Email ou mot de passe incorrect',
      });
    }

    // check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: 'Email ou mot de passe incorrect',
      });
    }

    let restaurantId = null;

    if (user.role === 'restaurant') {
      const restaurant = await restaurantClient.getRestaurantByCreatorId(user.id);
      restaurantId = restaurant ? restaurant._id : null;
    }

    user.lastLogin = new Date();
    await user.save();

    // create and assign a token with a timeout of 1 hour
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT });

    return res.header('auth-token', token).json({
      token,
      message: 'Authentification réussie',
      user: {
        id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, partnerCode: user.partnerCode, restaurantId,
      },
    });
  },
  verify: async (req, res) => {
    // get X-Forwarded-Uri and compare it with openRoutes
    const forwardedUri = req.headers['x-forwarded-uri'];
    const method = req.headers['x-forwarded-method'];

    console.log('url requetée : ', forwardedUri);
    console.log('verbe http : ', method);
    console.log('Header : ', req.headers);
    if (forwardedUri && openRoutes.some((route) => forwardedUri.startsWith(route.path) && method === route.method)) {
      console.log('route autorisée : ', openRoutes);
      return res.status(200).json({
        message: 'Accès autorisé',
      });
    }

    // check if token is provided
    const token = req.headers.authorization || req.headers['sec-websocket-protocol'];
    if (!token) {
      return res.status(401).json({
        message: 'Accès refusé',
      });
    }

    try {
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
        ...verified,
      };

      // Add user information to the header
      res.setHeader('X-User', JSON.stringify(userHeader));
      return res.status(200).json(verified);
    } catch (err) {
      return res.status(400).json({
        message: 'Token invalide',
      });
    }
  },
  refreshToken: async (req, res) => {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        message: 'Accès refusé',
      });
    }

    try {
      // verify the token
      const verified = jwt.verify(token, process.env.JWT_SECRET);

      // get the user
      const user = await User.findByPk(verified.id);

      // create and assign a token with a timeout of 1 hour
      const newToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT });
      return res.header('auth-token', newToken).json({ token: newToken, message: 'Token rafraichi' });
    } catch (err) {
      return res.status(400).json({
        message: 'Token invalide',
      });
    }
  },
};

export default authController;
