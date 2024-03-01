import { expect, describe, test, beforeAll } from '@jest/globals';
import request from 'supertest';
import app from '../../app';
import { Task } from '../../entities/Task';
import { ManageTaskTestFile } from '../../repository/in-memory/tasks/ManageTaskTestFile';
import { dbInit, dbClose } from './../../services/postgres/postgres';
import { User } from '../../entities/User';

require('dotenv').config();
const e2eTestEnabled: boolean = ((process.env.ENABLE_E2E_TESTS || 'Y') === 'Y')
const randomLoggedString = (Math.floor((Math.random() * 1000000) + 1)).toString();
const loggedUserData: User = {
  email: `success.test.adm.${ randomLoggedString }@email.com`,
  password: `success.test.adm.${ randomLoggedString }@123`,
  role: '1',
}; 

const loginUser = async () => {
  const responseAdd = await request(app)
      .post('/user/add')
      .send(loggedUserData)
      .expect('Content-Type', /json/)
      .expect(201);

  const response = await request(app)
      .post('/user/login')
      .send(loggedUserData)
      .expect('Content-Type', /json/)
      .expect(200);

  return response.body.accessToken;
}
// Mock console.log and console.error globally for the entire test suite
// So we keep a clear console when tests should return error 
global.console.log = jest.fn();
global.console.error = jest.fn();

