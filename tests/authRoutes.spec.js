import { expect } from 'chai';
import request from 'supertest';
import { before, describe, it } from 'mocha';
import app from '../server.js';
import User from '../models/userModel.js';

const userData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'SecurePassword123!',
};

describe('POST /api/register', () => {
  before((done) => {
    app.on('dbConnected', () => {
      User.destroy({ where: { email: userData.email } }).then(() => {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  it('should register a new user', async () => {
    const response = await request(app).post('/api/register').send(userData);

    expect(response.status).to.equal(200);
    console.log(response.body);
  });

  it('should return an error if the user already exists', async () => {
    const response = await request(app).post('/api/register').send(userData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
  });
});

describe('POST /api/login', () => {
  it('should log in an existing user and return the user token', async () => {
    const response = await request(app).post('/api/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });

  it('should return an error if the user does not exist', async () => {
    const response = await request(app).post('/api/login').send({
      email: 'error@email.com',
      password: 'errorPassword',
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
  });
});
