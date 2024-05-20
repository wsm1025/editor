import { Button, Card } from '@arco-design/web-react';
import { useContext, createContext, useEffect, useState } from 'react';
const LowCode = () => {
  // useState
  const [count, setCount] = useState(1);
  let [car, setCar] = useState({ name: '保时捷', price: 45 });
  function clickHandler() {
    setCount((prev) => prev + 1);
  }
  function personClick() {
    car = JSON.parse(JSON.stringify(car));
    setCar({
      ...car,
      name: car.name === '玛萨拉蒂' ? '保时捷' : '玛萨拉蒂',
    });
  }

  // useEffect
  const [a, setA] = useState(0); //定义变量a，并且默认值为0
  useEffect(() => {
    //无论是第一次挂载还是以后每次组件更新，修改网页标题的执行代码只需要在这里写一次即可
    document.title = `${a} - ${Math.floor(Math.random() * 100)}`;
  });
  const clickAbtHandler = () => {
    setA(a + 1);
  };

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     setA((a) => a + 1);
  //   }, 1000);
  //   return () => {
  //     clearInterval(timer);
  //   };
  // }, []); //此处第2个参数为[]，告知React以后该组件任何更新引发的重新渲染都与此useEffect无关

  useEffect(() => {
    console.log(car);
  }, [car]); // car 的引用地址改变了

  // useContext
  const UserContext = createContext(car);
  function ChildComponent() {
    const global1 = useContext(UserContext); //获取共享数据对象的value值
    //忘掉<GlobalContext.Consumer>标签，直接用global获取需要的值
    return (
      <div>
        {global1.name} - {global1.price}
      </div>
    );
  }
  return (
    <UserContext.Provider value={car}>
      <Card title="低代码平台">
        <div className="mb-2">
          <div>useState使用</div>
          <Button type="primary" onClick={clickHandler}>
            {count}
          </Button>
          <Button className="ml-2" type="primary" onClick={personClick}>
            {car.name}
          </Button>
          <Button
            className="ml-2"
            type="primary"
            onClick={() =>
              setCar({
                ...car,
                price: ++car.price,
              })
            }
          >
            涨价啦
          </Button>
        </div>
        <hr />
        <div className="mb-2">
          <div>useEffect使用</div>
          <Button type="primary" onClick={clickAbtHandler}>
            useEffect使用
          </Button>
        </div>
        <div className="mb-2">
          <div>useContext使用</div>
          <ChildComponent />
        </div>
      </Card>
    </UserContext.Provider>
  );
};
export default LowCode;
