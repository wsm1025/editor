import React, { useRef } from 'react';
import styles from './style/index.module.less';
import ProTable, { ProTableInstance, ProColumns } from '@/proComponents/Table';
import { deleteUser, getUserList } from '@/services/user';
import { Button, Form, Image, Popconfirm } from '@arco-design/web-react';
import dayjs from 'dayjs';
import { useSafeState } from 'ahooks';
import UserInfoForm from './components/UserInfoForm.tsx';
import { useSelector } from 'react-redux';
import { GlobalState } from '@/store';
import { IconExclamationCircleFill } from '@arco-design/web-react/icon';

function User() {
  const env = import.meta.env as any;
  const tableRef = useRef<ProTableInstance>(null);
  const [form] = Form.useForm();

  const userState = useSelector((state: GlobalState) => state.userInfo);
  const [userInfo, setUserInfo] = useSafeState<
    (API.User.UserInfo & { visible: Boolean }) | null
  >({
    visible: false,
    userName: '',
    userId: '',
    createTime: '',
    updateTime: '',
    role: 'admin',
    nickName: '',
    email: '',
    phone: '',
    avatar: '',
  });
  const loadList = async (param: API.PageParams) => {
    const res = await getUserList({
      ...param,
    });
    return {
      total: res.total,
      list: res.userList,
    };
  };
  const columns: ProColumns<API.User.UserInfo> = [
    {
      title: '用户名',
      dataIndex: 'userName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      width: 100,
      ellipsis: true,
    },
    {
      title: '电子邮箱',
      dataIndex: 'email',
      width: 120,
      ellipsis: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      width: 100,
      ellipsis: true,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      width: 100,
      ellipsis: true,
      render: (_, record) => {
        return (
          <Image
            src={env.VITE_PREFIX + record.avatar}
            alt=""
            style={{ width: 50, height: 50 }}
          />
        );
      },
    },
    {
      title: '角色',
      dataIndex: 'role',
      width: 100,
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 180,
      ellipsis: true,
      render: (_, record) => {
        return (
          <span>
            {record.createTime
              ? dayjs(record.createTime).format('YYYY-MM-DD HH:mm:ss')
              : '-'}
          </span>
        );
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
      ellipsis: true,
      render: (_, record) => {
        return (
          <span>
            {record.updateTime
              ? dayjs(record.updateTime).format('YYYY-MM-DD HH:mm:ss')
              : '-'}
          </span>
        );
      },
    },
    {
      title: '操作',
      dataIndex: 'op',
      fixed: 'right',
      width: 160,
      render: (_, record) => (
        <>
          <Button onClick={() => showUserInfo(record)} type="primary">
            编辑
          </Button>
          {userState.role === 'admin' ? (
            <Popconfirm
              icon={<IconExclamationCircleFill style={{ color: '#0057fe' }} />}
              position="tr"
              focusLock
              title="确认删除该用户?"
              okButtonProps={{
                status: 'danger',
              }}
              okText="删除"
              cancelText="取消"
              onOk={() => {
                deleteRecord(record);
              }}
            >
              <Button className={'ml-2'} type="primary" status="danger">
                删除
              </Button>
            </Popconfirm>
          ) : (
            ''
          )}
        </>
      ),
    },
  ];
  function showUserInfo(record = userInfo, visible = true) {
    setUserInfo({
      ...record,
      visible,
    });
  }

  async function deleteRecord({ userId }) {
    await deleteUser({ userId });
    tableRef.current.reload();
  }
  return (
    <div className={styles.container}>
      <ProTable
        form={form}
        tableRef={tableRef}
        columns={columns}
        request={loadList}
        rowKey="userId"
        toolBarRender={
          <React.Fragment>
            <Button
              style={{
                marginBottom: 10,
              }}
              onClick={() => showUserInfo({})}
              type="primary"
            >
              新增用户
            </Button>
          </React.Fragment>
        }
      />

      {userInfo.visible && (
        <UserInfoForm
          userInfo={userInfo}
          reload={tableRef.current.reload}
          onCancel={() => showUserInfo(userInfo, false)}
        />
      )}
    </div>
  );
}

export default User;
