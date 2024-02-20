"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cryptography = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class Cryptography {
    constructor() {
        this.saltRounds = 10;
    }
    // transforms the password and returns the hash
    async encrypt(pwd) {
        return bcryptjs_1.default.hashSync(pwd, this.saltRounds);
    }
    // compares the raw password with the hash
    async decrypt(loginPwd, hashFromUsersRepository) {
        return await bcryptjs_1.default.compare(loginPwd, hashFromUsersRepository);
    }
}
exports.Cryptography = Cryptography;
