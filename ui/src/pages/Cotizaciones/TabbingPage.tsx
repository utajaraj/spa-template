import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Cotizar from './Cotizar';
import Partitions from './Partitions';
import PivotesAvanzados from './AdvancedPivots';
import Quotes from './Cotizaciones';





const TabbingPage = ({ ...props }) => {


  const items: TabsProps['items'] = [
    {
      key: 'quote',
      label: `Cotizar`,
      children: <Cotizar />
    },
      {
      key: 'quotes',
      label: `Cotizaciones`,
      children: <Quotes />,
    },
    {
      key: 'partitions',
      label: `Partidas`,
      children: <Partitions />,
    },
    {
      key: 'advancedPivots',
      label: `Pivotes Avanzados`,
      children: <PivotesAvanzados  />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} />
    </div>
  )
}

export default TabbingPage