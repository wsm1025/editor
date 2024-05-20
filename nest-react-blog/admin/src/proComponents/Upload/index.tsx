import { Message, Spin, Upload } from '@arco-design/web-react';
import { UploadItem } from '@arco-design/web-react/es/Upload';
import { IconPlus } from '@arco-design/web-react/icon';
import { useState } from 'react';

const env = import.meta.env as any;
interface Props {
  onChange?: (value: string | undefined) => void;
  value?: string;
  size?: number;
  type?: 'png' | 'jpg' | 'jpeg' | 'gif';
}
function ProUpload(props: Props) {
  const { onChange, value, size = 3 } = props;
  const [loading, setLoading] = useState(false);

  const handleChange = (fileList: UploadItem[], file: UploadItem) => {
    const { response, status } = file;
    if (status === 'uploading') {
      setLoading(true);
      return;
    }
    if (status === 'error') {
      setLoading(false);
      return;
    }
    const responseInfo = response as {
      code: number;
      msg: string;
      data: {
        path: string;
      };
    };
    if (status === 'done') {
      if (responseInfo.code === 200) {
        setLoading(false);
        const url = responseInfo?.data?.path;
        onChange(url);
      } else {
        Message.error(responseInfo.msg);
      }
    }
  };
  const beforeUpload = (fileList: UploadItem) => {
    if (fileList.size > 1024 * 1024 * size) {
      Message.error(`文件大小不能超过${size}M`);
      return Promise.reject();
    } else if (fileList.type.indexOf('image') === -1) {
      Message.error('文件类型错误');
      return Promise.reject();
    }
  };

  return (
    <Upload
      onChange={handleChange}
      showUploadList={false}
      action={`${env.VITE_BASE_URL}/file/upload`}
      beforeUpload={beforeUpload}
    >
      <div className="w-200px h-100px">
        {value ? (
          <img
            src={`${env.VITE_PREFIX}${value}`}
            alt="img"
            style={{
              objectFit: 'cover',
              borderRadius: '50px',
              width: 100,
              height: 100,
            }}
          />
        ) : (
          <Spin loading={loading} dot>
            <div
              className="w-200px h-100px flex items-center justify-center"
              style={{ border: '1px solid #e7e7e7' }}
            >
              <IconPlus />
            </div>
          </Spin>
        )}
      </div>
    </Upload>
  );
}
export default ProUpload;
