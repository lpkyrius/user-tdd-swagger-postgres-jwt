import { User } from '../../entities/User';
import { IUserRepository } from '../../repository/IUserRepository';
import { Cryptography } from '../Cryptography/Cryptography.Service';
interface IAddUserRequest {
    email: string;
    password: string;
    role: string;
};
interface ILoginUserRequest {
    email: string;
    password: string;
};

class UserService {

    constructor(private userRepository: IUserRepository) {}

    async exist(id: string): Promise<boolean> {
        return await this.userRepository.exists(id);
    }

    async emailExists(email: string): Promise<boolean> {
        return await this.userRepository.emailExists(email);
    }

    async add({ email, password, role }: IAddUserRequest) {
        const crypto = new Cryptography();
        password = await crypto.encrypt(password);
        return await this.userRepository.add({ email, password, role });
    }

    async login({ email, password }: ILoginUserRequest) {
        let loginSuccess: boolean = false;
        const user = await this.userRepository.findUserByEmail(email)
        if (user){
            
            const crypto = new Cryptography();
            // console.log('debug email, password, loginSuccess, user', email, password, loginSuccess, user)
            loginSuccess = await crypto.decrypt(password, user.password);
            // console.log('debug email, password, loginSuccess', email, password, loginSuccess)
        }

        return loginSuccess;
    }

    async update(userToUpdate: User): Promise<User> {
        return await this.userRepository.update(userToUpdate);
    }

    async delete(id: string): Promise<boolean> {
        return await this.userRepository.delete(id);
    }

    async findById(id: string): Promise<User> {
        return await this.userRepository.findUserById(id);
    }

}

export { UserService };