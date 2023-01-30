import React, { useEffect, useState } from 'react';
import { Table, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import { Requester } from '../../factors/Requester';
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

});


interface PartitionInterface {
  calculatedRow?: boolean
  id?: string,
  name: string,
  description: string,
  created_by: string,
  modified_by: string,
  quoteID?: number,
  categoryID?: number,
  brandID?: number,
  quantity?: number,
  cost?: number,
  factor?: number,
  amount?: number,
}

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

  const [tablePartitions, setTablePartitions] = useState<PartitionInterface[] | []>([])


  const loadTablePartitions = async () => {

    const savedQuotePartitions = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/partitions/read/mine", method: "get" }).send()

    
    setTablePartitions(savedQuotePartitions)

  }
  useEffect(() => {


    
    if (props.tabChanged === "quotes") {
      loadTablePartitions()
      
    }
  }, [props.tabChange])

  return (
    <div>
      <h1>Cotizaciones</h1>
      <Table dataSource={tablePartitions} style={{ width: "100%" }} scroll={{ x: "100%", y: "80vh" }} columns={[
        {
          key: "name",
          dataIndex: "partition_name",
          width: "100px",
          title: "Nombre"
        },
        {
          key: "description",
          dataIndex: "description",
          width: "100px",
          title: "Descripción"
        },
        {
          key: "category",
          dataIndex: "category_name",
          width: "100px",
          title: "Categoría"
        },
        {
          key: "brand",
          dataIndex: "brand_name",
          width: "100px",
          title: "Marca"
        },
        {
          key: "quantity",
          dataIndex: "quantity",
          title: "Cantidad",
          width: "92px",
        },
        {
          key: "cost",
          dataIndex: "cost",
          title: "Costo",
          width: "100px",
          render: (value) => {
            return formatter.format(Number(value))
          }
        },
        {
          key: "factor",
          dataIndex: "factor",
          title: "Factor",
          width: "75px",
          render: (value) => {
            return `${value} %`
          }
        },
        {
          key: "amount",
          dataIndex: "amount",
          title: "Monto",
          width: "100px",
          render: (value) => {
            return formatter.format(Number(value))
          }
        }
      ]} />
    </div>
  )
}

export default Cotizaciones