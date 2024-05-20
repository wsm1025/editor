import { linkValid } from '@/utils/validate';
import { lazy } from 'react';

const messageType = [
  {
    value: 'notice',
    label: '通知',
    valid: (value) => !value && value.length <= 20,
    errMsg: '通知内容不能为空且长度不能超过20个字符',
    components: lazy(() => import('./components/Notice')),
  },
  {
    value: 'link',
    label: '链接',
    valid: (value) => !linkValid(value),
    errMsg: '链接格式不正确',
    components: lazy(() => import('./components/Link')),
  },
  {
    value: 'text',
    label: '文本',
    valid: (value) => !value && value.length <= 100,
    errMsg: '文本内容不能为空且长度不能超过100个字符',
    components: lazy(() => import('./components/Text')),
  },
];
export { messageType };
