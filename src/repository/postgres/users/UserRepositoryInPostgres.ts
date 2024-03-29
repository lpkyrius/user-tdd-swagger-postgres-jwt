import crypto from 'crypto';
import { User } from '../../../entities/User';
import { IUserRepository } from '../../IUserRepository';
import { IRefreshToken } from '..//../IRefreshToken';
import { db } from '../../../services/postgres/postgres';
import { ManageUserTestFile } from '../../in-memory/users/ManageUserTestFile';

class UserRepositoryInPostgres implements IUserRepository {
  private readonly filePath: string;
  
  constructor() {
      const manageUserTestFile = new ManageUserTestFile();
      this.filePath = manageUserTestFile.getFile();
  }

  async add(user: User): Promise<User> {
      try {
          const newUser: User = { ...user, id: crypto.randomUUID(), created_at: new Date(new Date().toISOString()) };
          const savedUser = await db.transaction(async (createdTransaction: any) => {
              const insertedUser: User = await createdTransaction('users')
                  .insert({
                      id: newUser.id,
                      email: newUser.email,
                      role: newUser.role,
                      created_at: newUser.created_at
                  }).returning('*').then((rows: User[]) => rows[0]);

              await createdTransaction('login').insert({ 
                id: crypto.randomUUID(), 
                password: newUser.password, 
                email: newUser.email 
              });

              return insertedUser;
          });

          return savedUser;
      } catch (error) {
          console.log(`Error in add User(): ${error}`);
          throw error;
      }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const recoveredData = await db('users')
          .select('users.*', 'login.password as password')
          .from('users')
          .leftJoin('login', 'users.email', 'login.email')
          .where({ 'users.email': email });

      if (recoveredData.length)
        return recoveredData[0];

      throw new Error('email not found');
    } catch (error) {
        console.log(`Error in findUserByEmail(): ${error}`)
        throw error;
    }
  }

  async update(user: User): Promise<User> {
    try {
      const { role } = user
      const updatedUser = await db('users')
        .where({ 'id': user.id })
        .update({
            role
          })
        .returning('*');
      
      if (!updatedUser.length)
        throw new Error('user not found');

      return updatedUser[0];
    } catch (error) {
        console.log(`Error in update user(): ${ error }`);
        throw error;
    }
  }

  async exists(id: string): Promise<boolean> {
    try {
      const recoveredData = await db('users')
          .select('*')
          .from('users')
          .where({ id })

      if (!recoveredData.length)
        return false;

      return true;
    } catch (error) {
        console.log(`Error in exists user(): ${ error }`)
        throw error;
    }
  }

  async emailExists(email: string): Promise<boolean> {
    try {
      const recoveredData = await db('users')
          .select('*')
          .from('users')
          .where({ email })

      if (!recoveredData.length)
        return false;

      return true;
    } catch (error) {
        console.log(`Error in emailExists user(): ${ error }`)
        throw error;
    }
  }

  async findUserById(id: string): Promise<User> {
    try {
      const recoveredData = await db('users')
          .select('*')
          .from('users')
          .where({ id })

          if (!recoveredData.length)
            throw new Error('id not found');
      
        return recoveredData[0];
    } catch (error) {
        console.log(`Error in findUserById(): ${ error }`)
        throw error;
    }
  }

  async saveUserRefreshToken(id: string, refreshToken: string): Promise<any> {
    try {
        const tokenData = await db('refresh_tokens')
            .insert({
                id: crypto.randomUUID(),
                user_id: id,
                refresh_token: refreshToken,
                created_at: new Date(new Date().toISOString())
            });

        return tokenData;  
              
    } catch (error) {
        console.log(`Error in saveCurrentUserRefreshToken(): ${error}`);
        throw error;
    }
  }

  async getCurrentUserRefreshToken(refreshToken: string): Promise<IRefreshToken> {
    try {
        const tokenData = await db('refresh_tokens')
          .select('*')
          .from('refresh_tokens')
          .where({' refresh_token': refreshToken });

        if (tokenData.length)
              return tokenData[0];

        throw new Error('refresh token not found');
    } catch (error) {
        console.log(`Error in getCurrentUserRefreshToken(): ${ error }`);
        throw new Error('refresh token not found');
    }
  }

  async deleteRefreshToken(refreshToken: string): Promise<boolean> {
    try {
      const deletedTokenData = await db('refresh_tokens')
        .where({' refresh_token': refreshToken })
        .del()
        .returning("id");
  
      if (!deletedTokenData.length)
        return false;
  
      return true;
  
    } catch (error) {
        console.log(`Error in deleteRefreshToken(): ${ error }`);
        throw new Error('refresh token not found');
    }
  }
  
}

export { UserRepositoryInPostgres };
