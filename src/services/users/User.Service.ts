import { User } from '../../entities/User';
import { IUserRepository } from '../../repository/IUserRepository';
import { IRefreshToken } from '../../repository/IRefreshToken';
import { Cryptography } from '../Cryptography/Cryptography.Service';
import jwt from 'jsonwebtoken';

require('dotenv').config();
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

    async login({ email, password }: ILoginUserRequest): Promise<User> {
        if (!email || !password)
            throw new Error('invalid login data'); 
        const user = await this.userRepository.findUserByEmail(email)
        const crypto = new Cryptography();
        const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || '';
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || '';
        const userId: string = user.id || '';
        if(await crypto.decrypt(password, user.password)){
            const accessToken = jwt.sign(
                { user_id: user.id },
                accessTokenSecret,
                { expiresIn: '2h' }
            );
            const refreshToken = jwt.sign(
                { user_id: user.id },
                refreshTokenSecret,
                { expiresIn: '1d' }
            );
            await this.userRepository.saveUserRefreshToken(userId, refreshToken);
            user.accessToken = accessToken;
            user.refreshToken = refreshToken;
        }

        return user;
    }

    async update(userToUpdate: User): Promise<User> {
        return await this.userRepository.update(userToUpdate);
    }

    async findById(id: string): Promise<User> {
        return await this.userRepository.findUserById(id);
    }

    async handleRefreshToken(refreshToken:string): Promise<string> {
        let accessToken: string = '';
        const tokenData: IRefreshToken = await this.userRepository.getCurrentUserRefreshToken(refreshToken);
        if (!tokenData)
            return ''

        const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || '';
        const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || '';
        jwt.verify(
            refreshToken,
            refreshTokenSecret,
            (err, decoded) => {
                if (err) return ''; // Forbidden

                accessToken = jwt.sign(
                    { "user_id": tokenData.user_id },
                    accessTokenSecret,
                    { expiresIn: '15m' }
                );
            }
        );

        return accessToken;
    }

}

export { UserService };