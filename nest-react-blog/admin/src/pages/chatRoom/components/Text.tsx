const Text = ({ item }) => {
  return (
    <div
      key={item.msgId}
      className={`flex ${item.isMe ? 'justify-end' : 'justify-start'}`}
    >
      <div>
        <span>{item.time}</span>
        <span className="ml-2">{item.userName}</span>
        <p
          className={`flex ${
            item.isMe ? 'justify-end bg-blue-100' : 'justify-start bg-red-100'
          } p-2 rounded-md`}
          style={{
            wordBreak: 'break-all',
            width: 'fit-content',
          }}
        >
          {item.content}
        </p>
      </div>
    </div>
  );
};
export default Text;
