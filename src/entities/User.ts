class User {
    id?: string;
    email!: string;
    password!: string;
    role!: string;
    created_at?: Date;
  
    private constructor({ email, password, role }: User) {
      return Object.assign(this, {
        email,
        password,
        role
      });
    }
  }
  
  export { User };