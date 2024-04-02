# Online Food Ordering Platform

This project is a Node.js application that provides a platform for online food ordering. It uses Express.js for the server, Sequelize for interacting with the database, and JWT for authentication.

## Getting Started

To get started with this project, clone the repository and install the dependencies.

```sh
git clone <repository-url>
cd <repository-directory>
npm install
```

## Running the Application

You can run the application using the following command:

```sh
npm start
```

For development, you can use:

```sh
npm run dev
```

## Testing

To run the tests, use the following command:

```sh
npm run test
```

## Application Structure

- `server.js`: The entry point to our application. This file defines our express server and connects it to MySQL database using Sequelize.
- `config/`: This folder contains configuration for the database and application settings.
- `routes/`: This folder contains the route definitions for our API.
- `controllers/`: This folder contains controllers for handling specific routes.
- `models/`: This folder contains Sequelize models for our application.
- `middlewares/`: This folder contains custom express middlewares for handling authentication and permissions.
- `client/`: This folder contains a client for interacting with the restaurant API.
- `db/`: This folder contains files for interacting with the database.
- `utils/`: This folder contains utility functions and classes used across the project.

## Docker

A Dockerfile is included for building a Docker image for the application. The `.dockerignore` file contains a list of files and directories that are not copied into the image.
