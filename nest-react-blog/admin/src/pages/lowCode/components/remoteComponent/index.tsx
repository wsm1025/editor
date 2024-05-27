const RemoteComponent = ({ text, id }: { text: string; id: string }) => {
  return <div data-component-id={id}>{text || '选中文本'}</div>;
};
export default RemoteComponent;
