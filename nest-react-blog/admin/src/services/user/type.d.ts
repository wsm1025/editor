/* eslint-disable @typescript-eslint/no-unused-vars */
export namespace User {
  type CodeResult = {
    image: string; // 图片验证码的Base64编码
  };

  type RegisterParams = {
    userName: string;
    password: string;
  };

  type UserInfo = {
    userName: string;
    userId: string;
    createTime: string;
    updateTime: string;
    role: 'admin' | 'user';
    nickName: string;
    email: string;
    phone: string;
    avatar: string;
  };

  type RegisterResult = {};

  type ListParams = API.PageParams & {};

  type ListResult = {
    userList: UserInfo[];
    total: number;
  };
}
