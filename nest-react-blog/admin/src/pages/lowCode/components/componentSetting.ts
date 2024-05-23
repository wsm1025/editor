import React from 'react';
import Space from './space';
import Button from './button';
import { useVariablesStore } from '../stores/commonData';

interface Component {
  /**
   * 组件唯一标识
   */
  id: string;
  /**
   * 组件名称
   */
  name: string;
  /**
   * 组件属性
   */
  props: any;
  /**
   * 子组件
   */
  children?: Component[];
}

const ComponentMap: { [key: string]: any } = {
  Button,
  Space,
};

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

          prev[key] = `\${${variableName}}`;
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
    return React.createElement(
      ComponentMap[component.name],
      {
        ...component.props,
        key: component.id,
        id: component.id,
        'data-component-id': component.id,
      },
      propsFormat(component) || renderComponents(component.children || [])
    );
  });
}

export { renderComponents, ComponentMap };
