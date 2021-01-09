export class GlobalConstants {
  public static userInfo: User;

  static keepUser(user): void {
    GlobalConstants.userInfo = user;
  }

  static getUser(): User {
    return GlobalConstants.userInfo;
  }
}

class User {
  name: string;
  surname: string;
  email: string;
  id: string;
  role: number;
}
