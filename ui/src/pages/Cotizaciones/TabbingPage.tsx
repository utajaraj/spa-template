import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Cotizar from './Cotizar';
import Cotizaciones from './Cotizaciones';



const items: TabsProps['items'] = [
  {
    key: '1',
    label: `Cotizar`,
    children: <Cotizar />
  },
  {
    key: '2',
    label: `Cotizaciones`,
    children: <Cotizaciones />
  },
];


const TabbingPage = ({ ...props }) => {
  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}

export default TabbingPage