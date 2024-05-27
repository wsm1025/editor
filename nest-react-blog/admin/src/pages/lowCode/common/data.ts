export const ItemType = {
  Button: 'Button',
  Space: 'Space',
  RemoteComponent: 'RemoteComponent',
};
export const componentSettingMap = {
  [ItemType.Button]: [
    {
      name: 'type',
      label: '按钮类型',
      type: 'select',
      options: [
        { label: '主按钮', value: 'primary' },
        { label: '次按钮', value: 'secondary' },
        { label: '文本按钮', value: 'text' },
      ],
    },
    {
      name: 'children',
      label: '文本',
      type: 'input',
    },
  ],
  [ItemType.Space]: [
    {
      name: 'size',
      label: '间距大小',
      type: 'select',
      options: [
        { label: '大', value: 'large' },
        { label: '中', value: 'medium' },
        { label: '小', value: 'small' },
      ],
    },
  ],
  [ItemType.RemoteComponent]: [
    {
      name: 'text',
      label: '文本',
      type: 'input',
    },
  ],
};
