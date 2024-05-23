import { Modal, Table } from '@arco-design/web-react';
import { useVariablesStore } from '../stores/commonData';

interface Props {
  open: boolean;
  onCancel: () => void;
  onSelect: (record: any) => void;
}

const columns = [
  {
    title: '变量名',
    dataIndex: 'name',
  },
  {
    title: '变量值',
    dataIndex: 'defaultValue',
  },
  {
    title: '备注',
    dataIndex: 'remark',
  },
];

const SelectVariableModal: React.FC<Props> = ({ open, onCancel, onSelect }) => {
  const { variables } = useVariablesStore();

  function rowSelect(record: any) {
    onSelect(record);
  }

  return (
    <Modal
      visible={open}
      onCancel={onCancel}
      title="选择变量"
      okText="确定"
      cancelText="取消"
    >
      <Table
        onRow={(record) => ({
          onClick: () => {
            rowSelect(record);
          },
        })}
        columns={columns}
        rowKey={(record) => record.name}
        data={variables}
      />
    </Modal>
  );
};

export default SelectVariableModal;
