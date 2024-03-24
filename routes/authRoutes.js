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
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating the user has been successfully registered.
 *                   example: 'Votre compte a été créé'
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
 *   get:
 *     summary: Verify a user's token and return user information
 *     description: This endpoint verifies the validity of a user's JWT token and returns the decoded token information. If the request targets a public route, no token verification is performed, and the request is allowed. For protected routes, it requires a JWT token to be provided in the Authorization header. Upon successful verification, user details are returned in the response headers.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Request allowed. For protected routes, the token is successfully verified and user information is included in the response headers `X-User`.
 *         headers:
 *           X-User:
 *             description: JSON string containing user details (id, firstName, lastName, email, role, partnerCode). Only included for successful token verification on protected routes.
 *             schema:
 *               type: string
 *               example: '{"id":"123","firstName":"John","lastName":"Doe","email":"john.doe@example.com","role":"user","partnerCode":"ABC123"}'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 iat:
 *                   type: integer
 *                   description: Issued at timestamp
 *                 exp:
 *                   type: integer
 *                   description: Expiration time timestamp
 *       401:
 *         description: Unauthorized - No token provided or request to a protected route without a valid token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating access denied due to missing or invalid token.
 *                   example: 'Access denied'
 *       400:
 *         description: Bad Request - Token verification failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the token is invalid.
 *                   example: 'Invalid token'
 *     security:
 *       - BearerAuth: []
 */
authRouter.get('/verify', authController.verify);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh a user's JWT token
 *     description: This endpoint refreshes a user's JWT token by verifying the current token provided in the 'Authorization' header. If the token is valid, it generates a new JWT token with a 1-hour expiry and returns it in both the response body and the 'auth-token' header. If the token is missing or invalid, it denies access with appropriate status codes and messages.
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: A new JWT token is successfully created and returned.
 *         headers:
 *           auth-token:
 *             description: Newly issued JWT token for the user, valid for 1 hour.
 *             schema:
 *               type: string
 *               example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Newly issued JWT token for the user.
 *                   example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMyIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoxNTE2MjQyNjIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating the token has been refreshed.
 *                   example: 'Token rafraichi'
 *       401:
 *         description: Unauthorized - Access denied due to missing or no authorization token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating access is denied due to missing or no authorization token.
 *                   example: 'Accès refusé'
 *       400:
 *         description: Bad Request - Provided token is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message indicating the token is invalid.
 *                   example: 'Token invalide'
 *     security:
 *       - BearerAuth: []
 */
authRouter.get('/refresh', authController.refreshToken);

export default authRouter;
