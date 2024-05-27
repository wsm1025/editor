import { Suspense, useEffect, useRef } from 'react';
import { ItemType } from '../common/data';
import { useComponets } from '../stores/components';
import { renderComponents } from './componentSetting';
import { useDrop } from 'react-dnd';
import SelectedMask from '../utils/selected-mask';

const ContentComponents: React.FC = () => {
  const [{ canDrop }, drop] = useDrop(() => ({
    // 可以接受的元素类型
    accept: Object.keys(ItemType),
    drop: (_, monitor) => {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      return {
        id: 0,
      };
    },
    collect: (monitor) => ({
      canDrop: monitor.canDrop(),
    }),
  }));
  const { components, curComponentId, setCurComponentId } = useComponets();
  useEffect(() => {
    function createMask(e: any) {
      const path = e.composedPath();
      for (let i = 0; i < path.length; i++) {
        const ele = path[i];
        if (ele.getAttribute && ele.getAttribute('data-component-id')) {
          const componentId = ele.getAttribute('data-component-id');
          setCurComponentId(componentId);
          break;
        }
      }
    }
    const container = document.querySelector('.stage');
    if (container) {
      container.addEventListener('click', createMask, true);
    }
    return () => {
      if (container) {
        container.removeEventListener('click', createMask, true);
      }
    };
  }, []);
  const selectedMaskRef = useRef<any>(null);
  useEffect(() => {
    if (selectedMaskRef.current) {
      selectedMaskRef.current.updatePosition();
    }
  }, [components]);
  return (
    <div
      ref={drop}
      style={{ border: canDrop ? '1px solid #ccc' : 'none' }}
      className="p-[24px] h-[100%] stage"
    >
      <Suspense fallback="loading..">{renderComponents(components)}</Suspense>
      {curComponentId && (
        <SelectedMask
          componentId={curComponentId}
          containerClassName="selected-mask-container"
          offsetContainerClassName="stage"
          ref={selectedMaskRef}
        />
      )}
      <div className="selected-mask-container"></div>
    </div>
  );
};

export default ContentComponents;
