// src/editor/components/space/index.tsx
import { Space as ArcoSpace } from '@arco-design/web-react';

import { useDrop } from 'react-dnd';
import { ItemType } from '../../common/data';
import { forwardRef } from 'react';

interface Props {
  // 当前组件的子节点
  children: any;
  // 当前组件的id
  id: string;
  size: any;
}

const Space = (props, ref) => {
  const { children, id, size } = props;

  const [{ canDrop }, drop] = useDrop(() => ({
    accept: Object.values(ItemType),
    drop: (_, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }
      // 这里把当前组件的id返回出去，在拖拽结束事件里可以拿到这个id 返回的是被放置的组件id
      return {
        id,
      };
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  if (!children?.length) {
    return (
      <ArcoSpace
        size={size}
        ref={drop}
        className="p-[16px]"
        id={id}
        data-component-id={id}
        style={{ border: canDrop ? '1px solid #ccc' : 'none' }}
      >
        暂无内容
      </ArcoSpace>
    );
  }

  return (
    <ArcoSpace
      size={size}
      ref={drop}
      className="p-[16px]"
      id={id}
      data-component-id={id}
      style={{ border: canDrop ? '1px solid #ccc' : 'none' }}
    >
      {children}
    </ArcoSpace>
  );
};

export default forwardRef(Space);
