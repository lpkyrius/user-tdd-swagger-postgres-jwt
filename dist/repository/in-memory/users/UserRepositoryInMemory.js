"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryInMemory = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs = __importStar(require("fs"));
const ManageUserTestFile_1 = require("./ManageUserTestFile");
class UserRepositoryInMemory {
    constructor() {
        const manageUserTestFile = new ManageUserTestFile_1.ManageUserTestFile();
        this.filePath = manageUserTestFile.getFile();
    }
    async add(user) {
        const users = this.readUsersFromFile();
        const newUser = { ...user, id: crypto_1.default.randomUUID(), created_at: new Date(new Date().toISOString()) };
        users.push(newUser);
        this.writeUsersToFile(users);
        return newUser;
    }
    async findUserByEmail(email) {
        const users = this.readUsersFromFile();
        const index = users.findIndex((e) => e.email === email);
        if (index !== -1) {
            return users[index];
        }
        throw new Error('email not found');
    }
    async update(user) {
        const users = this.readUsersFromFile();
        const index = users.findIndex((u) => u.id === user.id);
        if (index !== -1) {
            users[index] = user;
            this.writeUsersToFile(users);
            return user;
        }
        throw new Error('user not found');
    }
    async delete(id) {
        const users = this.readUsersFromFile();
        const initialLength = users.length;
        const filteredUsers = users.filter((u) => u.id !== id);
        if (filteredUsers.length !== initialLength) {
            this.writeUsersToFile(filteredUsers);
            return true;
        }
        return false;
    }
    async exists(id) {
        const users = this.readUsersFromFile();
        return users.some((user) => user.id === id);
    }
    async emailExists(email) {
        const users = this.readUsersFromFile();
        return users.some((user) => user.email === email);
    }
    async list() {
        return this.readUsersFromFile();
    }
    async findUserById(id) {
        const users = this.readUsersFromFile();
        const index = users.findIndex((u) => u.id === id);
        if (index !== -1) {
            return users[index];
        }
        throw new Error('id not found');
    }
    readUsersFromFile() {
        const fileData = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(fileData);
    }
    writeUsersToFile(users) {
        fs.writeFileSync(this.filePath, JSON.stringify(users, null, 2));
    }
}
exports.UserRepositoryInMemory = UserRepositoryInMemory;
