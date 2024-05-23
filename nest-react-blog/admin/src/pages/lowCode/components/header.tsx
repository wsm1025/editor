import { Button, Space } from '@arco-design/web-react';
import { useComponets } from '../stores/components';
import ComponentTree from './componentTree';
import { useState } from 'react';
import DefineVariable from './define-variable';

const Header: React.FC = () => {
  const { model, setModel, setCurComponentId, components } = useComponets();
  const [treeVisible, setTreeVisible] = useState(false);
  const [dataVisible, setDataVisible] = useState(false);
  return (
    <div className="flex justify-end w-[100%] px-[24px]">
      <Space>
        {model === 'edit' && (
          <Button
            type="primary"
            onClick={() => {
              setDataVisible(true);
            }}
          >
            定义变量
          </Button>
        )}
        {model === 'edit' && (
          <Button
            type="primary"
            disabled={!components.length}
            onClick={() => {
              setTreeVisible(true);
            }}
          >
            查看大纲
          </Button>
        )}
        {model === 'edit' && (
          <Button
            onClick={() => {
              setModel('preview');
              setCurComponentId(null);
            }}
            type="primary"
          >
            预览
          </Button>
        )}
        {model === 'preview' && (
          <Button
            onClick={() => {
              setModel('edit');
            }}
            type="primary"
          >
            退出预览
          </Button>
        )}
      </Space>
      <ComponentTree
        open={treeVisible}
        onCancel={() => setTreeVisible(false)}
      />
      <DefineVariable
        open={dataVisible}
        onCancel={() => setDataVisible(false)}
      />
    </div>
  );
};

export default Header;
