import React from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';



const items: TabsProps['items'] = [
  {
    key: '1',
    label: `Cotizar`,
    children: `Cotizar`,
  },
  {
    key: '2',
    label: `Cotizaciones`,
    children: `Cotizaciones`,
  },
];


const Cotizaciones = ({ ...props }) => {
  return (
    <div>
      <h1>Cotizaciones</h1>
    </div>
  )
}

export default Cotizaciones