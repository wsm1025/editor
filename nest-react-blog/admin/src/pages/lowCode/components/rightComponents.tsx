import { useState } from 'react';
import { useComponets } from '../stores/components';
import ComponentAttr from './attr';
import ComponentEvent from './event';
import { Radio } from '@arco-design/web-react';

const RightComponents: React.FC = () => {
  const { curComponentId, curComponent } = useComponets();

  const [key, setKey] = useState('属性');

  if (!curComponentId || !curComponent) return null;

  return (
    <>
      <Radio.Group
        className="flex justify-center mt-2"
        type="button"
        defaultValue="属性"
        style={{ marginRight: 20, marginBottom: 20 }}
        onChange={(value) => setKey(value)}
      >
        <Radio value="属性">属性</Radio>
        <Radio value="事件">事件</Radio>
      </Radio.Group>
      {key === '属性' && <ComponentAttr />}
      {key === '事件' && <ComponentEvent />}
    </>
  );
};

export default RightComponents;
