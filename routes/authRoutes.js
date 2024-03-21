import express from 'express';
import authController from '../controllers/authController.js';

const authRouter = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     description: This endpoint registers a new user by their firstName, lastName, email, and password. It checks if the email already exists to avoid duplicates. Upon successful registration, it returns the user's unique identifier.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
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
 *               role:
 *                 type: string
 *                 example: 'user'
 *               partnerCode:
 *                 type: string
 *                 example: ''
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
 *                   example: '1'
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
 */
authRouter.post('/register', authController.register);

/**
 * @swagger
 * /auth/login:
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
 */
authRouter.post('/login', authController.login);

/**
 * @swagger
 * /auth/verify:
 *   post:
 *     summary: Verify a user token
 *     description: This endpoint verifies a user token by checking if it is valid and not expired. It returns the decoded token if it is valid.
 */
authRouter.post('/verify', authController.verify);

export default authRouter;
