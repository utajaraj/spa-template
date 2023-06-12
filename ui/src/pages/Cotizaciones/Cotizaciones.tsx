import { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';
import { notify } from '../../factors/notify';

import { DownOutlined } from '@ant-design/icons';
import { Requester } from '../../factors/Requester';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

import type { TableColumnsType } from 'antd';
// Core viewer
import { Viewer, Worker } from '@react-pdf-viewer/core';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import { TextSearchFilter } from '../../factors/Filters/TextSearchFilter';
import { NumberRangeFilter } from '../../factors/Filters/NumberRangeFilter';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

});
interface PartitionInterface {

  id?: string,
  description?: string,
  unit?: string,
  quoteID?: string,
  quantity?: string,
  categoryID?: string,
  brandID?: string,
  cost?: string,
  factor?: string,
  amount?: string,
  created_by?: string,
  modified_by?: string,
  created_at?: string,
  modified_at?: string,
  category_name?: string,
  brand_name?: string,
  reference?: string,
  currency?: string,
  buyerID?: string,
  agentID?: string,
  clientID?: string,
  emitted?: string,
  expiration_date?: string,
  user_name?: string,
  user_middle_name?: string,
  user_last_name?: string,
  buyer_name?: string,
  buyer_last_name?: string,
  client_name?: string,
  agent?: string,
  profit?: string,
  total?: string,
  client?: string,

}

