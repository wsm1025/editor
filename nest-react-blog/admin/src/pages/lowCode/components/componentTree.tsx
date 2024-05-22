import { Modal, Tree } from '@arco-design/web-react';
import { useComponets } from '../stores/components';

interface ComponentTreeProps {
  open: boolean;
  onCancel: () => void;
}

const ComponentTree = ({ open, onCancel }: ComponentTreeProps) => {
  const { components, setCurComponentId } = useComponets();

  // 选择组件后，高亮当前组件，并关闭弹框
  function componentSelect([selectedKey]: any[]) {
    setCurComponentId(selectedKey);
    onCancel && onCancel();
  }

  return (
    <Modal
      visible={open}
      title="组件树"
      onCancel={onCancel}
      unmountOnExit
      footer={null}
      style={{
        zIndex: 3,
      }}
    >
      <Tree
        fieldNames={{ title: 'name', key: 'id' }}
        treeData={components as any}
        showLine
        autoExpandParent
        onSelect={componentSelect}
      />
    </Modal>
  );
};

export default ComponentTree;
