import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Space,
} from '@arco-design/web-react';
import React, { useEffect } from 'react';
import { type Variable, useVariablesStore } from '../stores/commonData';
import { IconDelete, IconPlus } from '@arco-design/web-react/icon';

interface Props {
  open: boolean;
  onCancel: () => void;
}

const DefineVariable: React.FC<Props> = ({ open, onCancel }) => {
  const [form] = Form.useForm();
  const { setVariables, variables } = useVariablesStore();

  function onFinish(values: { variables: Variable[] }) {
    setVariables(values.variables);
    onCancel && onCancel();
  }

  useEffect(() => {
    if (open) {
      form.setFieldsValue({ variables });
    }
  }, [open]);

  return (
    <Modal
      visible={open}
      title="定义变量"
      onCancel={onCancel}
      unmountOnExit
      onOk={() => {
        form.submit();
      }}
      style={{
        width: 800,
      }}
      okText="确定"
      cancelText="取消"
    >
      <Form
        onSubmit={onFinish}
        autoComplete="off"
        className="py-[20px]"
        form={form}
        initialValues={{ variables }}
        style={{
          width: 950,
        }}
      >
        <Form.List field="variables" noStyle>
          {(fields, { add, remove }) => {
            return (
              <>
                {fields.map((item, index) => {
                  return (
                    <div key={item.key}>
                      <Form.Item>
                        <Space
                          style={{
                            display: 'flex',
                            marginBottom: 8,
                          }}
                        >
                          <Form.Item
                            field={item.field + '.name'}
                            rules={[
                              { required: true, message: '变量名不能为空' },
                            ]}
                            noStyle
                          >
                            <Input placeholder="变量名" />
                          </Form.Item>
                          <Form.Item
                            field={item.field + '.type'}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Select
                              style={{ width: 140 }}
                              options={[{ label: '字符串', value: 'STRING' }]}
                              placeholder="类型"
                            />
                          </Form.Item>
                          <Form.Item
                            field={item.field + '.defaultValue'}
                            noStyle
                          >
                            <Input placeholder="默认值" />
                          </Form.Item>
                          <Form.Item
                            field={item.field + '.remark'}
                            rules={[{ required: true }]}
                            noStyle
                          >
                            <Input placeholder="备注" />
                          </Form.Item>
                          <Button
                            icon={<IconDelete />}
                            shape="circle"
                            status="danger"
                            onClick={() => remove(index)}
                          ></Button>
                        </Space>
                      </Form.Item>
                    </div>
                  );
                })}
                <Form.Item>
                  <Button
                    type="dashed"
                    long
                    onClick={() => {
                      add({
                        type: 'STRING',
                      });
                    }}
                    icon={<IconPlus />}
                  >
                    添加变量
                  </Button>
                </Form.Item>
              </>
            );
          }}
        </Form.List>
      </Form>
    </Modal>
  );
};

export default DefineVariable;
