import { IconSettings } from '@arco-design/web-react/icon';
import { Input } from '@arco-design/web-react';
import { useState } from 'react';
import SelectVariableModal from './select-variable-modal';

interface Value {
  type: 'static' | 'variable';
  value: any;
}

interface Props {
  value?: Value;
  onChange?: (value: Value) => void;
}

const SettingFormItemInput: React.FC<Props> = ({ value, onChange }) => {
  const [visible, setVisible] = useState(false);

  function valueChange(e: any) {
    onChange &&
      onChange({
        type: 'static',
        value: e,
      });
  }

  function select(record: any) {
    onChange &&
      onChange({
        type: 'variable',
        value: record.name,
      });

    setVisible(false);
  }

  return (
    <div className="flex gap-[8px] items-center">
      <Input
        disabled={value?.type === 'variable'}
        value={value?.type === 'static' || !value ? value?.value : ''}
        onChange={valueChange}
      />
      <IconSettings
        onClick={() => {
          setVisible(true);
        }}
        className="cursor-pointer"
        style={{
          fontSize: '20px',
          color: value?.type === 'variable' ? 'blue' : '',
        }}
      />
      <SelectVariableModal
        open={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onSelect={select}
      />
    </div>
  );
};

export default SettingFormItemInput;
