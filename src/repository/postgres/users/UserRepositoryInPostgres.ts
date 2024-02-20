import crypto from 'crypto';
import { User } from '../../../entities/User';
import { IUserRepository } from "../../IUserRepository";
import { db } from '../../../services/postgres/postgres';



import * as fs from 'fs';
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
      const savedUser = await db('users')
          .insert({
            id: newUser.id,
            email: newUser.email,
            password: newUser.password,
            role: newUser.role,
            created_at: newUser.created_at 
          })
          .returning('*');
          
      return savedUser[0];  
            
    } catch (error) {
        console.log(`Error in add User(): ${error}`);
        throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const recoveredData = await db('users')
          .select('*')
          .from('users')
          .where({ email })

      if (recoveredData.length)
        return recoveredData[0];

      throw new Error('email not found');
    } catch (error) {
        console.log(`Error in findUserByEmail(): ${ error }`)
        throw error;
    }
  }

  async update(user: User): Promise<User> {
    try {
      const { email, role } = user
      const updatedUser = await db('users')
        .where('id', '=', user.id)
        .update({
            email,
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

  async delete(id: string): Promise<boolean> {
    try {

      const deletedTokenData = await db('users')
          .where({ id })
          .del()
          .returning("id");

      if (!deletedTokenData.length)
        return false;
      
      return true;
    } catch (error) {
        console.log(`Error in delete user(): ${ error }`);
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

}

export { UserRepositoryInPostgres };
