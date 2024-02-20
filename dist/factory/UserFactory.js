"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const User_Service_1 = require("../services/users/User.Service");
const UserController_1 = require("../routes/users/UserController");
const UserRepositoryInMemory_1 = require("../repository/in-memory/users/UserRepositoryInMemory");
class UserFactory {
    static async createInstance() {
        const userRepository = new UserRepositoryInMemory_1.UserRepositoryInMemory();
        const userService = new User_Service_1.UserService(userRepository);
        const userController = new UserController_1.UserController(userService);
        return userController;
    }
}
exports.default = UserFactory;
