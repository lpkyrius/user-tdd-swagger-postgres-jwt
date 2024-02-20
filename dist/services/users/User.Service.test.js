"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const User_Service_1 = require("./User.Service");
const UserRepositoryInMemory_1 = require("../../repository/in-memory/users/UserRepositoryInMemory");
(0, globals_1.describe)('#UserService', () => {
    let userRepository;
    let userService;
    const userStructure = globals_1.expect.arrayContaining([
        globals_1.expect.objectContaining({
            id: globals_1.expect.any(String),
            email: globals_1.expect.any(String),
            role: globals_1.expect.any(String),
            created_at: globals_1.expect.any(String),
        }),
    ]);
    (0, globals_1.beforeAll)(() => {
        userRepository = new UserRepositoryInMemory_1.UserRepositoryInMemory();
        userService = new User_Service_1.UserService(userRepository);
    });
    (0, globals_1.describe)('#UserExist', () => {
        it('should return false when check if a non-existent user exists', async () => {
            const result = await userService.exist('this.id.does.not.exist');
            (0, globals_1.expect)(result).toBeFalsy();
        });
    });
    (0, globals_1.describe)('#UserEmailExist', () => {
        it('should return true when check if an existent user email exists', async () => {
            const user = {
                email: 'exist.tech@email.com',
                password: 'exist.tech@123',
                role: '2'
            };
            const addedUser = await userService.add(user);
            const result = await userService.emailExists(addedUser.email);
            (0, globals_1.expect)(result).toBeTruthy();
        });
        it('should return false when check if a non-existent user exists', async () => {
            const result = await userService.emailExists('this.id.does.not.exist');
            (0, globals_1.expect)(result).toBeFalsy();
        });
    });
    (0, globals_1.describe)('#CreateUser', () => {
        it('should be able to create a new user and confirm it exists', async () => {
            const user = {
                email: 'peter.tech@email.com',
                password: 'peter.tech@123',
                role: '2'
            };
            const addedUser = await userService.add(user);
            const result = await userService.exist(addedUser.id);
            (0, globals_1.expect)(addedUser).toHaveProperty('id');
            (0, globals_1.expect)(result).toBeTruthy();
            (0, globals_1.expect)(user.email).toEqual('peter.tech@email.com');
        });
    });
    (0, globals_1.describe)('#LoginUser', () => {
        it('should be able to log in with valid user and password', async () => {
            const userData = {
                email: 'mary.tech@email.com',
                password: 'mary.tech@123'
            };
            const result = await userService.login(userData);
            (0, globals_1.expect)(result).toBeTruthy();
        });
        it('should NOT be able to log in with invalid password', async () => {
            const noPasswordUser = {
                email: 'mary.tech@email.com',
                password: ''
            };
            const result = await userService.login(noPasswordUser);
            (0, globals_1.expect)(result).toBeFalsy();
        });
        it('should throw an error when trying to log in with invalid user', async () => {
            const userInvalid = {
                email: 'i.do.not.exist@email.com',
                password: 'mary.tech@123'
            };
            await (0, globals_1.expect)(async () => {
                const loginIssue = await userService.login(userInvalid);
            }).rejects.toThrow('email not found');
        });
        it('should throw an error when trying to log in with invalid user email', async () => {
            const userInvalid = {
                email: '',
                password: ''
            };
            await (0, globals_1.expect)(async () => {
                const loginIssue = await userService.login(userInvalid);
            }).rejects.toThrow('email not found');
        });
    });
    (0, globals_1.describe)('#Find User', () => {
        let user;
        it('should find an existent user', async () => {
            let user, result;
            const userData = {
                email: 'manager.to.find@email.com',
                password: 'manager.to.find@123',
                role: '1',
            };
            user = await userService.add(userData);
            const userFound = await userService.findById(user.id);
            (0, globals_1.expect)(userFound.email).toEqual('manager.to.find@email.com');
        });
        it('should throw an error when trying to find a non-existing user on UserService', async () => {
            await (0, globals_1.expect)(async () => {
                const findUserError = await userService.findById('this.id.should.not.exist');
            }).rejects.toThrow('id not found');
        });
    });
    (0, globals_1.describe)('#UpdateUser', () => {
        it('should be able to update an existent user', async () => {
            let user, result;
            const userData = {
                email: 'manager.to.update@email.com',
                password: 'manager.to.update@123',
                role: '1',
            };
            user = await userService.add(userData);
            let updatedUser = Object.assign({}, user);
            updatedUser.email = 'manager.updated@email.com';
            result = await userService.update(updatedUser);
            (0, globals_1.expect)(result.email).toBe('manager.updated@email.com');
        });
        it('should throw an error when updating a non-existing user on UserService', async () => {
            const userError = {
                id: 'this.id.should.not.exist',
                email: 'this.user.does.not.exist@email.com',
                password: 'this.user.does.not.exist@123',
                role: '1',
            };
            await (0, globals_1.expect)(async () => {
                const updatedUserError = await userService.update(userError);
            }).rejects.toThrow('user not found');
        });
    });
    (0, globals_1.describe)('#DeleteUser', () => {
        it('should be able to delete an existent user', async () => {
            const userData = {
                email: 'manager.to.create@email.com',
                password: 'manager.to.create@123',
                role: '1',
            };
            const user = await userService.add(userData);
            const existNewUser = await userService.exist(user.id);
            const userDeleted = await userService.delete(user.id);
            const existAfterDelete = await userService.exist(user.id);
            (0, globals_1.expect)(userDeleted).toBeTruthy;
            (0, globals_1.expect)(existNewUser).toBe(true);
            (0, globals_1.expect)(existAfterDelete).toBe(false);
        });
        it('should return false when deleting a non-existing user on UserService', async () => {
            const testDel = async function () {
                return await userService.delete('this.id.should.not.exist');
            };
            (0, globals_1.expect)(await testDel()).toBeFalsy();
        });
    });
});
