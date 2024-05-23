import React, { useRef } from 'react';
import { Component, useComponets } from '../stores/components';
import { ComponentMap } from './componentSetting';
import { Message } from '@arco-design/web-react';
import { useVariablesStore } from '../stores/commonData';
import { usePageDataStore } from '../stores/page-data';

const ProdStage: React.FC = () => {
  const { components } = useComponets();
  const componentsRefs = useRef<any>({});
  const { variables } = useVariablesStore();
  const { setData, data } = usePageDataStore();

  function propsFormat(component: Component) {
    const props = Object.keys(component.props).reduce(
      (prev, key) => {
        if (typeof component.props[key] === 'object') {
          // 静态属性 直接赋值
          if (component.props[key].type === 'static') {
            prev[key] = component.props[key].value;
          } else if (component.props[key].type === 'variable') {
            //  变量 从变量池中获取
            const variableName = component.props[key].value;
            const variablesCur = variables.find((i) => i.name === variableName);
            prev[key] = data[variableName] || variablesCur?.defaultValue;
          }
        } else {
          prev[key] = component.props[key];
        }
        return prev;
      },
      { children: {} }
    );
    return props.children;
  }

  function renderComponents(components: Component[]): React.ReactNode {
    return components.map((component: Component) => {
      if (!ComponentMap[component.name]) {
        return null;
      }

      if (ComponentMap[component.name]) {
        return React.createElement(
          ComponentMap[component.name],
          {
            key: component.id,
            id: component.id,
            ...component.props,
            // 挂载自身数据
            ref: (ref: any) => (componentsRefs.current[component.id] = ref),
            ...handleEvent(component),
          },
          propsFormat(component) || renderComponents(component.children || [])
        );
      }

      return null;
    });
  }
  // 处理事件
  function handleEvent(component: Component) {
    const Cprops = component.props;
    const props: any = {};
    props.onClick = () => {
      if (Cprops.onClick?.type === 'showMessage') {
        Message[Cprops.onClick.config.type](Cprops?.onClick.config.text);
      } else if (Cprops.onClick?.type === 'componentFunction') {
        const component = componentsRefs.current[Cprops.onClick.componentId];
        if (component) component[Cprops.onClick.method]?.();
      } else if (Cprops.onClick?.type === 'variable') {
        const { variable, value } = Cprops.onClick;
        if (variable && value) {
          setData(variable, value);
        }
      }
    };
    return props;
  }

  return <div>{renderComponents(components)}</div>;
};

export default ProdStage;
