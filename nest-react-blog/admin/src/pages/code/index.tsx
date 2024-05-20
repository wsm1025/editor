import {
  deleteCode,
  getCodeByUserId,
  postCode,
  shareCode,
  updateCode,
} from '@/services/code';
import getUserKey from '@/utils/userInfo';
import {
  Button,
  Card,
  Divider,
  Empty,
  Form,
  Input,
  Message,
  Pagination,
  Popconfirm,
  Select,
} from '@arco-design/web-react';
import Col from '@arco-design/web-react/es/Grid/col';
import Row from '@arco-design/web-react/es/Grid/row';
import {
  IconCode,
  IconDelete,
  IconEdit,
  IconShareAlt,
} from '@arco-design/web-react/icon';
import { useSafeState } from 'ahooks';
import { useEffect } from 'react';
import dayjs from 'dayjs';
import ProModal from '@/proComponents/Modal';
import FormItem from '@arco-design/web-react/es/Form/form-item';
import { useHistory } from 'react-router-dom';
import { CodeTypeMap } from './enum';
import copy from 'copy-to-clipboard';

const Code = () => {
  const [data, setData] = useSafeState({
    codeList: [],
    total: 0,
  });
  const [visible, setVisible] = useSafeState(false);
  const [setting, setSetting] = useSafeState({});
  const history = useHistory();
  const [params, setParams] = useSafeState({
    page: 1,
    size: 6,
    title: '',
    type: undefined,
  });
  const [form] = Form.useForm();
  const getCodeByUserIdAction = async () => {
    const data = await getCodeByUserId({
      ...params,
      userId: getUserKey('userId'),
    });
    setData(data);
  };
  useEffect(() => {
    getCodeByUserIdAction();
  }, [params]);
  const onOk = async () => {
    const values = await form.validate();
    if (setting.model == 'add') {
      let { codeId } = await postCode({
        ...values,
      });
      history.push(`/code/codePractice?codeId=${codeId}`);
      return;
    }
    await updateCode({
      ...values,
      codeId: setting.codeId,
    });
    await getCodeByUserIdAction();
    setVisible(false);
  };
  const shareCodeAction = async (codeId: string) => {
    await shareCode({
      codeId,
    });
    await getCodeByUserIdAction();
  };
  return (
    <div>
      <Card title="代码列表">
        <Button
          type="primary"
          onClick={() => {
            setSetting({
              model: 'add',
              type: 'vite-vue',
              description: '',
              title: '',
            });
            setVisible(true);
          }}
        >
          创建代码
        </Button>
        <Select
          className="ml-10"
          addBefore="搜索代码类型"
          placeholder="请选择"
          style={{ width: 300 }}
          value={params.type}
          onChange={(value) => {
            value && setParams({ ...params, type: value });
          }}
          onClear={() => {
            setParams({ ...params, type: undefined });
          }}
          allowClear
          options={Object.values(CodeTypeMap)}
        />
        <Input
          className="ml-10"
          style={{ width: 300 }}
          value={params.title}
          onChange={(e) => {
            setParams({ ...params, title: e, page: 1 });
          }}
          addBefore="搜索标题"
          placeholder="请输入"
          maxLength={20}
        />
      </Card>
      <Card>
        <Row
          className="ml-5"
          justify="start"
          style={{
            minHeight: 'calc(100vh - 300px)',
          }}
        >
          {data.codeList.length ? (
            data.codeList.map((e, i) => (
              <Col span={8} key={i}>
                <Card
                  className="mr-5 mb-2"
                  title={e.title}
                  hoverable
                  extra={
                    <>
                      {e.shareId ? (
                        <span className="cursor-pointer mr-3">
                          <Popconfirm
                            focusLock
                            title="操作"
                            onOk={() => {
                              copy(location.origin + '/share/' + e.shareId);
                              Message.success('复制成功');
                            }}
                            onCancel={() => {
                              shareCodeAction(e.codeId);
                            }}
                            okText="复制"
                            cancelText="取消分享"
                          >
                            已分享
                          </Popconfirm>
                        </span>
                      ) : (
                        <span
                          title="分享"
                          className="cursor-pointer mr-3"
                          onClick={() => {
                            shareCodeAction(e.codeId);
                          }}
                        >
                          <IconShareAlt />
                        </span>
                      )}

                      <span
                        title="编辑类型"
                        className="cursor-pointer"
                        onClick={async () => {
                          setVisible(true);
                          setSetting(e);
                        }}
                      >
                        <IconEdit />
                      </span>
                      <span
                        title="show me code"
                        className="cursor-pointer ml-3"
                      >
                        <IconCode
                          onClick={() =>
                            history.push(
                              `/code/codePractice?codeId=${e.codeId}`
                            )
                          }
                        />
                      </span>
                    </>
                  }
                  actions={[
                    <span
                      key={1}
                      title={'作者' + e.userName}
                      className="truncate"
                      style={{ maxWidth: 60 }}
                    >
                      {e.userName}
                    </span>,
                    <Divider type="vertical" key={2} />,
                    <span key={3} title="类型" className="type">
                      {e.type}
                    </span>,
                    <Divider key={4} type="vertical" />,
                    <span key={5} title="删除" className="delete text-red-400">
                      <Popconfirm
                        focusLock
                        title="删除"
                        content="确定删除该代码片段?"
                        onOk={async () => {
                          await deleteCode({ codeId: e.codeId });
                          getCodeByUserIdAction();
                        }}
                      >
                        <IconDelete />
                      </Popconfirm>
                    </span>,
                  ]}
                >
                  <span className="break-words">{e.description}</span>
                  <div className="mt-2 text-xs">
                    创建时间:{' '}
                    {dayjs(e.createTime).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                  <div className="mt-2 text-xs">
                    更新时间:
                    {dayjs(e.updateTime).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </Card>
              </Col>
            ))
          ) : (
            <Empty />
          )}
        </Row>
        {data.codeList.length ? (
          <Pagination
            className="ml-5 pb-10"
            simple
            defaultPageSize={params.size}
            defaultCurrent={params.page}
            total={data.total}
            onChange={(page, size) => {
              setParams({ ...params, page, size });
            }}
          />
        ) : null}
      </Card>
      <ProModal
        form={form}
        width={520}
        title={setting.model ? '新增代码片段' : '编辑代码配置'}
        onCancel={() => {
          setSetting({});
          setVisible(false);
        }}
        onSubmit={() => onOk()}
        visible={visible}
        okText={setting.model ? '新增' : '更新'}
        cancelText="取消"
      >
        <Form
          form={form}
          labelCol={{
            flex: '100px',
          }}
          wrapperCol={{
            flex: 'auto',
          }}
          initialValues={setting}
        >
          <FormItem
            label="标题"
            field="title"
            rules={[{ required: true, message: '请输入标题', maxLength: 20 }]}
          >
            <Input
              maxLength={10}
              allowClear
              autoComplete="off"
              value={setting.title}
              placeholder="请输入"
            />
          </FormItem>
          <FormItem
            label="描述"
            field="description"
            rules={[{ required: true, message: '请输入描述', maxLength: 100 }]}
          >
            <Input.TextArea
              maxLength={100}
              autoComplete="off"
              value={setting.description}
              placeholder="请输入"
            />
          </FormItem>
          {setting.model === 'add' ? (
            <FormItem
              id="type"
              label="代码类型"
              field="type"
              rules={[{ required: true, message: '请选择代码类型' }]}
            >
              <Select
                options={Object.values(CodeTypeMap)}
                placeholder="请选择代码类型"
                style={{
                  zIndex: 10000,
                }}
              />
            </FormItem>
          ) : null}
        </Form>
      </ProModal>
    </div>
  );
};
export default Code;
