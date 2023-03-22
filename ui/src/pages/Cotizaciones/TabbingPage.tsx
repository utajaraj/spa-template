import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Cotizar from './Cotizar';
import Partitions from './Partitions';
import PivotesAvanzados from './AdvancedPivots';
import Quotes from './Cotizaciones';





const TabbingPage = ({ ...props }) => {

  let [loadQuote, setLoadQuotes] = useState<boolean>(true)
  let [loadPartitions, setLoadPartitions] = useState<boolean>(true)
  let [loadPivots, setLoadPivots] = useState<boolean>(true)

  const checkForLoad = (key: string) => {
    if (key === "quotes") {
      setLoadQuotes(!loadQuote)
    }
    if (key === "partitions") {
      setLoadPartitions(!loadQuote)
    }
    if (key === "advancedPivots") {
      setLoadPivots(!loadQuote)
    }
  }

  const items: TabsProps['items'] = [
    {
      key: 'quote',
      label: `Cotizar`,
      children: <Cotizar />
    },
    {
      key: 'quotes',
      label: `Cotizaciones`,
      children: <Quotes loadQuote={loadQuote} />,

    },
    {
      key: 'partitions',
      label: `Partidas`,
      children: <Partitions loadPartitions={loadPartitions} />,
    },
    {
      key: 'advancedPivots',
      label: `Pivotes Avanzados`,
      children: <PivotesAvanzados loadPivots={loadPivots} />,
    },
  ];

  return (
    <div>
      <Tabs defaultActiveKey="1" items={items} onChange={checkForLoad} />
    </div>
  )
}

export default TabbingPage