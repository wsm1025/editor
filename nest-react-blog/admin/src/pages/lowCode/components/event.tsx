// src/editor/layouts/setting/event.tsx
import { Collapse, Input, Select, TreeSelect } from '@arco-design/web-react';
import { ItemType } from '../common/data';
import { useComponets } from '../stores/components';
import { useVariablesStore } from '../stores/commonData';

import { useState } from 'react';

const componentEventMap = {
  [ItemType.Button]: [
    {
      name: 'onClick',
      label: '点击事件',
    },
  ],
};
const componentMehodsMap = {
  [ItemType.Button]: [
    {
      name: 'startLoading',
      label: '开始加载',
    },
    {
      name: 'endLoading',
      label: '结束加载',
    },
  ],
};

const ComponentEvent = () => {
  const { curComponent, curComponentId, updateComponentProps, components } =
    useComponets();
  const { variables } = useVariablesStore();

  // 事件类型改变
  function typeChange(eventName: string, value: string) {
    if (!curComponentId) return;
    if (!value) {
      delete curComponent?.props?.[eventName];
    }
    updateComponentProps(
      curComponentId,
      !value
        ? {}
        : {
            [eventName]: {
              type: value,
              script: `(function(ctx){
                  console.log(ctx)
                })(ctx)`,
            },
          }
    );
  }

  // 消息类型改变
  function messageTypeChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          type: value,
        },
      },
    });
  }

  // 消息文本改变
  function messageTextChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        config: {
          ...curComponent?.props?.[eventName]?.config,
          text: value,
        },
      },
    });
  }

  function componentChange(name: string, value: string) {
    if (!curComponentId) return;
    setSelectedComponent(curComponent.name);
    updateComponentProps(curComponentId, {
      [name]: {
        ...curComponent?.props?.[name],
        componentId: value,
      },
    });
  }
  function methodChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        method: value,
      },
    });
  }
  function variableChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        variable: value,
      },
    });
  }
  function variableValueChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        value: value,
      },
    });
  }
  function scriptChange(eventName: string, value: string) {
    if (!curComponentId) return;
    updateComponentProps(curComponentId, {
      [eventName]: {
        ...curComponent?.props?.[eventName],
        script: value,
      },
    });
  }

  if (!curComponent) return null;

  const [selectedComponent, setSelectedComponent] = useState<string>('');

  return (
    <div className="px-[12px]">
      {(componentEventMap[curComponent.name] || []).map((setting) => {
        return (
          <Collapse key={setting.name} defaultActiveKey={setting.name}>
            <Collapse.Item
              name={setting.name}
              header={setting.label}
              key={setting.name}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div>动作：</div>
                <div>
                  <Select
                    style={{ width: 160 }}
                    options={[
                      { label: '显示提示', value: 'showMessage' },
                      { label: '组件方法', value: 'componentFunction' },
                      { label: '设置变量', value: 'variable' },
                      { label: '执行脚本', value: 'executeScript' },
                    ]}
                    allowClear
                    onChange={(value) => {
                      typeChange(setting.name, value);
                    }}
                    value={curComponent?.props?.[setting.name]?.type}
                  />
                </div>
              </div>
              {curComponent?.props?.[setting.name]?.type === 'showMessage' && (
                <div className="flex flex-col gap-[12px] mt-[12px]">
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <div>类型：</div>
                    <div>
                      <Select
                        className="w-[160px]"
                        options={[
                          { label: '成功', value: 'success' },
                          { label: '失败', value: 'error' },
                        ]}
                        onChange={(value) => {
                          messageTypeChange(setting.name, value);
                        }}
                        value={
                          curComponent?.props?.[setting.name]?.config?.type
                        }
                      />
                    </div>
                  </div>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <div>文本：</div>
                    <div>
                      <Input
                        className="w-[160px]"
                        onChange={(e) => {
                          messageTextChange(setting.name, e);
                        }}
                        value={
                          curComponent?.props?.[setting.name]?.config?.text
                        }
                      />
                    </div>
                  </div>
                </div>
              )}
              {curComponent?.props?.[setting.name]?.type ===
                'componentFunction' && (
                <div className="flex flex-col gap-[12px] mt-[12px]">
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <div>组件：</div>
                    <div>
                      <TreeSelect
                        style={{ width: 160 }}
                        fieldNames={{ title: 'name', key: 'id' }}
                        treeData={components as any}
                        value={curComponent?.props?.[setting.name]?.componentId}
                        onChange={(value) => {
                          componentChange(setting.name, value as string);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
              {componentMehodsMap[selectedComponent || ''] && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div>方法：</div>
                  <div>
                    <Select
                      style={{ width: 160 }}
                      value={curComponent?.props?.[setting.name]?.method}
                      options={componentMehodsMap[selectedComponent || ''].map(
                        (e) => ({
                          label: e.label,
                          value: e.name,
                        })
                      )}
                      onChange={(value) => {
                        methodChange(setting.name, value as string);
                      }}
                    />
                  </div>
                </div>
              )}
              {curComponent?.props?.[setting.name]?.type === 'variable' && (
                <div className="flex flex-col gap-[12px] mt-[12px]">
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <div>变量：</div>
                    <div>
                      <Select
                        style={{ width: 160 }}
                        value={curComponent?.props?.[setting.name]?.variable}
                        options={variables.map((e) => ({
                          label: e.remark,
                          value: e.name,
                        }))}
                        onChange={(value) => {
                          variableChange(setting.name, value as string);
                        }}
                        allowClear
                      />
                    </div>
                  </div>
                  {curComponent?.props?.[setting.name]?.type === 'variable' && (
                    <div>
                      <div>
                        <span>变量值：</span>
                        <Input
                          style={{ width: 160 }}
                          value={curComponent?.props?.[setting.name]?.value}
                          onChange={(e) => {
                            variableValueChange(setting.name, e);
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              {curComponent?.props?.[setting.name]?.type ===
                'executeScript' && (
                <div className="flex flex-col gap-[12px] mt-[12px]">
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 10 }}
                  >
                    <div>脚本：</div>
                    <div>
                      <Input.TextArea
                        style={{ width: 160 }}
                        value={curComponent?.props?.[setting.name]?.script}
                        onChange={(e) => {
                          scriptChange(setting.name, e);
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </Collapse.Item>
          </Collapse>
        );
      })}
    </div>
  );
};

export default ComponentEvent;
