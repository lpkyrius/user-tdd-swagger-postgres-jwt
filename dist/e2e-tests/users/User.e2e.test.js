"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../app"));
const ManageUserTestFile_1 = require("../../repository/in-memory/users/ManageUserTestFile");
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
    (0, globals_1.describe)('#E2E tests for users.', () => {
        const manageUserTestFile = new ManageUserTestFile_1.ManageUserTestFile();
        (0, globals_1.beforeAll)(() => {
            manageUserTestFile.resetFile();
        });
        (0, globals_1.describe)('Test POST /user/add', () => {
            (0, globals_1.test)('It should respond with 200 success + Content-Type = json.', async () => {
                const userData = {
                    email: 'success.test.tech@email.com',
                    password: 'success.test.tech@123',
                    role: '2'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);
                (0, globals_1.expect)(response.body).toHaveProperty('id');
                (0, globals_1.expect)(response.body.email).toBe('success.test.tech@email.com');
            });
            (0, globals_1.test)('It should respond with 400 bad request + Content-Type = json for bad formatted email.', async () => {
                const userData = {
                    email: 'test.techemail.com',
                    password: 'test.tech@123',
                    role: '2'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(response.body).toEqual({ error: 'invalid email' });
            });
            (0, globals_1.test)('It should respond with 400 bad request + Content-Type = json for bad formatted password.', async () => {
                const userData = {
                    email: 'test.tech@email.com',
                    password: '',
                    role: '2'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(response.body).toEqual({ error: 'password should contain between 8 and 100 characters' });
            });
            (0, globals_1.test)('It should respond with 400 bad request + Content-Type = json for a password larger than 100.', async () => {
                const repeatString = 'x';
                const userData = {
                    email: 'test.tech@email.com',
                    password: repeatString.repeat(101),
                    role: '2'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(response.body).toEqual({ error: 'password should contain between 8 and 100 characters' });
            });
            (0, globals_1.test)('It should respond with 400 bad request + Content-Type = json for an existent email.', async () => {
                const userData = {
                    email: 'existent@email.com',
                    password: 'existent@123',
                    role: '2'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);
                (0, globals_1.expect)(response.body.email).toBe('existent@email.com');
                const responseError = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(responseError.body).toEqual({ error: 'email already exists' });
            });
            (0, globals_1.test)('It should respond with 400 bad request + Content-Type = json for bad formatted role (!1 or !2).', async () => {
                const userData = {
                    email: 'bad.role@email.com',
                    password: 'bad.role@123',
                    role: '3'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(response.body).toEqual({ error: 'invalid role' });
            });
            (0, globals_1.test)('It should respond with 400 bad request + Content-Type = json for bad formatted user.', async () => {
                const userData = {};
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(response.body).toEqual({ error: 'invalid email' });
            });
        });
        (0, globals_1.describe)('Test POST /user/login', () => {
            (0, globals_1.test)('It should respond with 200 success + Content-Type = json.', async () => {
                const userData = {
                    email: 'mary.tech@email.com',
                    password: 'mary.tech@123'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/login')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(200);
                (0, globals_1.expect)(response.body).toEqual({ message: 'success' });
            });
        });
        (0, globals_1.describe)('Test GET /user/find/:id', () => {
            (0, globals_1.test)('It should respond with 200 success + Content-Type = json containing a User like object.', async () => {
                const userData = {
                    email: 'to.find.test.tech@email.com',
                    password: 'to.find.test.tech@123',
                    role: '2'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);
                const responseFind = await (0, supertest_1.default)(app_1.default)
                    .get('/user/find/' + response.body.id)
                    .expect('Content-Type', /json/)
                    .expect(200);
                (0, globals_1.expect)(responseFind.body).toEqual(response.body);
            });
            (0, globals_1.test)('It should respond with 404 not found when trying to find an id that does not exist.', async () => {
                const responseUpdate = await (0, supertest_1.default)(app_1.default)
                    .get('/user/find/this.id.should.not.exist')
                    .expect('Content-Type', /json/)
                    .expect(404);
                (0, globals_1.expect)(responseUpdate.body).toEqual({ error: 'user not found' });
            });
        });
        (0, globals_1.describe)('Test GET /user/update/:id', () => {
            (0, globals_1.test)('It should respond with 200 success + Content-Type = json with the updated user.', async () => {
                const userData = {
                    email: 'to.update.test.tech@email.com',
                    password: 'to.update.test.tech@123',
                    role: '2'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);
                const userToUpdate = response.body;
                userToUpdate.email = 'updated.test.tech@email.com';
                const responseUpdate = await (0, supertest_1.default)(app_1.default)
                    .put('/user/update/' + userToUpdate.id)
                    .send(userToUpdate)
                    .expect('Content-Type', /json/)
                    .expect(200);
                (0, globals_1.expect)(responseUpdate.body.email).toEqual('updated.test.tech@email.com');
            });
            (0, globals_1.test)('It should respond with 400 bad request when trying to update with a bad email format.', async () => {
                const userData = {
                    email: 'to.not.update.test.tech@email.com',
                    password: 'to.not.update.test.tech@123',
                    role: '2'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);
                const userToUpdate = response.body;
                userToUpdate.email = 'should.not.update.test.techemail.com';
                const responseUpdate = await (0, supertest_1.default)(app_1.default)
                    .put('/user/update/' + userToUpdate.id)
                    .send(userToUpdate)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(responseUpdate.body).toEqual({ error: 'invalid email' });
            });
            (0, globals_1.test)('It should respond with 400 bad request when trying to update with an email larger than 100 characters.', async () => {
                const userData = {
                    email: 'to.not.update.large.test.tech@email.com',
                    password: 'to.not.update.large.test.tech@123',
                    role: '2'
                };
                const response = await (0, supertest_1.default)(app_1.default)
                    .post('/user/add')
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(201);
                const userToUpdate = response.body;
                let stringToRepeat = 'x';
                stringToRepeat = stringToRepeat.repeat(90);
                userToUpdate.email = `should.not.update.large.test.tech${stringToRepeat}@email.com`;
                const responseUpdate = await (0, supertest_1.default)(app_1.default)
                    .put('/user/update/' + userToUpdate.id)
                    .send(userToUpdate)
                    .expect('Content-Type', /json/)
                    .expect(400);
                (0, globals_1.expect)(responseUpdate.body).toEqual({ error: 'invalid email' });
            });
            (0, globals_1.test)('It should respond with 404 when trying to update with a id that does not exist.', async () => {
                const userData = {
                    id: 'this.id.does.not.exist',
                    email: 'to.not.update.test.tech@email.com',
                    password: 'to.not.update.test.tech@123',
                    role: '2'
                };
                const responseUpdate = await (0, supertest_1.default)(app_1.default)
                    .put('/user/update/' + userData.id)
                    .send(userData)
                    .expect('Content-Type', /json/)
                    .expect(404);
                (0, globals_1.expect)(responseUpdate.body).toEqual({ error: 'user not found' });
            });
            (0, globals_1.test)('It should respond with 404 when trying to update with no id informed.', async () => {
                const userData = {
                    id: 'this.id.does.not.exist',
                    email: 'to.not.update.test.tech@email.com',
                    password: 'to.not.update.test.tech@123',
                    role: '2'
                };
                const responseUpdate = await (0, supertest_1.default)(app_1.default)
                    .put('/user/update/')
                    .send(userData)
                    .expect(404);
                (0, globals_1.expect)(responseUpdate.body).toEqual({});
            });
        });
    });
}
