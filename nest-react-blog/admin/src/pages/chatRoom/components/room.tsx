import {
  Card,
  Input,
  Button,
  Select,
  Message,
  Popover,
} from '@arco-design/web-react';
import { useState, useEffect, Fragment, Suspense } from 'react';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { socket } from '../socket';
import { store } from '@/store';
import getUserKey from '@/utils/userInfo';
import { messageType } from '../enum';
import '../index.css';
import { IconFaceMehFill } from '@arco-design/web-react/icon';

const Room = () => {
  const [value, setValue] = useState('');
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<any[]>([]);
  const [type, setType] = useState('text');

  function messageSend() {
    const typeEnum = messageType.find((item) => item.value === type);
    if (typeEnum.valid(value)) {
      Message.info(typeEnum.errMsg);
      return;
    }
    socket.emit('sendMessage', {
      ...getUserKey(),
      content: value,
      type,
    });
    setValue('');
  }

  const renderMessageTypeComponent = (item) => {
    item.isRender = true;
    const selectedMessageType = messageType.find(
      (ele) => ele.value === item.type
    );
    if (selectedMessageType) {
      const LazyComponent = selectedMessageType.components;
      return <LazyComponent item={item} />;
    }
    return <div>错误组件～</div>;
  };

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      isOnline(true);
      socket.emit('joinRoom', { ...getUserKey() });
    }

    function onDisconnect() {
      setIsConnected(false);
      isOnline(false);
    }

    function messageGet(message) {
      message.isMe = message.userId === getUserKey('userId');
      setMessages((prevMessages) => [...prevMessages, message]);
      const objDiv = document.getElementById('msgList');
      objDiv.scrollTop = objDiv.scrollHeight;
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('userJoinRoom', ({ message }) => {
      messageGet(message);
    });

    socket.on('getMessage', ({ message }) => {
      messageGet(message);
    });

    function isOnline(status: boolean) {
      store.dispatch({
        type: 'update-isOnline',
        payload: { isOnline: status },
      });
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);
  return (
    <Card title={`聊天室${messages.length}`}>
      <div
        style={{
          height: `calc(100vh - 200px)`,
          overflow: 'auto',
        }}
        id="msgList"
        className="pb-10"
      >
        {messages.map((item) => {
          return (
            <Fragment key={item.msgId}>
              <Suspense fallback>{renderMessageTypeComponent(item)}</Suspense>
            </Fragment>
          );
        })}
      </div>
      <div
        className="flex"
        style={{
          height: 32,
        }}
      >
        <Input.Group compact className="flex items-center">
          <Select
            value={type}
            onChange={(e) => {
              setType(e);
            }}
            defaultValue="text"
            showSearch
            style={{ width: '10%' }}
            options={messageType}
          />
          <Input
            style={{ width: '60%' }}
            value={value}
            onChange={(e) => {
              setValue(e);
            }}
            placeholder="请输入内容"
            onPressEnter={() => messageSend()}
          />
          <Popover
            content={
              <Picker
                data={data}
                onEmojiSelect={(e) => setValue(value + e.native)}
              />
            }
          >
            <IconFaceMehFill style={{ fontSize: '28px' }} className="ml-2" />
          </Popover>
        </Input.Group>

        <Button className="ml-2" type="primary" onClick={() => messageSend()}>
          发送
        </Button>
      </div>
    </Card>
  );
};

export default Room;
