export class GlobalConstants {
  public static userInfo: User;

  static keepUser(user): void {
    GlobalConstants.userInfo = user;
  }

  static getUser(): User {
    return GlobalConstants.userInfo;
  }

  static canRouteAdmin(): boolean {
    return this.userInfo.role === 1;
  }

  static canRouteEditor(): boolean {
    return this.userInfo.role === 2;
  }
}

class User {
  name: string;
  surname: string;
  email: string;
  id: string;
  role: number;
}
