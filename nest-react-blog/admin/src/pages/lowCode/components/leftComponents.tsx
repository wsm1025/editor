import ComponentItem from '../common/component-item';
import { ItemType } from '../common/data';
import { useComponets } from '../stores/components';
import { uuId } from '../utils';

const LeftComponents: React.FC = () => {
  const { addComponent } = useComponets();

  const onDragEnd = (dropResult: { id: string; name: string; props: any }) => {
    addComponent(
      {
        id: uuId(),
        name: dropResult.name,
        props: dropResult.props,
      },
      dropResult.id
    );
  };

  return (
    <div className="flex p-[10px] gap-4 flex-wrap">
      <ComponentItem
        onDragEnd={onDragEnd}
        description="按钮"
        name={ItemType.Button}
      />
      <ComponentItem
        onDragEnd={onDragEnd}
        description="间距"
        name={ItemType.Space}
      />
    </div>
  );
};
export default LeftComponents;
