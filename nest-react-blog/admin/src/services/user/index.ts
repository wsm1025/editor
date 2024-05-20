import fetch from '@/utils/fetch';
const prefix = '/user';

export const register = (params: API.User.RegisterParams) =>
  fetch<API.User.RegisterResult>({
    method: 'post',
    url: `${prefix}/register`,
    params,
    name: '注册用户',
  });

export const update = (params: API.User.UserInfo) =>
  fetch<API.User.RegisterResult>({
    method: 'post',
    url: `${prefix}/update`,
    params,
    name: '更新用户信息',
  });

export const deleteUser = (params: API.User.UserInfo.userId) =>
  fetch({
    method: 'post',
    url: `${prefix}/delete`,
    params,
    name: '删除用户信息',
  });

export const getUserList = (params: API.User.ListParams) =>
  fetch<API.User.ListResult>({
    method: 'get',
    url: `${prefix}/getAllUser`,
    params,
    name: '获取用户列表',
  });

export const getUserDetail = (params: { userId: String }) =>
  fetch<API.User.UserInfo['userId']>({
    method: 'get',
    url: `${prefix}/detail`,
    params,
    name: '获取用户详情',
  });

export const getWebToken = (appKey: string) =>
  fetch({
    method: 'get',
    url: `${prefix}/getWebToken`,
    params: { appKey },
    name: '获取webtoken',
  });
