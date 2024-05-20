import ProModal from '@/proComponents/Modal';
import { Form, Input } from '@arco-design/web-react';
import React from 'react';
import { emailValid, phoneValid } from '@/utils/validate';
import ProUpload from '@/proComponents/Upload';
import { register, update } from '@/services/user';
import { useDispatch } from 'react-redux';
import getUserKey from '@/utils/userInfo';
const FormItem = Form.Item;
interface Props {
  onCancel: () => void;
  reload: () => void;
  userInfo: (API.User.UserInfo & { visible: Boolean }) | null;
}
function EditCategoryInfo(props: Props) {
  const { onCancel, reload, userInfo } = props;
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const onOk = async (isMy) => {
    const values = await form.validate();
    if (userInfo.userId) {
      delete userInfo.visible;
      await update({
        ...userInfo,
        ...values,
      });
      isMy &&
        dispatch({
          type: 'update-userInfo',
          payload: { userInfo: { ...userInfo, ...values } },
        });
    } else {
      await register({ ...values, password: values.userName });
    }
    onCancel();
    await reload();
  };
  return (
    <ProModal
      form={form}
      width={520}
      title={`${userInfo.userId ? '编辑' : '新增'}用户`}
      onCancel={onCancel}
      onSubmit={() => onOk(getUserKey('userId') === userInfo.userId)}
      visible
      okText={`${userInfo.userId ? '更新' : '提交'}`}
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
        initialValues={userInfo}
      >
        <FormItem
          label="用户名称"
          field="userName"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input
            maxLength={10}
            disabled={Boolean(userInfo.userId)}
            allowClear
            autoComplete="off"
            value={userInfo?.userName}
            placeholder="请输入"
          />
        </FormItem>
        <FormItem
          label="昵称"
          field="nickName"
          rules={[{ required: true, message: '请输入昵称' }]}
        >
          <Input
            maxLength={10}
            allowClear
            value={userInfo?.nickName}
            placeholder="请输入"
          />
        </FormItem>
        <FormItem
          label="电子邮箱"
          field="email"
          rules={[
            {
              required: true,
              validator(value = '', cb) {
                if (!emailValid(value)) return cb('请输入正确的邮箱地址');
                return cb();
              },
            },
          ]}
        >
          <Input
            maxLength={20}
            allowClear
            autoComplete="off"
            value={userInfo?.email}
            placeholder="请输入"
          />
        </FormItem>
        <FormItem
          label="手机号码"
          field="phone"
          rules={[
            {
              validator(value, cb) {
                if (value && !phoneValid(value))
                  return cb('请输入正确的手机号码');
                return cb();
              },
            },
          ]}
        >
          <Input
            maxLength={11}
            allowClear
            autoComplete="off"
            value={userInfo?.phone}
            placeholder="请输入"
          />
        </FormItem>
        <FormItem
          label="头像"
          field="avatar"
          rules={[{ required: true, message: '请上传头像' }]}
        >
          <ProUpload value={userInfo.avatar} />
        </FormItem>
      </Form>
    </ProModal>
  );
}

export default React.memo(EditCategoryInfo);
