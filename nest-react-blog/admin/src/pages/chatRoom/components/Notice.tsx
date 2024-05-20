const Notice = ({ item }) => {
  return (
    <div className="flex justify-center mt-2 mb-2" key={item.msgId}>
      {item.content}
    </div>
  );
};

export default Notice;
