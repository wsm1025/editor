import React, { useRef } from 'react';
import { Component, useComponets } from '../stores/components';
import { ComponentMap } from './componentSetting';
import { Message } from '@arco-design/web-react';

const ProdStage: React.FC = () => {
  const { components } = useComponets();
  const componentsRefs = useRef<any>({});

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
          component.props.children || renderComponents(component.children || [])
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
      }
    };
    return props;
  }

  return <div>{renderComponents(components)}</div>;
};

export default ProdStage;
