import { Form, Input, Select } from '@arco-design/web-react';
import { useEffect } from 'react';
import { componentSettingMap } from '../common/data';
import { useComponets } from '../stores/components';
import SettingFormItemInput from './setting-form-item';

const Attr: React.FC = () => {
  const { curComponentId, updateComponentProps, curComponent } = useComponets();

  const [form] = Form.useForm();

  useEffect(() => {
    // 初始化表单
    form.setFieldsValue(curComponent?.props);
  }, [curComponent]);

  /**
   * 动态渲染表单元素
   * @param setting 元素配置
   * @returns
   */
  function renderFormElememt(setting: any) {
    const { type, options } = setting;

    if (type === 'select') {
      return <Select options={options} />;
    } else if (type === 'input') {
      return <SettingFormItemInput />;
    } else if (type === 'switch') {
      return <Select options={options} />;
    }
  }

  // 监听表单值变化，更新组件属性
  function valueChange(changeValues: any) {
    if (curComponentId) {
      updateComponentProps(curComponentId, changeValues);
    }
  }
  if (!curComponentId || !curComponent) return null;

  // 根据组件类型渲染表单
  return (
    <Form
      form={form}
      onValuesChange={valueChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 14 }}
    >
      <Form.Item key={curComponentId} label="id">
        <Input type="text" value={curComponentId} disabled />
      </Form.Item>
      {(componentSettingMap[curComponent.name] || []).map((setting) => {
        return (
          <Form.Item
            key={setting.name}
            field={setting.name}
            label={setting.label}
          >
            {renderFormElememt(setting)}
          </Form.Item>
        );
      })}
    </Form>
  );
};

export default Attr;
