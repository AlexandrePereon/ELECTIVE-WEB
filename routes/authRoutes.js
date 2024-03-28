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
 *                 message:
 *                   type: string
 *                   description: Confirmation message indicating the user has been successfully authenticated.
 *                   example: 'Authentification réussie'
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: The unique identifier of the authenticated user.
 *                       example: '1'
 *                     firstName:
 *                       type: string
 *                       example: 'john'
 *                     lastName:
 *                       type: string
 *                       example: 'Doe'
 *                     email:
 *                       type: string
 *                       example: 'john.doe@example.com'
 *                     role:
 *                       type: string
 *                       example: 'user'
 *                     partnerCode:
 *                       type: string
 *                       example: 'b51726297b'
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
 *   post:
 *     summary: Refresh a user's JWT token using a refresh token
 *     description: This endpoint refreshes a user's JWT token. It requires a refresh token to be provided in the request body. If the refresh token is valid and the user is not blocked, it generates a new JWT token with a specified expiry and returns it in the response body. If the refresh token is missing, invalid, or the user is blocked, it denies access with appropriate status codes and messages.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token that needs to be validated to issue a new JWT token.
 *     responses:
 *       200:
 *         description: A new JWT token is successfully created and returned.
 *         content:
 *           application/json:
 *             examples:
 *               success:
 *                 summary: Successful response example
 *                 value:
 *                   token: 'NewlyIssuedJwtTokenHere'
 *                   message: 'Token rafraichi'
 *       401:
 *         description: Unauthorized - Access denied due to missing or invalid refresh token.
 *         content:
 *           application/json:
 *             examples:
 *               missingToken:
 *                 summary: Missing refresh token
 *                 value:
 *                   error: 'Un refresh token est requis.'
 *               invalidToken:
 *                 summary: Invalid refresh token
 *                 value:
 *                   error: 'Le refresh token est invalide.'
 *       403:
 *         description: Forbidden - The user's account is blocked.
 *         content:
 *           application/json:
 *             examples:
 *               blockedAccount:
 *                 summary: User account is blocked
 *                 value:
 *                   error: 'Votre compte a été bloqué.'
 *     security:
 *       []
 */
authRouter.post('/refresh', authController.refreshToken);

export default authRouter;
