import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { MailService } from '../src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';

class FakeMailService {
  public sent: Array<{ to: string; code: string; expiresAt: Date }> = [];
  sendOtpEmail(params: { to: string; code: string; expiresAt: Date }) {
    this.sent.push(params);
  }
}

describe('Auth and Users e2e', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let mailer: FakeMailService;
  let jwtService: JwtService;
  const testEmail = `e2e+${Date.now()}@example.com`;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    process.env.MONGO_URI = uri;

    mailer = new FakeMailService();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(MailService)
      .useValue(mailer)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    jwtService = app.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  });

  it('POST /api/auth/signup -> sends OTP email', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({ email: testEmail, password: 'StrongPass1!' })
      .expect(201);
    expect(res.body).toHaveProperty('message');
    expect(mailer.sent.length).toBe(1);
    expect(mailer.sent[0].to).toBe(testEmail);
    expect(mailer.sent[0].code).toHaveLength(6);
  });

  it('POST /api/auth/verify-otp -> returns tokens', async () => {
    const otp = mailer.sent[0].code;
    const res = await request(app.getHttpServer())
      .post('/api/auth/verify-otp')
      .send({ email: testEmail, code: otp })
      .expect(200);
    expect(res.body).toHaveProperty('accessToken');
    expect(res.body).toHaveProperty('refreshToken');
  });

  it('POST /api/auth/verify-otp wrong code -> 404', async () => {
    await request(app.getHttpServer())
      .post('/api/auth/verify-otp')
      .send({ email: testEmail, code: '000000' })
      .expect(404);
  });

  it('POST /api/auth/login -> returns tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'StrongPass1!' })
      .expect(200);
    expect(res.body).toHaveProperty('accessToken');
  });

  it('GET /api/users/me without token -> 401', async () => {
    await request(app.getHttpServer()).get('/api/users/me').expect(401);
  });

  it('GET /api/users/me with token -> 200 and user payload', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'StrongPass1!' })
      .expect(200);
    const accessToken = login.body.accessToken as string;
    const res = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    expect(res.body).toHaveProperty('email', testEmail);
    expect(res.body).toHaveProperty('roles');
  });

  it('GET /api/users/admin with USER token -> 403', async () => {
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'StrongPass1!' })
      .expect(200);
    const accessToken = login.body.accessToken as string;
    await request(app.getHttpServer())
      .get('/api/users/admin')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(403);
  });

  it('GET /api/users/admin with ADMIN token -> 200', async () => {
    // Retrieve userId from /me
    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: testEmail, password: 'StrongPass1!' })
      .expect(200);
    const accessToken = login.body.accessToken as string;
    const me = await request(app.getHttpServer())
      .get('/api/users/me')
      .set('Authorization', `Bearer ${accessToken}`)
      .expect(200);
    const userId = me.body.userId as string;

    // Sign a token with ADMIN role to satisfy RolesGuard
    const adminToken = await jwtService.signAsync({
      sub: userId,
      email: testEmail,
      roles: ['ADMIN'],
    });

    await request(app.getHttpServer())
      .get('/api/users/admin')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);
  });
});
