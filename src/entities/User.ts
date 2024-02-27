class User {
    id?: string;
    email!: string;
    password!: string;
    role!: string;
    created_at?: Date;
    refreshToken?: string;
    accessToken?: string;
  
    private constructor({ email, password, role }: User) {
      return Object.assign(this, {
        email,
        password,
        role
      });
    }
  }
  
  export { User };