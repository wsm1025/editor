import { Component } from '../stores/components';

const uuId = (num = 6) => {
  const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const arr = Array.from(str);
  let res = '';
  for (let i = 0; i < num; i++) {
    const index = Math.floor(Math.random() * arr.length);
    res += arr[index];
  }
  return res;
};

const getComponentById = (
  id: string,
  components: Component[]
): Component | null => {
  const findComponent = (components, id) => {
    for (const component of components) {
      if (component.id === id) return component;
      if (Array.isArray(component.children) && component.children.length > 0) {
        const childComponent = findComponent(component.children, id);
        if (childComponent) return childComponent;
      }
    }
  };

  return findComponent(components, id) ?? null;
};
export { uuId, getComponentById };
