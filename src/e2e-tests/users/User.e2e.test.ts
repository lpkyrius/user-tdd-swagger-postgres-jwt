import { expect, describe, test, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { User } from '../../entities/User';
import { ManageUserTestFile } from '../../repository/in-memory/users/ManageUserTestFile';
import { dbInit, dbClose } from './../../services/postgres/postgres';

require('dotenv').config();
const e2eTestEnabled: boolean = ((process.env.ENABLE_E2E_TESTS || 'Y') === 'Y')
let accessToken: string = '';

// Mock console.log and console.error globally for the entire test suite
// So we keep a clear console when tests should return error 
global.console.log = jest.fn();
global.console.error = jest.fn();

if (!e2eTestEnabled) {
    describe.skip('End-to-End Tests', () => {
      test.skip('All end-to-end tests are skipped because e2e tests are disabled.', () => {});
    });
  } else {
    describe('#E2E tests for users.', () => {
        const manageUserTestFile = new ManageUserTestFile();

        beforeAll(async () => {
            await dbInit();
            manageUserTestFile.resetFile();
        });

        afterAll(async () => {
            await dbClose();
        });

        describe('Test POST /user/add', () => {
            test('It should respond with 200 success + Content-Type = json.', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const userData: User = {
                    email: `success.test.tech.${ randomString }@email.com`,
                    password: `success.test.tech.${ randomString }@123`,
                    role: '2'
                };
                const response = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);

                  expect(response.body).toHaveProperty('id');
                  expect(response.body.email).toBe(userData.email);
              });

            test('It should respond with 400 bad request + Content-Type = json for bad formatted email.', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const userData: User = {
                    email: `fail.test.tech.${ randomString }email.com`,
                    password: `fail.test.tech.${ randomString }@123`,
                    role: '2'
                };
                const response = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(response.body).toEqual({ error: 'invalid email' });
            })

            test('It should respond with 400 bad request + Content-Type = json for bad formatted password.', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const userData: User = {
                    email: `fail.test.tech.${ randomString }@email.com`,
                    password: '',
                    role: '2'
                };
                const response = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(response.body).toEqual({ error: 'password should contain between 8 and 100 characters' });
            })

            test('It should respond with 400 bad request + Content-Type = json for a password larger than 100.', async () => {
                const repeatString: string = 'x'
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const userData: User = {
                    email: `fail.test.tech.${ randomString }@email.com`,
                    password: repeatString.repeat(101),
                    role: '2'
                };
                const response = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(response.body).toEqual({ error: 'password should contain between 8 and 100 characters' });
            })

            test('It should respond with 400 bad request + Content-Type = json for an existent email.', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const userData: User = {
                    email: `existent.email.tech.${ randomString }@email.com`,
                    password: `existent.email.tech.${ randomString }@123`,
                    role: '2'
                };
                const response = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);

                expect(response.body.email).toBe(userData.email);

                const responseError = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(responseError.body).toEqual({ error: 'email already exists' });
            })

            test('It should respond with 400 bad request + Content-Type = json for bad formatted role (!1 or !2).', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const userData: User = {
                    email: `bad.role.tech.${ randomString }@email.com`,
                    password: `bad.role.tech.${ randomString }@123`,
                    role: '3'
                };
                const response = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(response.body).toEqual({ error: 'invalid role' });
            })
            
            test('It should respond with 400 bad request + Content-Type = json for bad formatted user.', async () => {
                const userData = { };
                const response = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(response.body).toEqual({ error: 'invalid email' });
            })
        })

        describe('Test POST /user/login', () => {
            test('It should respond with 200 success + Content-Type = json.', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const userData: User = {
                    email: `success.test.tech.${ randomString }@email.com`,
                    password: `success.test.tech.${ randomString }@123`,
                    role: '2'
                };
                const responseAdd = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);

                const response = await request(app)
                    .post('/user/login')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(200);

                expect(response.body).toHaveProperty('accessToken');
                accessToken = response.body.accessToken;
            });

            test('It should respond with 400 Bad Request + Content-Type = json.', async () => {
                const userData = {
                    email: 'mary.tech@email.com',
                    password: 'mary.tech@xyz'
                };
                const response = await request(app)
                    .post('/user/login')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(response.body).toEqual({ error: 'invalid login' });
            });

            test('It should respond with 400 Bad Request + Content-Type = json.', async () => {
                const passwordMinSize = Number(process.env.PASSWORD_MIN_SIZE || 8);
                const passwordMaxSize = Number(process.env.PASSWORD_MAX_SIZE || 100);
                const userData = {
                    email: 'mary.tech@email.com',
                    password: ''
                };
                const response = await request(app)
                    .post('/user/login')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);

                expect(response.body).toEqual({ error: `password should contain between ${ passwordMinSize } and ${ passwordMaxSize } characters` });
            });
        })

        describe('Test GET /user/find/:id', () => {
            test('It should respond with 200 success + Content-Type = json containing a User like object.', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const userData: User = {
                    email: `user.to.find.tech.${ randomString }@email.com`,
                    password: `user.to.find.tech.${ randomString }@123`,
                    role: '2'
                };
                const response = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);

                const responseFind = await request(app)
                    .get('/user/find/'+ response.body.id)
                    .set('Authorization', 'bearer ' + accessToken)
                    .expect('Content-Type', /json/)
                    .expect(200);
                
                expect(responseFind.body.id).toEqual(response.body.id);
                expect(responseFind.body.email).toEqual(response.body.email);
              });
        
              test('It should respond with 404 not found when trying to find an id that does not exist.', async () => {
        
                const responseFind = await request(app)
                    .get('/user/find/this.id.should.not.exist')
                    .set('Authorization', 'bearer ' + accessToken)
                    // .expect('Content-Type', /json/)
                    .expect(404);
        
                    expect(responseFind.body).toEqual({ error: 'user not found' });
              });
        })

        describe('Test GET /user/update/:id', () => {
            test('It should respond with 200 success + Content-Type = json with the updated user.', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const userData: User = {
                    email: `to.update.tech.${ randomString }@email.com`,
                    password: `to.update.tech.${ randomString }@123`,
                    role: '2'
                };
                const response = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);
        
                const userToUpdate: User = response.body;
                userToUpdate.role = '1';
                const responseUpdate = await request(app)
                    .put('/user/update/'+ userToUpdate.id)
                    .set('Authorization', 'bearer ' + accessToken)
                    .send(userToUpdate)
                    .expect('Content-Type', /json/)
                    .expect(200);

            expect(responseUpdate.body.role).toEqual(userToUpdate.role);
            });
            
            test('It should respond with 400 bad request when trying to update with an invalid role.', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const userData: User = {
                    email: `fail.to.update.tech.${ randomString }@email.com`,
                    password: `fail.to.update.tech.${ randomString }@123`,
                    role: '2'
                };
                const response = await request(app)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);
        
                const userToUpdate: User = response.body;
                userToUpdate.role = '3';
                
                const responseUpdate = await request(app)
                    .put('/user/update/'+ userToUpdate.id)
                    .set('Authorization', 'bearer ' + accessToken)
                    .send(userToUpdate)
                    .expect('Content-Type', /json/)
                    .expect(400);
        
                expect(responseUpdate.body).toEqual({ error: 'invalid role' })
            });
            
            test('It should respond with 404 when trying to update with a id that does not exist.', async () => {
                const userData: User = {
                    id: 'this.id.does.not.exist',
                    email: 'to.not.update.test.tech@email.com',
                    password: 'to.not.update.test.tech@123',
                    role: '2'
                };
                
                const responseUpdate = await request(app)
                    .put('/user/update/'+ userData.id)
                    .set('Authorization', 'bearer ' + accessToken)
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(404);

                    expect(responseUpdate.body).toEqual({ error: 'user not found' })
              });

              test('It should respond with 404 when trying to update with no id informed.', async () => {
                const userData: User = {
                    id: 'this.id.does.not.exist',
                    email: 'to.not.update.test.tech@email.com',
                    password: 'to.not.update.test.tech@123',
                    role: '2'
                };
                
                const responseUpdate = await request(app)
                    .put('/user/update/')
                    .set('Authorization', 'bearer ' + accessToken)
                    .send(userData)
                    .expect(404);

                    expect(responseUpdate.body).toEqual({ });
              });

              test('It should respond with 403 when trying to update with invalid token.', async () => {
                const userData: User = {
                    id: 'this.id.does.not.exist',
                    email: 'to.not.update.test.tech@email.com',
                    password: 'to.not.update.test.tech@123',
                    role: '2'
                };
                
                const responseUpdate = await request(app)
                    .put('/user/update/' + userData.id)
                    .set('Authorization', 'bearer any.random.value')
                    .send(userData)
                    .expect(403);

                    expect(responseUpdate.body).toEqual({ });
              });

              test('It should respond with 401 when trying to update with no token.', async () => {
                const userData: User = {
                    id: 'this.id.does.not.exist',
                    email: 'to.not.update.test.tech@email.com',
                    password: 'to.not.update.test.tech@123',
                    role: '2'
                };
                
                const responseUpdate = await request(app)
                    .put('/user/update/' + userData.id)
                    .send(userData)
                    .expect(401);

                    expect(responseUpdate.body).toEqual({ });
              });
        })

    })
}