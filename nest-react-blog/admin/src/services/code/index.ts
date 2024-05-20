import fetch from '@/utils/fetch';
const prefix = '/code';

export const postCode = (params: API.Code.CodeInfo) =>
  fetch({
    method: 'post',
    url: `${prefix}/postCode`,
    params,
    name: '上传代码',
  });

export const getCodeByUserId = (
  params: API.User.ListParams & { userId: string }
) =>
  fetch<API.Code.ListResult>({
    method: 'get',
    url: `${prefix}/getCodeByUserId`,
    params,
    name: '获取code列表通过UserId',
  });

export const updateCode = (params: API.Code.CodeInfo) =>
  fetch({
    method: 'post',
    url: `${prefix}/updateCode`,
    params,
    name: '更新code',
  });

export const deleteCode = (params: { codeId: string }) =>
  fetch({
    method: 'post',
    url: `${prefix}/deleteCode`,
    params,
    name: '删除code',
  });

export const getCodeById = (params: { codeId: string }) =>
  fetch<API.Code.CodeInfo>({
    method: 'get',
    url: `${prefix}/getCodeById`,
    params,
    name: '获取code列表通过CodeId',
  });

export const shareCode = (params: { codeId: string }) =>
  fetch({
    method: 'get',
    url: `${prefix}/shareCode`,
    params,
    name: '分享code',
  });

export const getCodeByShareCode = (shareId) =>
  fetch({
    method: 'get',
    url: `${prefix}/getCodeByShareCode/${shareId}`,
    name: '通过分享code获取代码',
  });