if (!e2eTestEnabled) {
  describe.skip('End-to-End Tests', () => {
    test.skip('All end-to-end tests are skipped because e2e tests are disabled.', () => {});
  });
} else {
  describe('#E2E tests for tasks.', () => {
    const manageTaskTestFile = new ManageTaskTestFile();

    beforeAll(async () => {
      await dbInit();
      loggedUserData.accessToken = await loginUser();
      manageTaskTestFile.resetFile();
    });

    afterAll(async () => {
        await dbClose();
    });

    describe('Test POST /task/add', () => {

      
      test('It should respond with 200 success + Content-Type = json.', async () => {
        const taskData = {
          userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
          summary: 'E2E Test summary #1',
        };
        
        const response = await request(app)
          .post('/task/add')
          .set('Authorization', 'bearer ' + loggedUserData.accessToken)
          .send(taskData)
          .expect('Content-Type', /json/)
          .expect(201);
            
          expect(response.body).toHaveProperty('id');
          expect(response.body.summary).toBe('E2E Test summary #1');
      });

      test('It should respond with 400 bad request + Content-Type = json for bad formatted userId.', async () => {
        const taskData = {
          userId: '533b7681-b1c3-4244-8a37-',
          summary: 'E2E Test summary #2 error',
        };
        
        const response = await request(app)
          .post('/task/add')
          .set('Authorization', 'bearer ' + loggedUserData.accessToken)
          .send(taskData)
          .expect('Content-Type', /json/)
          .expect(400);
              
          expect(response.body).toEqual({ error: 'invalid userId' });
      });

      test('It should respond with 400 bad request + Content-Type = json for bad formatted summary.', async () => {
        const taskData = {
          userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
          summary: '',
        };
        
        const response = await request(app)
          .post('/task/add')
          .set('Authorization', 'bearer ' + loggedUserData.accessToken)
          .send(taskData)
          .expect('Content-Type', /json/)
          .expect(400);
              
          expect(response.body).toEqual({ error: 'invalid summary' });
      });

      test('It should respond with 400 bad request + Content-Type = json for bad formatted task.', async () => {
        const taskData = {};
        
        const response = await request(app)
          .post('/task/add')
          .set('Authorization', 'bearer ' + loggedUserData.accessToken)
          .send(taskData)
          .expect('Content-Type', /json/)
          .expect(400);
              
          expect(response.body).toEqual({ error: 'invalid userId' });
      });

    });

    describe('Test GET /task/list', () => {
      test('It should respond with 200 success + Content-Type = json containing a Task like object.', async () => {
        let taskRawStructure = {
          id: expect.any(String),
          userId: expect.any(String),
          summary: expect.any(String),
          created_at: expect.any(String)
          // created_at: expect.any(Date)
        };
  
        const taskStructure = expect.arrayContaining([
          expect.objectContaining(taskRawStructure),
        ]);
        
        manageTaskTestFile.resetFile();
        
        const response = await request(app)
            .get('/task/list')
            .set('Authorization', 'bearer ' + loggedUserData.accessToken)
            .expect('Content-Type', /json/)
            .expect(200);
            
            expect(response.body).toEqual(taskStructure);
            expect(response.body).toMatchObject(taskStructure);
            expect(response.body).toBeInstanceOf(Array);
      });
    });

    describe('Test GET /task/find/:id', () => {
      test('It should respond with 200 success + Content-Type = json containing a Task like object.', async () => {
        const response = await request(app)
              .get('/task/list')
              .set('Authorization', 'bearer ' + loggedUserData.accessToken)
              .expect('Content-Type', /json/)
              .expect(200);

        const testTask: Task = Object.assign({}, response.body.slice(-1)[0]);
        
        const responseFind = await request(app)
            .get('/task/find/'+ testTask.id)
            .expect('Content-Type', /json/)
            .expect(200);
          
            expect(responseFind.body.id).toEqual(testTask.id);
            expect(responseFind.body.created_at).toEqual(testTask.created_at);
      });

      test('It should respond with 404 not found when trying to find an id that does not exist.', async () => {

        const responseUpdate = await request(app)
            .get('/task/find/this.id.should.not.exist')
            .expect('Content-Type', /json/)
            .expect(404);

            expect(responseUpdate.body).toEqual({ error: 'task not found' });
      });

    });

    describe('Test GET /task/update/:id', () => {
      test('It should respond with 200 success + Content-Type = json with the updated task.', async () => {
        const response = await request(app)
              .get('/task/list')
              .set('Authorization', 'bearer ' + loggedUserData.accessToken)
              .expect('Content-Type', /json/)
              .expect(200);

        const testTask: Task = Object.assign({}, response.body.slice(-1)[0]);
        testTask.summary = 'Updating task summary with this info!';

        const responseUpdate = await request(app)
            .put('/task/update/'+ testTask.id)
            .set('Authorization', 'bearer ' + loggedUserData.accessToken)
            .send(testTask)
            .expect('Content-Type', /json/)
            .expect(200);

          expect(responseUpdate.body.id).toEqual(testTask.id);
          expect(responseUpdate.body.summary).toEqual(testTask.summary);
      });

      test('It should respond with 400 bad request when trying to update with a summary larger than 500 characters.', async () => {
        const repeatedSummary = 'A';
        const response = await request(app)
              .get('/task/list')
              .set('Authorization', 'bearer ' + loggedUserData.accessToken)
              .expect('Content-Type', /json/)
              .expect(200);

        const testTask: Task = Object.assign({}, response.body.slice(-1)[0]);
        testTask.summary = repeatedSummary.repeat(501);

        const responseUpdate = await request(app)
            .put('/task/update/'+ testTask.id)
            .set('Authorization', 'bearer ' + loggedUserData.accessToken)
            .send(testTask)
            .expect('Content-Type', /json/)
            .expect(400);

            expect(responseUpdate.body).toEqual({ error: 'invalid summary' });
      });

      test('It should respond with 404 when trying to update with a id that does not exist.', async () => {
        const response = await request(app)
              .get('/task/list')
              .set('Authorization', 'bearer ' + loggedUserData.accessToken)
              .expect('Content-Type', /json/)
              .expect(200);
        
        const testTask: Task = Object.assign({}, response.body.slice(-1)[0]);
        testTask.id = 'this.id.should.not.exist';

        const responseUpdate = await request(app)

            .put('/task/update/'+ testTask.id)
            .set('Authorization', 'bearer ' + loggedUserData.accessToken)
            .send(testTask)
            .expect('Content-Type', /json/)
            .expect(404);

            expect(responseUpdate.body).toEqual({ error: 'task not found' });

      });
    });

    describe('Test DELETE /task/delete/:id', () => {
      test('It should respond with 200 success + Content-Type = json deleting a task.', async () => {
        const response = await request(app)
              .get('/task/list')
              .set('Authorization', 'bearer ' + loggedUserData.accessToken)
              .expect('Content-Type', /json/)
              .expect(200);

        const taskToDelete: Task = Object.assign({}, response.body.slice(-1)[0]);

        const responseDelete = await request(app)
            .delete('/task/delete/'+ taskToDelete.id)
            .expect('Content-Type', /json/)
            .expect(200);
            
            expect(responseDelete.body).toEqual({ message: 'success' });            
      });

      test('It should respond with 404 + Content-Type = json when trying to delete a task that does not exist.', async () => {
        const response = await request(app)
              .get('/task/list')
              .set('Authorization', 'bearer ' + loggedUserData.accessToken)
              .expect('Content-Type', /json/)
              .expect(200);

        const taskToDelete: Task = Object.assign({}, response.body.slice(-1)[0]);
        taskToDelete.id = 'this.id.should.not.exist';

        const responseDelete = await request(app)
            .delete('/task/delete/'+ taskToDelete.id)
            .expect('Content-Type', /json/)
            .expect(404);

          expect(responseDelete.body).toEqual({ message: 'task not found' });  
      });

    });

  });
}