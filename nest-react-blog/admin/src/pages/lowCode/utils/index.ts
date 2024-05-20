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

const getComputedById = (
  id: string,
  components: Component[]
): Component | null => {
  console.log(id, components, '嵌套组件');
  for (const component of components) {
    if (component.id === id) return component;
    if (component.children?.length > 0) {
      const childComponent = getComputedById(id, component.children);
      if (childComponent !== null) return childComponent;
    }
  }
};
export { uuId, getComputedById };
