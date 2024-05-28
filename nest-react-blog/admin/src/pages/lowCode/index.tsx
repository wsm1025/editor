import { Card } from '@arco-design/web-react';
import style from './style/index.module.less';
import { Allotment } from 'allotment';
import 'allotment/dist/style.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Header from './components/header';
import LeftComponents from './components/leftComponents';
import ContentComponents from './components/contentComponents';
import RightComponents from './components/rightComponents';
import Prod from './components/prod';

import { useComponets } from './stores/components';
const LowCode = () => {
  const { model } = useComponets();
  return (
    <Card title="低代码">
      <div className={style.header}>
        <Header />
      </div>
      <DndProvider backend={HTML5Backend}>
        {model === 'edit' ? (
          <div className={style.card}>
            <Allotment>
              <Allotment.Pane
                className={style.left}
                preferredSize={200}
                maxSize={300}
                minSize={200}
              >
                <LeftComponents />
              </Allotment.Pane>
              <Allotment.Pane className={style.content}>
                <ContentComponents />
              </Allotment.Pane>
              <Allotment.Pane
                className={style.right}
                preferredSize={300}
                maxSize={300}
                minSize={270}
              >
                <RightComponents />
              </Allotment.Pane>
            </Allotment>
          </div>
        ) : (
          <Prod />
        )}
      </DndProvider>
    </Card>
  );
};

export default LowCode;
