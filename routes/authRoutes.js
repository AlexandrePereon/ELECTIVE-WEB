import express from 'express';
import authController from '../controllers/authController.js';

const authRouter = express.Router();

/**
 * @swagger
 * /api/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user by their username, email, and password. It checks if the username or email already exists to avoid duplicates. Upon successful registration, it returns the user's unique identifier.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: 'john'
 *               lastName:
 *                 type: string
 *                 example: 'Doe'
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'john.doe@example.com'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'SecurePassword123!'
 *     responses:
 *       200:
 *         description: Successfully registered the new user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the newly registered user.
 *                   example: '507f1f77bcf86cd799439011'
 *       400:
 *         description: Bad Request - Username or email already exists, or other validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Detailed error message.
 *                   example: 'Username or email already exists'
 *     security:
 *       - BearerAuth: []
 */
authRouter.post('/register', authController.register);

/**
 * @swagger
 * /api/login:
 *   post:
 *     summary: Login a user
 *     description: This endpoint authenticates a user by their email and password. It checks if the user exists and if the password is correct. Upon successful authentication, it returns a JWT token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: 'john.doe@example.com'
 *               password:
 *                 type: string
 *                 format: password
 *                 example: 'SecurePassword123!'
 *     responses:
 *       200:
 *         description: Successfully authenticated the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for the authenticated session.
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1MDdmMWY3N2JjZjg2Y2Q3OTk0MzkwMTEiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
 *       400:
 *         description: Bad Request - Username or password is incorrect
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating either the username or password is incorrect.
 *                   example: 'Username or password is incorrect'
 *     security:
 *       - BearerAuth: []
 */
authRouter.post('/login', authController.login);

export default authRouter;
