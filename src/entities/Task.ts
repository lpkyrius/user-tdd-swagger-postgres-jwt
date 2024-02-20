class Task {
    id?: string;
    userId?: string;
    summary!: string;
    created_at?: Date;
  
    private constructor({ userId, summary }: Task) {
      return Object.assign(this, {
        userId,
        summary
      });
    }
  }
  
  export { Task };