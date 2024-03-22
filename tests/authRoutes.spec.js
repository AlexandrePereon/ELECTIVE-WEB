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
  role: 'user',
};

const partnerData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  password: 'SecurePassword123!',
  role: 'user',
};

describe('POST /auth/register', () => {
  before((done) => {
    app.on('dbReady', () => {
      User.destroy({ where: { email: [userData.email, partnerData.email] } }).then(() => {
        done();
      }).catch((err) => {
        done(err);
      });
    });
  });

  it('should register a new user', async () => {
    const response = await request(app).post('/auth/register').send(userData);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id');
  });

  it('should return an error if the user already exists', async () => {
    const response = await request(app).post('/auth/register').send(userData);

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
  });

  it('should return an error if the partner code is invalid', async () => {
    const response = await request(app).post('/auth/register').send({
      ...partnerData,
      partnerCode: 'invalidCode',
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
  });

  it('should register a new user with a partner code', async () => {
    const user = await User.findOne({ where: { email: userData.email } });

    const response = await request(app).post('/auth/register').send({
      ...partnerData,
      partnerCode: user.partnerCode,
    });

    expect(response.status).to.equal(200);
  });
});

describe('POST /auth/login', () => {
  it('should log in an existing user and return the user token', async () => {
    const response = await request(app).post('/auth/login').send({
      email: userData.email,
      password: userData.password,
    });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
  });

  it('should return an error if the user does not exist', async () => {
    const response = await request(app).post('/auth/login').send({
      email: 'error@email.com',
      password: 'errorPassword',
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('message');
  });
});
