import { create } from 'zustand';
import { getComputedById } from '../utils';

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
}

interface Action {
  /**
   * 添加组件
   * @param component 组件属性
   * @returns
   */
  addComponent: (component: Component, parentId: string) => void;
  sertCurComponentId: (id: string) => void;
}

export const useComponets = create<State & Action>((set) => ({
  components: [],
  curComponentId: '',
  addComponent: (component, parentId) =>
    set((state) => {
      console.log('addComponent', component, parentId);
      if (parentId) {
        const parentComponent = getComputedById(parentId, state.components);
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
  sertCurComponentId(componentId) {
    set({ curComponentId: componentId });
  },
}));
