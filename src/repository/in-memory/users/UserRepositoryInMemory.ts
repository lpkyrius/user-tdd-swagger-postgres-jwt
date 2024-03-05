import crypto from 'crypto';
import * as fs from 'fs';
import { User } from '../../../entities/User';
import { IUserRepository } from '../../IUserRepository';
import { IRefreshToken } from '../../IRefreshToken';
import { ManageUserTestFile } from './ManageUserTestFile';
import { ManageLoginTestFile } from './ManageLoginTestFile';
class UserRepositoryInMemory implements IUserRepository {

    private readonly userFilePath: string;
    private readonly loginFilePath: string;

    constructor() {
        const manageUserTestFile = new ManageUserTestFile();
        this.userFilePath = manageUserTestFile.getFile();

        const manageLoginTestFile = new ManageLoginTestFile();
        this.loginFilePath = manageLoginTestFile.getFile();
    }

    async add(user: User): Promise<User> {
        const users = this.readUsersFromFile();
        const newUser = { ...user, id: crypto.randomUUID(), created_at: new Date(new Date().toISOString()) };
        users.push(newUser);
        this.writeUsersToFile(users);

        return newUser;
    }

    async findUserByEmail(email: string): Promise<User> {
        const users = this.readUsersFromFile();
        const index = users.findIndex((e) => e.email === email);
        if (index !== -1) {
            return users[index];
        }
        
        throw new Error('email not found');
    }

    async update(user: User): Promise<User> {
        const users = this.readUsersFromFile();
        const index = users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
        this.writeUsersToFile(users);
        return user;
        }
        throw new Error('user not found');
    }

    async exists(id: string): Promise<boolean> {
        const users = this.readUsersFromFile();
        
        return users.some((user) => user.id === id);
    }

    async emailExists(email: string): Promise<boolean> {
        const users = this.readUsersFromFile();
        
        return users.some((user) => user.email === email);
    }

    async list(): Promise<User[]> {
        return this.readUsersFromFile();
    }

    async findUserById(id: string): Promise<User> {
        const users = this.readUsersFromFile();
        const index = users.findIndex((u) => u.id === id);
        if (index !== -1) {
            return users[index];
        }
        throw new Error('id not found');
    }

    // for now, refresh token management will be only hard code tests
    async saveUserRefreshToken(id: string, refreshToken: string): Promise<any> {
        return [
            {
                id: id, 
                refreshToken: refreshToken
            }
        ];
    }

    // for now, refresh token management will be only hard code tests
    async getCurrentUserRefreshToken(refreshToken: string): Promise<IRefreshToken> {
        let refreshTokenFound: IRefreshToken;
        const tokens = this.readUsersFromFile();
        const index = tokens.findIndex((usr) => usr.refreshToken === refreshToken);
        if (index !== -1) {
            refreshTokenFound = {
                id: tokens[index].id || '',
                user_id: tokens[index].id || '',
                refresh_token: tokens[index].refreshToken || '',
            };
        }
        
        throw new Error('refresh token not found');
    }

    // for now, refresh token management will be only hard code tests
    async deleteRefreshToken(refreshToken: string): Promise<boolean> {
        return true;
    }

    private readUsersFromFile(): User[] {
        const userFileData:User[] = JSON.parse(fs.readFileSync(this.userFilePath, 'utf-8'));
        const loginFileData:User[] = JSON.parse(fs.readFileSync(this.loginFilePath, 'utf-8'));
        const completeUserData = userFileData.map(user => {
            const loginInfo = loginFileData.find(login => login.email === user.email);
            return {
              id: user.id!,
              email: user.email!,
              role: user.role!,
              created_at: user.created_at,
              password: loginInfo ? loginInfo.password : '' // Add password field from loginFileData
            };
          });

        return completeUserData;
    }

    private writeUsersToFile(users: User[]): void {
        // split the data to each specific file
        const usersArray = [];
        const loginsArray = [];
        users.forEach(usr => {
            usersArray.push(
                { 
                    id: usr.id,
                    email: usr.email,
                    role: usr.role,
                    created_at: usr.created_at
                }
            );
            loginsArray.push(
                { 
                    id: crypto.randomUUID(),
                    email: usr.email,
                    password: usr.password,
                }
            );
        });

        fs.writeFileSync(this.userFilePath, JSON.stringify(users, null, 2));
    }

}

export { UserRepositoryInMemory }