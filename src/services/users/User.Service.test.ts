import { expect, describe, beforeAll } from '@jest/globals';
import { User } from '../../entities/User';
import { IUserRepository } from '../../repository/IUserRepository';
import { UserService } from './User.Service';
import { UserRepositoryInMemory } from '../../repository/in-memory/users/UserRepositoryInMemory';
import { UserRepositoryInPostgres } from '../../repository/postgres/users/UserRepositoryInPostgres';
import { dbInit, dbClose } from './../../services/postgres/postgres';

// Mock console.log and console.error globally for the entire test suite
// So we keep a clear console when tests should return error 
global.console.log = jest.fn();
global.console.error = jest.fn();

describe('#UserService', () =>{

    // to enable/disable one specific test (in memory or postgres) 
    // just comment the correspondent line withing the repositories object below
    const repositories: Record<string, string> = { 
        inmemory: 'InMemory', 
        database: 'Postgres' 
    };

    for (const property in repositories) {

        let usersRepository: IUserRepository;
        let userService: UserService;
        const userStructure = expect.arrayContaining([
            expect.objectContaining({
                id: expect.any(String),
                email: expect.any(String),
                role: expect.any(String),
                created_at: expect.any(String),
            }),
        ]);

        // run tests twice, on for InMemory and one for Postgres
        beforeAll(async () => {
        if (repositories[property] == 'InMemory'){
            usersRepository = new UserRepositoryInMemory();
        } else {
            await dbInit();
            usersRepository = new UserRepositoryInPostgres();
        }
        userService = new UserService(usersRepository);
        });

        afterAll(async () => {
            await dbClose();
        });
        
        describe('#UserExist', () => {
            it('should return false when check if a non-existent user exists', async () => {
                const result = await userService.exist('this.id.does.not.exist');

                expect(result).toBeFalsy();
            })
        })

        describe('#UserEmailExist', () => {
            it('should return true when check if an existent user email exists', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const user: User = {
                    email: `exist.tech.${ randomString }@email.com`,
                    password: `exist.tech.${ randomString }@123`,
                    role: '2'
                };
                const addedUser = await userService.add(user);
                const result = await userService.emailExists(addedUser.email);

                expect(result).toBeTruthy();
            })

            it('should return false when check if a non-existent user exists', async () => {
                const result = await userService.emailExists('this.id.does.not.exist');

                expect(result).toBeFalsy();
            })
        })

        describe('#CreateUser', () => {
            it('should be able to create a new user and confirm it exists', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                const user: User = {
                    email: `peter.tech.${ randomString }@email.com`,
                    password: `peter.tech.${ randomString }@123`,
                    role: '2'
                };
                
                const addedUser = await userService.add(user);
                const result = await userService.exist(addedUser.id!);

                expect(addedUser).toHaveProperty('id');
                expect(result).toBeTruthy();
                expect(addedUser.email).toEqual(user.email)
            })
        })

        describe('#LoginUser', () => {
            it('should be able to log in with valid user and password', async () => {
                const userData = {
                    email: 'mary.tech@email.com',
                    password: 'mary.tech@123'
                };
                const result = await userService.login(userData);

                expect(result.email).toEqual(userData.email);
                expect(result).toHaveProperty('accessToken');
            })
            
            it('should NOT be able to log in with invalid password', async () => {
                const userInvalid = {
                    email: 'mary.tech@email.com',
                    password: ''
                };
                await expect(async () => {
                    const loginIssue: User = await userService.login(userInvalid);
                }).rejects.toThrow('invalid login data');
            })

            it('should throw an error when trying to log in with invalid user', async () => {
                const userInvalid = {
                    email: 'i.do.not.exist@email.com',
                    password: 'mary.tech@123'
                };
                await expect(async () => {
                    const loginIssue: User = await userService.login(userInvalid);
                }).rejects.toThrow('email not found');
            })

            it('should throw an error when trying to log in with invalid user email', async () => {
                const userInvalid = {
                    email: '',
                    password: ''
                };
                await expect(async () => {
                    const loginIssue: User = await userService.login(userInvalid);
                }).rejects.toThrow('invalid login data');
            })
        })

        describe('#Find User', () => {
            let user: User;
        
            it('should find an existent user', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                let user: User, result: User; 
                const userData = {
                    email: `user.to.find.manager.${ randomString }@email.com`,
                    password: `user.to.find.manager.${ randomString }@123`,
                    role: '1',
                };

                user = await userService.add(userData);
                const userFound: User = await userService.findById(user.id!);
        
            expect(userFound.email).toEqual(user.email)
            });
        
            it('should throw an error when trying to find a non-existing user on UserService', async () => {
            await expect(async () => {
                const findUserError: User = await userService.findById('this.id.should.not.exist');
            }).rejects.toThrow('id not found');
            });
        });

        describe('#UpdateUser', () => {
            it('should be able to update the role from an existent user', async () => {
                const randomString = (Math.floor((Math.random() * 1000000) + 1)).toString();
                let user: User, result: User; 
                const userData = {
                    email: `user.to.update.manager.${ randomString }@email.com`,
                    password: `user.to.update.manager.${ randomString }@123`,
                    role: '1',
                };

                user = await userService.add(userData);

                let updatedUser: User = Object.assign({}, user);
                updatedUser.role = '2';

                result = await userService.update(updatedUser);

                expect(result.role).toBe(updatedUser.role);
            })

            it('should throw an error when updating a non-existing user on UserService', async () => {
            const userError: User = {
                id: 'this.id.should.not.exist',
                email: 'this.user.does.not.exist@email.com',
                password: 'this.user.does.not.exist@123',
                role: '1',
            };
            await expect(async () => {
                const updatedUserError: User = await userService.update(userError);
            }).rejects.toThrow('user not found');
            });
        })

    }

});
