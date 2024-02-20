"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const Cryptography_Service_1 = require("../Cryptography/Cryptography.Service");
;
;
class UserService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async exist(id) {
        return await this.userRepository.exists(id);
    }
    async emailExists(email) {
        return await this.userRepository.emailExists(email);
    }
    async add({ email, password, role }) {
        const crypto = new Cryptography_Service_1.Cryptography();
        password = await crypto.encrypt(password);
        return await this.userRepository.add({ email, password, role });
    }
    async login({ email, password }) {
        const user = await this.userRepository.findUserByEmail(email);
        const crypto = new Cryptography_Service_1.Cryptography();
        const loginSuccess = await crypto.decrypt(password, user.password);
        return loginSuccess;
    }
    async update(userToUpdate) {
        return await this.userRepository.update(userToUpdate);
    }
    async delete(id) {
        return await this.userRepository.delete(id);
    }
    async findById(id) {
        return await this.userRepository.findUserById(id);
    }
}
exports.UserService = UserService;
