"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const mockedTasks_1 = require("./mockedTasks");
const ManageTaskTestFile_1 = require("../../repository/in-memory/tasks/ManageTaskTestFile");
require('dotenv').config();
const e2eTestEnabled = ((process.env.ENABLE_E2E_TESTS || 'Y') === 'Y');
// Mock console.log and console.error globally for the entire test suite
// So we keep a clear console when tests should return error 
// global.console.log = jest.fn();
// global.console.error = jest.fn();
if (!e2eTestEnabled) {
    globals_1.describe.skip('End-to-End Tests', () => {
        globals_1.test.skip('All end-to-end tests are skipped because e2e tests are disabled.', () => { });
    });
}
else {
    (0, globals_1.describe)('#E2E tests for tasks.', () => {
        const manageTaskTestFile = new ManageTaskTestFile_1.ManageTaskTestFile();
        (0, globals_1.beforeAll)(() => {
            manageTaskTestFile.resetFile();
        });
        (0, globals_1.describe)('Test POST /task/add', () => {
            (0, globals_1.test)('It should respond with 200 success + Content-Type = json.', async () => {
                const taskData = {
                    userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
                    summary: 'E2E Test summary #1',
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/task/add')
                    .send(taskData)
                    .expect('Content-Type', /json/)
                    .expect(201);
                (0, globals_1.expect)(response.body).toMatchObject(taskData);
                (0, globals_1.expect)(response.body.summary).toBe('E2E Test summary #1');
            });
            (0, globals_1.test)('It should respond with 400 bad request + Content-Type = json for bad formatted userId.', async () => {
                const taskData = {
                    userId: '533b7681-b1c3-4244-8a37-',
                    summary: 'E2E Test summary #2 error',
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/task/add')
                    .send(taskData)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(response.body).toEqual({ error: 'invalid userId' });
            });
            (0, globals_1.test)('It should respond with 400 bad request + Content-Type = json for bad formatted summary.', async () => {
                const taskData = {
                    userId: '533b7681-b1c3-4244-8a37-423ae7a3d8ac',
                    summary: '',
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/task/add')
                    .send(taskData)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(response.body).toEqual({ error: 'invalid summary' });
            });
            (0, globals_1.test)('It should respond with 400 bad request + Content-Type = json for bad formatted task.', async () => {
                const taskData = {};
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/task/add')
                    .send(taskData)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(response.body).toEqual({ error: 'invalid userId' });
            });
        });
        (0, globals_1.describe)('Test GET /task/list', () => {
            (0, globals_1.test)('It should respond with 200 success + Content-Type = json containing a Task like object.', async () => {
                manageTaskTestFile.resetFile();
                const response = await (0, supertest_1.default)(app_1.default)
                    .get('/task/list')
                    .expect('Content-Type', /json/)
                    .expect(200);
                (0, globals_1.expect)(response.body).toEqual(mockedTasks_1.mockedTasks);
                (0, globals_1.expect)(response.body).toMatchObject(mockedTasks_1.mockedTasks);
                (0, globals_1.expect)(response.body).toBeInstanceOf(Array);
            });
        });
        (0, globals_1.describe)('Test GET /task/find/:id', () => {
            (0, globals_1.test)('It should respond with 200 success + Content-Type = json containing a Task like object.', async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get('/task/list')
                    .expect('Content-Type', /json/)
                    .expect(200);
                const testTask = Object.assign({}, response.body.slice(-1)[0]);
                const responseFind = await (0, supertest_1.default)(app_1.default)
                    .get('/task/find/' + testTask.id)
                    .expect('Content-Type', /json/)
                    .expect(200);
                (0, globals_1.expect)(responseFind.body).toEqual(mockedTasks_1.mockedTasks[1]);
                (0, globals_1.expect)(responseFind.body).toMatchObject(mockedTasks_1.mockedTasks[1]);
            });
            (0, globals_1.test)('It should respond with 404 not found when trying to find an id that does not exist.', async () => {
                const responseUpdate = await (0, supertest_1.default)(app_1.default)
                    .get('/task/find/this.id.should.not.exist')
                    .expect('Content-Type', /json/)
                    .expect(404);
                (0, globals_1.expect)(responseUpdate.body).toEqual({ error: 'task not found' });
            });
        });
        (0, globals_1.describe)('Test GET /task/update/:id', () => {
            (0, globals_1.test)('It should respond with 200 success + Content-Type = json with the updated task.', async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get('/task/list')
                    .expect('Content-Type', /json/)
                    .expect(200);
                const testTask = Object.assign({}, response.body.slice(-1)[0]);
                testTask.summary = 'Updating task summary with this info!';
                const responseUpdate = await (0, supertest_1.default)(app_1.default)
                    .put('/task/update/' + testTask.id)
                    .send(testTask)
                    .expect('Content-Type', /json/)
                    .expect(200);
                (0, globals_1.expect)(responseUpdate.body).toEqual(testTask);
            });
            (0, globals_1.test)('It should respond with 400 bad request when trying to update with a summary larger than 100 characters.', async () => {
                const repeatedSummary = 'A';
                const response = await (0, supertest_1.default)(app_1.default)
                    .get('/task/list')
                    .expect('Content-Type', /json/)
                    .expect(200);
                const testTask = Object.assign({}, response.body.slice(-1)[0]);
                testTask.summary = repeatedSummary.repeat(101);
                const responseUpdate = await (0, supertest_1.default)(app_1.default)
                    .put('/task/update/' + testTask.id)
                    .send(testTask)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(responseUpdate.body).toEqual({ error: 'invalid summary' });
            });
            (0, globals_1.test)('It should respond with 404 when trying to update with a id that does not exist.', async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get('/task/list')
                    .expect('Content-Type', /json/)
                    .expect(200);
                const testTask = Object.assign({}, response.body.slice(-1)[0]);
                testTask.id = 'this.id.should.not.exist';
                const responseUpdate = await (0, supertest_1.default)(app_1.default)
                    .put('/task/update/' + testTask.id)
                    .send(testTask)
                    .expect('Content-Type', /json/)
                    .expect(404);
                (0, globals_1.expect)(responseUpdate.body).toEqual({ error: 'task not found' });
            });
        });
        (0, globals_1.describe)('Test DELETE /task/delete/:id', () => {
            (0, globals_1.test)('It should respond with 200 success + Content-Type = json deleting a task.', async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get('/task/list')
                    .expect('Content-Type', /json/)
                    .expect(200);
                const taskToDelete = Object.assign({}, response.body.slice(-1)[0]);
                const responseDelete = await (0, supertest_1.default)(app_1.default)
                    .delete('/task/delete/' + taskToDelete.id)
                    .expect('Content-Type', /json/)
                    .expect(200);
                (0, globals_1.expect)(responseDelete.body).toEqual({ message: 'success' });
            });
            (0, globals_1.test)('It should respond with 404 + Content-Type = json when trying to delete a task that does not exist.', async () => {
                const response = await (0, supertest_1.default)(app_1.default)
                    .get('/task/list')
                    .expect('Content-Type', /json/)
                    .expect(200);
                const taskToDelete = Object.assign({}, response.body.slice(-1)[0]);
                taskToDelete.id = 'this.id.should.not.exist';
                const responseDelete = await (0, supertest_1.default)(app_1.default)
                    .delete('/task/delete/' + taskToDelete.id)
                    .expect('Content-Type', /json/)
                    .expect(404);
                (0, globals_1.expect)(responseDelete.body).toEqual({ message: 'task not found' });
            });
        });
    });
}
