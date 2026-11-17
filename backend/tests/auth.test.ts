import request from 'supertest';
import app from '../src/app';

describe('Authentication API Suite', () => {
  const testUser = {
    name: 'Alex Johnson',
    email: 'alex@taskflow.dev',
    password: 'Password123!',
  };

  describe('POST /api/v1/auth/register', () => {
    it('should register a new user successfully and return cookie', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.name).toBe(testUser.name);
      expect(response.body.data.user.password).toBeUndefined();
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject registration when email already exists', async () => {
      await request(app).post('/api/v1/auth/register').send(testUser);

      const duplicateResponse = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      expect(duplicateResponse.status).toBe(409);
      expect(duplicateResponse.body.success).toBe(false);
      expect(duplicateResponse.body.message).toContain('already exists');
    });

    it('should validate invalid registration fields', async () => {
      const response = await request(app).post('/api/v1/auth/register').send({
        name: 'A',
        email: 'invalid-email',
        password: '123',
      });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.errors).toBeDefined();
    });
  });

  describe('POST /api/v1/auth/login', () => {
    beforeEach(async () => {
      await request(app).post('/api/v1/auth/register').send(testUser);
    });

    it('should log in successfully with valid credentials', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.headers['set-cookie']).toBeDefined();
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: testUser.email,
        password: 'WrongPassword!',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should reject login for non-existent email', async () => {
      const response = await request(app).post('/api/v1/auth/login').send({
        email: 'nobody@taskflow.dev',
        password: 'Password123!',
      });

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/v1/auth/me', () => {
    it('should reject unauthorized requests without token', async () => {
      const response = await request(app).get('/api/v1/auth/me');

      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
    });

    it('should return profile for authenticated user via cookie or Bearer token', async () => {
      const registerRes = await request(app)
        .post('/api/v1/auth/register')
        .send(testUser);

      const cookie = registerRes.headers['set-cookie'];
      const token = registerRes.body.data.token;

      // Via cookie
      const cookieRes = await request(app)
        .get('/api/v1/auth/me')
        .set('Cookie', cookie);

      expect(cookieRes.status).toBe(200);
      expect(cookieRes.body.data.user.email).toBe(testUser.email);

      // Via Bearer header
      const bearerRes = await request(app)
        .get('/api/v1/auth/me')
        .set('Authorization', `Bearer ${token}`);

      expect(bearerRes.status).toBe(200);
      expect(bearerRes.body.data.user.name).toBe(testUser.name);
    });
  });

  describe('POST /api/v1/auth/logout', () => {
    it('should clear authentication cookie on logout', async () => {
      const response = await request(app).post('/api/v1/auth/logout');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.headers['set-cookie']).toBeDefined();
    });
  });
});
