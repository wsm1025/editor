import { create } from 'zustand';

export interface Variable {
  /**
   * 变量名
   */
  name: string;
  /**
   * 默认值
   */
  defaultValue: string;
  type: 'STRING';
  /**
   * 备注
   */
  remark: string;
}

interface State {
  variables: Variable[];
}

interface Action {
  /**
   * 添加组件
   * @param component 组件属性
   * @param parentId 上级组件id
   * @returns
   */
  setVariables: (variables: Variable[]) => void;
}

export const useVariablesStore = create<State & Action>((set) => ({
  variables: [
    {
      name: '变量1',
      defaultValue: '1',
      type: 'STRING',
      remark: '变量1',
    },
  ],
  setVariables: (variables) => set({ variables }),
}));
