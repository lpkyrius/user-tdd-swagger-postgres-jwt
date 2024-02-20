import crypto from 'crypto';
import * as fs from 'fs';
import { User } from '../../../entities/User';
import { IUserRepository } from '../../IUserRepository';
import { ManageUserTestFile } from './ManageUserTestFile';

class UserRepositoryInMemory implements IUserRepository {

    private readonly filePath: string;

    constructor() {
        const manageUserTestFile = new ManageUserTestFile();
        this.filePath = manageUserTestFile.getFile();
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

    async delete(id: string): Promise<boolean> {
        const users = this.readUsersFromFile();
        const initialLength = users.length;
        const filteredUsers = users.filter((u) => u.id !== id);
        if (filteredUsers.length !== initialLength) {
            this.writeUsersToFile(filteredUsers);
            return true;
        }
        return false;
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

    private readUsersFromFile(): User[] {
        const fileData = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(fileData);
    }

    private writeUsersToFile(users: User[]): void {
        fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));
    }

}

export { UserRepositoryInMemory }