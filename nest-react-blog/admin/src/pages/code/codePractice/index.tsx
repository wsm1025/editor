import { getCodeById, updateCode } from '@/services/code';
import { Button, Empty } from '@arco-design/web-react';
import { IconArrowLeft } from '@arco-design/web-react/icon';
import { WEditor } from '@wangtaizong/components';
import { useSafeState } from 'ahooks';
import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
const CodeEditor = () => {
  const history = useHistory();
  const [codeInfo, setCodeInfo] = useSafeState({});
  const editorRef = useRef();
  useEffect(() => {
    http();
  }, [history.location.search.split('=')[1]]);
  const http = async () => {
    const { codeInfo } = await getCodeById({
      codeId: history.location.search.split('=')[1],
    });
    setCodeInfo(codeInfo);
  };

  return (
    <>
      <div
        className="mb-4 cursor-pointer text-primary"
        onClick={() => history.goBack()}
      >
        <IconArrowLeft />
        返回
      </div>
      {codeInfo.userId ? (
        <WEditor
          editorRef={editorRef}
          files={codeInfo.code ? JSON.parse(codeInfo.code) : {}}
          type={codeInfo.type}
        >
          <div className="flex justify-end mr-5">
            <Button
              className="mb-2"
              type="primary"
              onClick={() => {
                updateCode({
                  ...codeInfo,
                  code: JSON.stringify(editorRef.current.files),
                });
              }}
            >
              更新
            </Button>
          </div>
        </WEditor>
      ) : (
        <Empty />
      )}
    </>
  );
};
export default CodeEditor;
