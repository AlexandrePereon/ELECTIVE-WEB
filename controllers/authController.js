import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import '../config/config.js';
import crypto from 'crypto';
import User from '../models/userModel.js';
import openRoutes from '../config/openRoutes.js';
// eslint-disable-next-line import/no-named-as-default, import/no-named-as-default-member
import restaurantClient from '../client/restaurantClient.js';
import logger from '../utils/logger/logger.js';

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
      restaurantId: null,
    });

    try {
      await user.save();
      logger.log('info', 'Utilisateur enregistré', { userID: user.id });
      return res.status(200).json({ id: user.id, message: 'Votre compte a été créé' });
    } catch (err) {
      return res.status(400).json({ message: err });
    }
  },
  // POST /auth/login
  login: async (req, res) => {
    logger.log('info', 'Demande de connexion', { userEmail: req.body.email });
    // check if username exists
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      return res.status(400).json({
        message: 'Email ou mot de passe incorrect',
      });
    }

    // check if user is blocked
    if (user.isBlocked) {
      return res.status(400).json({
        message: 'Votre compte a été bloqué',
      });
    }

    // check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        message: 'Email ou mot de passe incorrect',
      });
    }

    if (user.role === 'restaurant' && user.restaurant === null) {
      logger.log('info', 'Récupération restaurant', { userID: user.id });
      const restaurant = await restaurantClient.getRestaurantByCreatorId(user.id);
      user.restaurant = restaurant ? restaurant._id : null;
    }

    // create and assign a token with a timeout of 15 minutes
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_TIMEOUT });

    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    return res.header('auth-token', token).json({
      token,
      refreshToken,
      message: 'Authentification réussie',
      user: {
        id: user.id, firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role, partnerCode: user.partnerCode, restaurantId: user.restaurant,
      },
    });
  },
  verify: async (req, res) => {
    // get X-Forwarded-Uri and compare it with openRoutes
    const forwardedUri = req.headers['x-forwarded-uri'];
    const method = req.headers['x-forwarded-method'];

    console.log(req);

    logger.log('info', `URL demandée : ${forwardedUri}`);
    logger.log('info', `Verbe HTTP : ${method}`);
    logger.log('info', { header: req.headers });
    logger.log('info', `request : ${req}`);

    if (forwardedUri && openRoutes.some((route) => forwardedUri.startsWith(route.path) && method === route.method)) {
      logger.log('info', { openRoutes });
      return res.status(200).json({
        message: 'Accès autorisé',
      });
    }

    // check if token is provided
    const bearerToken = req.headers.authorization || req.headers['sec-websocket-protocol'];
    const token = bearerToken ? bearerToken.replace('Bearer ', '') : null;

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

      // check if user is blocked
      if (user.isBlocked) {
        return res.status(400).json({
          message: 'Votre compte a été bloqué',
        });
      }

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
      logger.log('info', 'Utilisateur vérifié', { userID: user.id });

      return res.status(200).json(verified);
    } catch (err) {
      return res.status(400).json({
        message: 'Token invalide',
      });
    }
  },
  refreshToken: async (req, res) => {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).send({ error: 'Un refresh token est requis.' });

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
      const user = await User.findOne({ where: { id: decoded.id, refreshToken } });

      if (!user) return res.status(401).send({ error: 'Le refresh token est invalide.' });
      if (user.isBlocked) return res.status(403).send({ error: 'Votre compte a été bloqué.' });

      const newToken = jwt.sign({ id: user.id.toString() }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT });
      return res.send({ token: newToken, message: 'Token rafraichi' });
    } catch (error) {
      return res.status(401).send({ error: 'Le refresh token est invalide.' });
    }
  },
};

export default authController;
