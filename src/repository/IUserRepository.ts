import { User } from '../entities/User';
import { IRefreshToken } from '../repository/IRefreshToken';
export interface IUserRepository {
  add(user: User): Promise<User>;
  findUserByEmail(email: string): Promise<User>;
  update(user: User): Promise<User>;
  exists(id: string): Promise<boolean>;
  emailExists(email: string): Promise<boolean>;
  findUserById(id: string): Promise<User>;
  saveUserRefreshToken(id: string, refreshToken: string): Promise<any>;
  getCurrentUserRefreshToken(refreshToken:string): Promise<IRefreshToken>;
}