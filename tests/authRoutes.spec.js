import { expect } from 'chai';
import request from 'supertest';
import { before, describe, it } from 'mocha';
import app from '../server.js';
import User from '../models/userModel.js';
import openRoutes from '../config/openRoutes.js';
import logger from '../utils/logger/logger.js';

// Make the logger silent
logger.level = 'silent';

const userData = {
  id: null,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  password: 'SecurePassword123!',
  role: 'user',
  token: null,
  refreshToken: null,
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

  it('should successfully register a new user', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send(userData);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Votre compte a été créé');
    expect(response.body).to.have.property('id');

    userData.id = response.body.id;
  });

  it('should return error for already used email', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: partnerData.firstName,
        lastName: partnerData.lastName,
        email: userData.email,
        password: partnerData.password,
        role: 'user',
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Email déjà utilisé');
  });

  it('should return error for invalid partner code', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: partnerData.firstName,
        lastName: partnerData.lastName,
        email: partnerData.email,
        password: partnerData.password,
        role: 'user',
        partnerCode: 'invalidCode',
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Code de parainnage invalide');
  });

  it('should return error when partner code belongs to user with different role', async () => {
    const user = await User.findOne({ where: { email: userData.email } });
    const response = await request(app)
      .post('/auth/register')
      .send({
        firstName: partnerData.firstName,
        lastName: partnerData.lastName,
        email: partnerData.email,
        password: partnerData.password,
        role: 'admin',
        partnerCode: user.partnerCode,
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Code de parainnage invalide');
  });
});

describe('POST /auth/login', () => {
  it('should return error for non-existent user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({
        email: 'wrong@email.com',
        password: 'wrongPassword',
      });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Email ou mot de passe incorrect');
  });

  it('should successfully log in user', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
    expect(response.body).to.have.property('refreshToken');
    expect(response.body.message).to.equal('Authentification réussie');
    expect(response.body.user).to.include({
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
    });

    userData.token = response.body.token;
    userData.refreshToken = response.body.refreshToken;
  });

  it('should return error for blocked user', async () => {
    const user = await User.findOne({ where: { email: userData.email } });
    await user.update({ isBlocked: true });
    const response = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: userData.password });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Votre compte a été bloqué');

    await user.update({ isBlocked: false });
  });

  it('should return error for incorrect password', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: userData.email, password: 'wrongPassword' });

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Email ou mot de passe incorrect');
  });
});

describe('GET /auth/verify', () => {
  it('should allow access for open routes', async () => {
    const openRouteExample = openRoutes[0]; // Assuming there's at least one open route for testing
    const response = await request(app)
      .get('/auth/verify')
      .set('x-forwarded-uri', openRouteExample.path)
      .set('x-forwarded-method', openRouteExample.method);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Accès autorisé');
  });

  it('should deny access when no token is provided', async () => {
    const response = await request(app).get('/auth/verify');
    expect(response.status).to.equal(401);
    expect(response.body.message).to.equal('Accès refusé');
  });

  it('should deny access with invalid token', async () => {
    const response = await request(app)
      .get('/auth/verify')
      .set('Authorization', 'Bearer invalidToken');

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Token invalide');
  });

  it('should deny access when user is blocked', async () => {
    const user = await User.findOne({ where: { email: userData.email } });
    await user.update({ isBlocked: true });

    const response = await request(app)
      .get('/auth/verify')
      .set('Authorization', `Bearer ${userData.token}`);

    expect(response.status).to.equal(400);
    expect(response.body.message).to.equal('Votre compte a été bloqué');

    await user.update({ isBlocked: false });
  });

  it('should verify the user token', async () => {
    const response = await request(app).get('/auth/verify').set('Authorization', `Bearer ${userData.token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id', userData.id);
    expect(response.body).to.have.property('exp');
    expect(response.body).to.have.property('iat');
  });

  it('should grant access with a valid token', async () => {
    const response = await request(app)
      .get('/auth/verify')
      .set('Authorization', `Bearer ${userData.token}`);

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('id', userData.id);
    expect(response.body).to.have.property('exp');
    expect(response.body).to.have.property('iat');
    expect(response.headers).to.have.property('x-user');
    const userHeader = JSON.parse(response.headers['x-user']);
    expect(userHeader).to.include({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
    });
  });
});

describe('POST /auth/refresh-token', () => {
  it('should deny access when no refresh token is provided', async () => {
    const response = await request(app)
      .post('/auth/refresh')
      .send({});

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Un refresh token est requis.');
  });

  it('should deny access with invalid refresh token', async () => {
    const response = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: 'invalidToken' });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Le refresh token est invalide.');
  });

  it('should deny access when user is blocked', async () => {
    const user = await User.findOne({ where: { email: userData.email } });
    await user.update({ isBlocked: true });
    const response = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: userData.refreshToken });

    expect(response.status).to.equal(401);
    expect(response.body.error).to.equal('Votre compte a été bloqué.');

    await user.update({ isBlocked: false });
  });

  it('should refresh token for a valid request', async () => {
    const response = await request(app)
      .post('/auth/refresh')
      .send({ refreshToken: userData.refreshToken });

    expect(response.status).to.equal(200);
    expect(response.body).to.have.property('token');
    expect(response.body.message).to.equal('Token rafraichi');
  });
});
