interface RequestWithUser extends Request {
    user: {
      userId: number;
      role: string;
    };
  }