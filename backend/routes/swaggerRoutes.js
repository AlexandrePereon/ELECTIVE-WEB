import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import express from 'express';

const router = express.Router()
const serverUrl = process.env.API_HOST
const serverPort = process.env.API_PORT

// Swagger definition
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Express API with Swagger',
            version: '1.0.0',
            description: 'A sample API',
        },
        servers: [
            {
                url: `http://localhost:3000`,
            },
        ],
    },
    // Path to the API docs
    apis: ['./routes/*.js'],
}
const swaggerSpec = swaggerJsdoc(swaggerOptions)

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 *       description: Use a valid JWT token with the 'Bearer' prefix for authentication.
 */
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

export default (app) => {
    app.use("/api", router);
  };