import fetch from '@/utils/fetch';
const prefix = '/auth';

export const login = (params: API.Auth.LoginParams) =>
  fetch<API.Auth.LoginResult>({
    method: 'post',
    url: `${prefix}/login`,
    params,
    name: '登录',
  });

export const uploadFile = (params: FormData) =>
  fetch<{
    path: string;
  }>({
    method: 'post',
    url: `file/upload`,
    params,
    name: '上传图片',
    config: {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  });

export const uploadChunk = (params: FormData) =>
  fetch({
    method: 'post',
    url: `file/upload-chunk`,
    params,
    name: '切割上传图片',
    config: {},
  });

export const mergeFile = (params) =>
  fetch({
    method: 'get',
    url: `file/merge`,
    params,
    name: '合并图片',
  });