const Quotes = ({ ...props }) => {

  const [tablePartitions, setTablePartitions] = useState<PartitionInterface[] | []>([])

  const [loadingQuotes, setLoadingQuotes] = useState<boolean>(true)

  const loadTablePartitions = async () => {

    setLoadingQuotes(true)

    const savedQuotePartitions = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/quotes/read/total", method: "get" }).send()

    setLoadingQuotes(false)

    setTablePartitions(savedQuotePartitions)

  }

  useEffect(() => {
    loadTablePartitions()
  }, [props.loadQuote])

  type PartitionKey = keyof PartitionInterface;


  const [xPos, setXPos] = useState<string>("")
  const [yPos, setYPos] = useState<string>("")

  const [selectedRow, setSelectedRow] = useState<PartitionInterface | {}>({})
  const [visibleContextMenu, setVisibleContextMenu] = useState<boolean>(false)
  const [viewQuoteLink, setViewQuoteLink] = useState<any>(null)
  const [showQuoteView, setShowQuoteView] = useState<boolean>(false)

  const key = 'updatable';
  const downloadQuote = async (brands: boolean) => {
    notify("success", "Generado cotización")

    try {
      const { quoteID, reference }: any = selectedRow

      const sendQuote = await new Requester({ url: import.meta.env.VITE_APP_APIURL + `${brands ? "/quotes/update/submit/brands" : "/quotes/update/submit"}`, method: "patch", body: { id: quoteID } }).send()

      if (sendQuote.status) {

        const pdfBinary = sendQuote.data.data

        const data = new ArrayBuffer(pdfBinary.length);

        const view = new Uint8Array(data);

        for (let i = 0; i < pdfBinary.length; ++i) {
          view[i] = pdfBinary[i];
        }


        // create the blob object with content-type "application/pdf"               
        var blob = new Blob([view], { type: "application/pdf" });
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `${reference}.pdf`
        link.click()
        link.remove();  //afterwards we remove the element again  


        notify("success", "Cotización generada", "La descarga iniciara automaticamente")


      } else {

        notify("error", sendQuote.message)

      }


    } catch (error) {

      notify("error", "Error al generar cotización")

    }

  }

  const viewQuote = async (brands: boolean) => {
    notify("success", "Generando cotización")

    try {
      const { quoteID, reference }: any = selectedRow

      const sendQuote = await new Requester({ url: import.meta.env.VITE_APP_APIURL + `${brands ? "/quotes/update/submit/brands" : "/quotes/update/submit"}`, method: "patch", body: { id: quoteID } }).send()

      if (sendQuote.status) {

        const pdfBinary = sendQuote.data.data

        const data = new ArrayBuffer(pdfBinary.length);

        const view = new Uint8Array(data);

        for (let i = 0; i < pdfBinary.length; ++i) {
          view[i] = pdfBinary[i];
        }


        // create the blob object with content-type "application/pdf"               
        var blob = new Blob([view], { type: "application/pdf" });
        const link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        setViewQuoteLink(link)
        setShowQuoteView(true)


      } else {

        notify("error", sendQuote.message)

      }


    } catch (error) {

      notify("error", "Error al generar cotización")

    }

  }

  interface ExpandedDataType {
    key: React.Key;
    date: string;
    name: string;
    upgradeNum: string;
  }

  const ContextMenu = () => {
    return <div onMouseLeave={() => { setVisibleContextMenu(false) }} className={`contextMenu ${visibleContextMenu ? "" : "hidden"}`} style={{ left: xPos, top: yPos }}>
      <p onClick={() => { viewQuote(true) }}>Ver Cotización con marcas</p>
      <p onClick={() => { viewQuote(false) }}>Ver Cotización sin marcas</p>
      <p onClick={() => { downloadQuote(false) }}>Descargar cotización sin marcas</p>
      <p onClick={() => { downloadQuote(true) }}>Descargar cotización con marcas</p>
    </div>
  }

  const items = [
    { key: '1', label: 'Action 1' },
    { key: '2', label: 'Action 2' },
  ];

  const expandedRowRender = (row: any, key: any) => {

    const columns: TableColumnsType<ExpandedDataType> = [
      {
        key: "reference",
        dataIndex: "reference",
        width: "150px",
        title: "Referencía",

      },
      {
        key: "description",
        dataIndex: "description",
        width: "250px",
        title: "Descripción",
      },
      {
        key: "category",
        dataIndex: "category_name",
        width: "250px",
        title: "Categoría",

      },
      {
        key: "brand",
        dataIndex: "brand_name",
        width: "250px",
        title: "Marca",
      },
      {
        key: "quantity",
        dataIndex: "quantity",
        title: "Cantidad",
        width: "150px",
      },
      {
        key: "cost",
        dataIndex: "cost",
        title: "Costo",
        width: "150px",
        render: (value) => {
          return formatter.format(Number(value))
        }
      },
      {
        key: "shippingCost",
        dataIndex: "shippingCost",
        title: "Envio",
        width: "100px",
        render: (value) => {
            return formatter.format(Number(value)||0)
        }
    },
      {
        key: "iva",
        dataIndex: "iva_tax",
        title: "IVA",
        width: "150px",
        render: (value) => {
          return `${value} %`
        }
      },
      {
        key: "factor",
        dataIndex: "factor",
        title: "Factor",
        width: "150px",
        render: (value) => {
          return `${value} %`
        }
      },
      {
        key: "amount",
        dataIndex: "amount",
        title: "Monto",
        width: "250px",
        render: (value) => {
          return formatter.format(Number(value))
        }
      },
      {
        key: "unit",
        dataIndex: "unit",
        title: "Unidad",
        width: "250px",
      },
      {
        key: "user_name",
        dataIndex: "user_name",
        title: "Agente Cotizador",
        width: "250px",
        render: (value, record: any) => {
          return `${record.user_name} ${record.user_middle_name || ""} ${record.user_last_name || ""}`
        },

      },
      {
        key: "currency",
        dataIndex: "currency",
        title: "Moneda",
        width: "250px",
      },
      {
        key: "created_at",
        dataIndex: "created_at",
        title: "Fecha iniciada",
        width: "250px",
        render: (value, record) => { return new Date(value).toLocaleDateString() }
      },
      {
        key: "modified_at",
        dataIndex: "modified_at",
        title: "Ultíma modificación",
        width: "250px",
        render: (value, record) => { return new Date(value).toLocaleDateString() }
      },
      {
        key: "buyer",
        dataIndex: "buyer",
        title: "Comprador",
        width: "250px",
        render: (value, record: any) => {
          return `${record.buyer_name} ${record.buyer_last_name || ""}`
        }
      },
      {
        key: "client_name",
        dataIndex: "client_name",
        title: "Cliente",
        width: "250px",
      },
      {
        key: "expiration_date",
        dataIndex: "expiration_date",
        title: "Fecha de expiración",
        width: "250px",
        render: (value, record) => { return new Date(value).toLocaleDateString() }
      },


    ]

    return <Table columns={columns} dataSource={row.partitions} pagination={false} />;
  };


  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div>
      <div style={{ textAlign: "right", padding: "15px 0" }}>
        <Button onClick={() => { loadTablePartitions() }}>Refrescar</Button>
      </div>
      {
        viewQuoteLink == null ? null :
          <Modal width={1000} centered  closable={true} onCancel={() => { setViewQuoteLink(null); setShowQuoteView(false); viewQuoteLink.remove() }} style={{ height: "100%", top: 10 }} open={showQuoteView} cancelButtonProps={{ style: { display: 'none' } }} onOk={() => { setViewQuoteLink(null); setShowQuoteView(false); viewQuoteLink.remove() }}>


            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.3.122/build/pdf.worker.js">
              <Viewer
                plugins={[
                  defaultLayoutPluginInstance,
                ]}
                fileUrl={viewQuoteLink.href}
              />
            </Worker>
          </Modal>
      }
      <ContextMenu />
      <Table loading={loadingQuotes} onRow={
        (record) => {
          return {
            onContextMenu: (e: any) => {
              e.preventDefault()
              setSelectedRow(record);
              setXPos(e.clientX + "px");
              setYPos(e.clientY + "px");
              setVisibleContextMenu(true);
            }
          }
        }
      } dataSource={tablePartitions} style={{ width: "100%" }} scroll={{ x: "100vw", y: "80vh" }}
        expandable={{ expandedRowRender }}
        columns={[
          {
            key: "numberOfPartitions",
            dataIndex: "numberOfPartitions",
            width: "75px",
            title: "Número de partidas",
          },
          {
            key: "emitted",
            dataIndex: "emitted",
            width: "75px",
            title: "Emitida",
            ...TextSearchFilter("emitted", "Emitida"),

          },
          {
            key: "reference",
            dataIndex: "reference",
            width: "80px",
            title: "No. Cotización",
            ...TextSearchFilter("reference", "No. Cotización"),
          },
          {
            key: "profit",
            dataIndex: "profit",
            width: "85px",
            title: "Utilidad",
            ...NumberRangeFilter("profit", "Utilidad"),
            render: (value) => {
              return formatter.format(Number(value))
            }
          },
          {
            key: "total",
            dataIndex: "total",
            width: "85px",
            title: "Total",
            ...NumberRangeFilter("total", "Total"),
            render: (value) => {
              return formatter.format(Number(value))
            }
          },
          {
            key: "agent",
            dataIndex: "agent",
            width: "100px",
            title: "Agente",
            ...TextSearchFilter("agent", "Agente")

          },
          {
            key: "buyer",
            dataIndex: "buyer",
            title: "Comprador",
            width: "100px",
          },
          {
            key: "client",
            dataIndex: "client",
            title: "Cliente",
            width: "100px",
            ...TextSearchFilter("client", "Cliente")
          },
          {
            key: "expiration_date",
            dataIndex: "expiration_date",
            title: "Fecha de expiración",
            width: "150px",
            render: (value, record) => { return new Date(value).toLocaleDateString() }
          },


        ]} />
    </div>
  )
}

export default Quotes