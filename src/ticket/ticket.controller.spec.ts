/* eslint-disable prettier/prettier */
import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Connection, getConnection, getRepository } from 'typeorm';
import { AppModule } from '../app/app.module';
import mockData  from './test/Mockdata/ticketmockdata';
describe('Ticket', () => {
  let app: INestApplication;
  let connection: Connection;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile()
    app = moduleRef.createNestApplication();
    await app.init();
    connection = getConnection();
    await connection.synchronize(true);
   });
    afterAll(async () => {
    await connection.synchronize(true);
    await app.close();
  });

  it(`cant get page due to wrong Url`, async () => {
    const res = await request(app.getHttpServer()).get('/memes');
    return expect(res.status).toEqual(404);
  });

  it(`authorised user should see all ticket `, async () => {
    const res = await request(app.getHttpServer())
    .get('/ticket')
    .set('Authorization', 'Bearer' +mockData.token);
    return expect(res.status).toEqual(200);
  });

  it(`unauthorised user should not see all ticket `, async () => {
    const res = await request(app.getHttpServer()).get('/ticket');
    return expect(res.status).toEqual(401);
  });

});

