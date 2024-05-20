const Link = ({ item }) => {
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
          <a
            href={item.content}
            target="_blank"
            rel="noreferrer"
            className="ml-2 text-blue-500 underline hover:text-blue-600 pointer-cursor"
          >
            {item.content}
          </a>
        </p>
      </div>
    </div>
  );
};
export default Link;
