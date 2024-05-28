import { forwardRef } from 'react';

const RemoteComponent = (
  { text, id }: { text: string; id: string },
  ref: any
) => {
  return <div data-component-id={id}>{text || '选中文本'}</div>;
};
export default forwardRef(RemoteComponent);
