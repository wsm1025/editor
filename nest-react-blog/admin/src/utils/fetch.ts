import axios from 'axios';
import type {
  AxiosRequestConfig,
  AxiosInstance,
  Method,
  AxiosResponse,
} from 'axios';

import { Message } from '@arco-design/web-react';
import { createBrowserHistory } from 'history';

// 创建浏览器历史记录对象
const history = createBrowserHistory();
const env = import.meta.env as any;

const service: AxiosInstance = axios.create({
  baseURL: env.VITE_BASE_URL,
  timeout: 50000, // 请求超时时间
});
// request拦截器
service.interceptors.request.use(
  (
    config: AxiosRequestConfig & {
      name: string;
    }
  ) => {
    const configInfo = config;
    configInfo.headers['Authorization'] = `Bearer ${sessionStorage.getItem(
      'token'
    )}`;
    console.log(
      `%c ${config.name}  ${config.url}-参数:`,
      'color:#FF0099;',
      config.params || config.data
      // configInfo.headers,
    );
    return configInfo;
  }
);

// response拦截器
service.interceptors.response.use(
  async (response: AxiosResponse) => {
    // 关闭加载中提示
    const res = response.data;
    const { name } = response.config as { name: string };
    console.log(`%c ${name} 结果 `, 'color:#FF0099;', res);
    const { code, msg = '系统错误' } = res;
    if (code === '0000' || code === 200 || code === 1) {
      if (res?.data?.message) {
        Message.success(res.data.message);
      }
      return Promise.resolve(res.data);
    }
    if (
      code === 'gateway_9996' ||
      code === 'amp-oss-gateway_9996' ||
      code === 'amp-oss-gateway_9997' ||
      code === 9996 ||
      code === 6996
    ) {
      window.location.href = env.VITE_PUBLIC_PATH + '/login';
    } else if (code === 9999 || code === 999999) {
      Message.error('系统开小差了，请稍后再试');
    } else if (code === 401) {
      Message.error(msg);
      history.push('/login');
      sessionStorage.removeItem('token');
    } else {
      Message.error(msg);
    }
    return Promise.reject(res);
  },
  (error: unknown) => {
    try {
      const errInfo = JSON.parse(JSON.stringify(error)) ?? {};
      Message.error(errInfo?.Message ?? '服务器开小差了，请稍后再试');
      console.log(errInfo, '服务器问题');
    } catch (errorMsg) {
      console.log(errorMsg);
    }
    return Promise.reject(error);
  }
);

const withoutDataMethod = (
  method?: Method,
  url?: string,
  params?: unknown,
  config = {}
) =>
  service[method](url, {
    params,
    ...config,
  });

const withDataMethod = (
  method?: Method,
  url?: string,
  data?: unknown,
  config = {}
) => service[method](url, data, config);

const fetchMethod = <T>(info: {
  method: Method;
  url: string;
  data?: unknown;
  params?: unknown;
  name?: string;
  config?: object;
}): T => {
  const { method, url, name, params, config = {} } = info;
  if (method === 'get' || method === 'delete') {
    return withoutDataMethod(method, url, params, {
      name,
      ...config,
    });
  }
  return withDataMethod(method, url, params, {
    name,
    ...config,
  });
};

export default fetchMethod;
