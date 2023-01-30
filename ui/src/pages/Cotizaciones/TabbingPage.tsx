import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Cotizar from './Cotizar';
import Cotizaciones from './Cotizaciones';





const TabbingPage = ({ ...props }) => {

  const [tabChanged, setTabChanged] = useState<string>("quote")

  const items: TabsProps['items'] = [
    {
      key: 'quote',
      label: `Cotizar`,
      children: <Cotizar />
    },
    {
      key: 'quotes',
      label: `Cotizaciones`,
      children: <Cotizaciones tabChanged={tabChanged} />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={(e) => {
        setTabChanged(e)
      }} />
    </div>
  )
}

export default TabbingPage