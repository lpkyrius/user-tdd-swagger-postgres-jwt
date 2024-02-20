import bcrypt from 'bcryptjs';

class Cryptography {
    private readonly saltRounds: number = 10;

    // transforms the password and returns the hash
    async encrypt(pwd: string): Promise<string> {
        return bcrypt.hashSync(pwd, this.saltRounds);
    }

     // compares the raw password with the hash
    async decrypt(loginPwd: string, hashFromUsersRepository: string): Promise<boolean> {
        return await bcrypt.compare(loginPwd, hashFromUsersRepository);
    }
}

export { Cryptography }