import { create } from 'zustand';
import { getComponentById } from '../utils';

export interface Component {
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

interface State {
  components: Component[];
  curComponentId: string;
  curComponent: Component | null;
  model: 'edit' | 'preview';
}

interface Action {
  /**
   * 添加组件
   * @param component 组件属性
   * @returns
   */
  addComponent: (component: Component, parentId: string) => void;
  setCurComponentId: (componentId: string) => void;
  updateComponentProps: (componentId: string, props: any) => void;
  setModel: (model: State['model']) => void;
}

export const useComponets = create<State & Action>((set) => ({
  components: [],
  curComponentId: '',
  curComponent: null,
  model: 'edit',
  addComponent: (component, parentId) =>
    set((state) => {
      if (parentId) {
        const parentComponent = getComponentById(parentId, state.components);
        if (parentComponent) {
          if (parentComponent?.children) {
            parentComponent?.children?.push(component);
          } else {
            parentComponent.children = [component];
          }
        }
        return { components: [...state.components] };
      }
      return { components: [...state.components, component] };
    }),
  setCurComponentId(componentId) {
    set((state) => {
      const component = getComponentById(componentId, state.components);
      return { curComponentId: componentId, curComponent: component };
    });
  },
  updateComponentProps: (componentId, props) =>
    set((state) => {
      const component = getComponentById(componentId, state.components);
      if (component) {
        if (componentId === state.curComponentId) {
          component.props = { ...component.props, ...props };
          window.components = state.components;
          return {
            curComponent: component,
            curComponentId: componentId,
            components: [...state.components],
          };
        }
        return { components: [...state.components] };
      }
      return { components: [...state.components] };
    }),
  setModel(model) {
    set(() => ({ model }));
  },
}));
