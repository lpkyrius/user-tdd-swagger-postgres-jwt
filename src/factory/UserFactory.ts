import { UserService } from "../services/users/User.Service";
import { UserController } from "../routes/users/UserController";
import { UserRepositoryInMemory } from "../repository/in-memory/users/UserRepositoryInMemory";
import { UserRepositoryInPostgres } from "../repository/postgres/users/UserRepositoryInPostgres";
export default class UserFactory {
  static async createInstance() {
    // const userRepository = new UserRepositoryInMemory();
    const userRepository = new UserRepositoryInPostgres();
    const userService = new UserService(userRepository);
    const userController = new UserController(userService);
  
    return userController;
  }
}