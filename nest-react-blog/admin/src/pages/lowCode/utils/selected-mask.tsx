import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconDelete } from '@arco-design/web-react/icon';
import { Popconfirm } from '@arco-design/web-react';
import { useComponets } from '../stores/components';

interface Props {
  // 组件id
  componentId: string;
  // 容器class
  containerClassName: string;
  // 相对容器class
  offsetContainerClassName: string;
}

function SelectedMask(
  { componentId, containerClassName, offsetContainerClassName }: Props,
  ref: any
) {
  const [position, setPosition] = useState({
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  });
  const { deleteComponent } = useComponets();

  // 对外暴露更新位置方法
  useImperativeHandle(ref, () => ({
    updatePosition,
  }));

  useEffect(() => {
    updatePosition();
  }, [componentId]);

  function updatePosition() {
    if (!componentId) return;
    const container = document.querySelector(`.${offsetContainerClassName}`);
    if (!container) return;

    const node = document.querySelector(`[data-component-id="${componentId}"]`);
    if (!node) return;

    // 获取节点位置
    const { top, left, width, height } = node.getBoundingClientRect();
    // 获取容器位置
    const { top: containerTop, left: containerLeft } =
      container.getBoundingClientRect();

    setPosition({
      top: top - containerTop + container.scrollTop,
      left: left - containerLeft,
      width,
      height,
    });
  }

  return createPortal(
    <div
      style={{
        position: 'absolute',
        left: position.left,
        top: position.top,
        backgroundColor: 'rgba(66, 133, 244, 0.2)',
        border: '1px solid rgb(66, 133, 244)',
        width: position.width,
        height: position.height,
        zIndex: 1,
        borderRadius: 4,
        boxSizing: 'border-box',
      }}
    >
      <div
        className="delete"
        style={{
          position: 'absolute',
          top: -20,
          width: 20,
          height: 20,
          backgroundColor: 'rgba(66, 133, 244, 0.1)',
          border: '1px solid rgb(66, 133, 244)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          cursor: 'pointer',
        }}
      >
        <Popconfirm
          title="确定删除吗？"
          onOk={() => {
            deleteComponent(componentId);
          }}
          okText="确定"
          cancelText="取消"
        >
          <IconDelete />
        </Popconfirm>
      </div>
    </div>,
    document.querySelector(`.${containerClassName}`)!
  );
}

export default forwardRef(SelectedMask);
