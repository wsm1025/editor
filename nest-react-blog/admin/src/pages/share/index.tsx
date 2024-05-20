import { getCodeByShareCode } from '@/services/code';
import { Empty, Input, Modal } from '@arco-design/web-react';
import { WEditor } from '@wangtaizong/components';
import { useSafeState } from 'ahooks';
import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
const Share = () => {
  const history = useHistory();
  const [data, setData] = useSafeState({
    codeInfo: {},
  });
  const fetchData = async () => {
    try {
      const pathParts = history.location.pathname.split('/');
      const codeId = pathParts[pathParts.length - 1]; // 获取路径中的最后一个部分作为 codeId
      if (!codeId) return;
      const result = await getCodeByShareCode(codeId);
      setData({ ...result.codeInfo, code: JSON.parse(result.codeInfo.code) });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  useEffect(() => {
    fetchData();
    return () => {
      // 在组件卸载时取消异步操作（如果需要）
    };
  }, [history.location.pathname]); // 当路径变化时重新加载数据
  const InputRef = useRef(null);

  return (
    <div className="w-full">
      {data.userId ? (
        <WEditor editorRef={{}} type={data.type} files={data.code} />
      ) : (
        <div
          className="flex justify-center items-center"
          style={{ height: '100vh' }}
        >
          <Modal
            closable={false}
            hideCancel
            visible
            title="输入分享码"
            onOk={() => {
              InputRef.current.dom.value &&
                history.replace(`/share/${InputRef.current.dom.value}`);
            }}
          >
            <Input ref={InputRef} placeholder="请输入分享码"></Input>
          </Modal>
          <Empty description="分享码无效"></Empty>
        </div>
      )}
    </div>
  );
};

export default Share;
