import React from 'react';
import { Button } from '@arco-design/web-react';
import Space from './space';

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
      component.props.children || renderComponents(component.children || [])
    );
  });
}

export { renderComponents, ComponentMap };
