import { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { InputRef, Modal } from 'antd';
import { Button, Select, Space, Table, Slider, InputNumber } from 'antd';
import type { ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { notify } from '../../factors/notify';
import Highlighter from 'react-highlight-words';
import { Requester } from '../../factors/Requester';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

// Core viewer
import { Viewer, Worker } from '@react-pdf-viewer/core';

// Import styles
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';

// Create new plugin instance
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

});

interface PartitionInterface {

  key: any,
  status?: string,
  id?: string,
  partition_name?: string,
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
  buyer?: string,
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

}

const Partitions = ({ ...props }) => {

  const [tablePartitions, setTablePartitions] = useState<PartitionInterface[] | []>([])



  const loadTablePartitions = async () => {

    const savedQuotePartitions = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/partitions/read/mine", method: "get" }).send()


    setTablePartitions(savedQuotePartitions.map((partition: any, i: number) => {
      partition.key = `partition_table_entry_${i}`
      return partition
    }))

  }

  useEffect(() => {
    loadTablePartitions()
  }, [])

  type PartitionKey = keyof PartitionInterface;

  const NumberRangeFilter = (dataIndex: PartitionKey, key: string): ColumnType<PartitionInterface> => {

    const searchInput = useRef<InputRef>(null);
    const [min, setMin] = useState<number>(0);
    const [max, setMax] = useState<number>(10000000);
    const [searchedColumn, setSearchedColumn] = useState('');
    const format = (value: any) => Number(value).toLocaleString('en');
    const setMinAndMaxOnRange = (value: number | [number, number], field: "max" | "min" | "both") => {

      if (field == "both" && Array.isArray(value)) {

        setMin(value[0])
        setMax(value[1])
        return
      }
      if (field == "max" && !Array.isArray(value)) {
        setMax(value)
        return
      }
      if (field == "min" && !Array.isArray(value)) {
        setMin(value)
        return
      }
    }

    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <div>
            <div>

              <label>Min</label>
              <InputNumber
                style={{ width: "100%" }}
                value={min}
                formatter={(value: any) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '')}
                onChange={(value) => { setMinAndMaxOnRange(value, "min") }}
              />

              <label>Max</label>
              <InputNumber
                value={max}
                style={{ width: "100%" }}
                formatter={(value: any) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={(value: any) => value!.replace(/\$\s?|(,*)/g, '')}
                onChange={(value) => { setMinAndMaxOnRange(value, "max") }}
              />
            </div>
            <Slider min={0} max={10000000} value={[min, max]} defaultValue={[min, max]} tooltip={{ formatter: format }} range={{ draggableTrack: true }} onChange={(values: any) => { setMinAndMaxOnRange(values, "both") }} />
          </div>
          <Space>
            <Button
              type="primary"
              onClick={() => {
                setSelectedKeys([min, max])
                confirm({ closeDropdown: false });
              }}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >Buscar
            </Button>
            <Button
              onClick={() => { setMin(0); setMax(10000000); setSelectedKeys([]); confirm(); }}
              size="small"
              style={{ width: 90 }}
            >Resetear
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedKeys([min, max])
                confirm({ closeDropdown: false });
              }}
            >
              Filtrar
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >Cerrar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value: any, record: PartitionInterface) => {
        return Number(record[dataIndex]) <= max && Number(record[dataIndex]) >= min
      },
      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      sorter: (a: any, b: any) => {
        return (a[dataIndex] * 100 + b[dataIndex]) * 100
      }
    }


  }

  const TextSearchFilter = (dataIndex: PartitionKey, key: string): ColumnType<PartitionInterface> => {
    const searchInput = useRef<InputRef>(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleSearch = (
      selectedKeys: string[],
      confirm: (param?: FilterConfirmProps) => void,
      dataIndex: PartitionKey,
    ) => {
      confirm();
      setSearchText(selectedKeys.toString().replaceAll(",", ""));
      setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
      clearFilters();
      setSearchText('');
    }
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Select
            mode="tags"
            style={{ width: '100%' }}
            tokenSeparators={[',']}
            dropdownStyle={{ display: "none" }}
            notFoundContent={null}
            onChange={(e) => {
              setSelectedKeys(e)
            }}
            autoFocus
            options={[]}
          />
          <Space style={{ marginTop: "15px" }}>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >Buscar
            </Button>
            <Button
              onClick={() => { clearFilters && handleReset(clearFilters); setSelectedKeys([]); confirm(); }}
              size="small"
              style={{ width: 90 }}
            >Resetear
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText(selectedKeys.toString().replaceAll(",", ""));
                setSearchedColumn(dataIndex);
              }}
            >
              Filtrar
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              Cerrar
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value: any, record: any) =>
        record[dataIndex]
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase()),

      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
      sorter: (a: any, b: any) => {
        return a[dataIndex]?.localeCompare(b[dataIndex]);
      },
      render: (value: any) => {
        return searchedColumn === dataIndex ? (

          <Highlighter
            highlightStyle={{ backgroundColor: 'var(--coolor19)', padding: 0, color: "white" }}
            searchWords={[searchText]}
            autoEscape
            textToHighlight={value ? value.toString() : ''}
          />
        ) : (
          value
        )
      }
    }

  };

  const [xPos, setXPos] = useState<string>("")
  const [yPos, setYPos] = useState<string>("")

  const [selectedRow, setSelectedRow] = useState<PartitionInterface | {}>({})
  const [visibleContextMenu, setVisibleContextMenu] = useState<boolean>(false)
  const [viewQuoteLink, setViewQuoteLink] = useState<any>(null)
  const [showQuoteView, setShowQuoteView] = useState<boolean>(false)

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
  // const statuses = ["Abierta", "Requerida", "No Requerida"]
  // const updatePartitionStatus = async (a: any) => {
  //   const row: any = selectedRow
  //   const { id } = row
  //   const body = {
  //     id: id,
  //     status: a,
  //   }
  //   const updatePartition = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "partitions/update/status", method: "patch", body}).send()
  // }

  const ContextMenu = () => {
    useEffect(() => { }, [selectedRow])
    const row: any = selectedRow
    const { status } = row
    return <div onMouseLeave={() => { setVisibleContextMenu(false) }} className={`contextMenu ${visibleContextMenu ? "" : "hidden"}`} style={{ left: xPos, top: yPos }}>
      <p>Ver Cotización <button onClick={() => { viewQuote(true) }}>Con Marcas</button><button onClick={() => { viewQuote(false) }}>Sin Marcas</button></p>
      <p>Descargar Cotización <button onClick={() => { downloadQuote(true) }}>Con Marcas</button><button onClick={() => { downloadQuote(false) }}>Sin Marcas</button></p>
      {/* <p>Cambiar estatus <Select onChange={updatePartitionStatus} style={{ width: "250px" }} defaultValue={status || ""}>
        <Select.Option value={""} selected disabled>Selecciona Estatus</Select.Option>
        {
          statuses.map((status, i) => {
            return <Select.Option value={status} key={"status" + i}>{status}</Select.Option>
          })
        }
      </Select>
      </p> */}
    </div>
  }
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  return (
    <div>
      {
        viewQuoteLink == null ? null :
          <Modal closable={true} onCancel={() => { setViewQuoteLink(null); setShowQuoteView(false); viewQuoteLink.remove() }} style={{ height: "100%", top: 10 }} open={showQuoteView} cancelButtonProps={{ style: { display: 'none' } }} onOk={() => { setViewQuoteLink(null); setShowQuoteView(false); viewQuoteLink.remove() }}>


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
      <Table onRow={
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
      } dataSource={tablePartitions} style={{ width: "100%" }} scroll={{ x: "100vw", y: "80vh" }} columns={[
        {
          key: "emitted",
          dataIndex: "emitted",
          width: "150px",
          title: "Emitida",
          ...TextSearchFilter("emitted", "Emitida"),
        },
        {
          key: "status",
          dataIndex: "status",
          width: "150px",
          title: "Estatus",
          ...TextSearchFilter("status", "Estatus"),
        },
        {
          key: "reference",
          dataIndex: "reference",
          width: "150px",
          title: "Referencía",
          ...TextSearchFilter("reference", "Referencia")

        },
        {
          key: "name",
          dataIndex: "partition_name",
          width: "250px",
          title: "Nombre",
          ...TextSearchFilter("partition_name", "Nombre")

        },
        {
          key: "description",
          dataIndex: "description",
          width: "250px",
          title: "Descripción",
          ...TextSearchFilter("description", "Descripción")
        },
        {
          key: "category",
          dataIndex: "category_name",
          width: "250px",
          title: "Categoría",
          ...TextSearchFilter("category_name", "Categoría")

        },
        {
          key: "brand",
          dataIndex: "brand_name",
          width: "250px",
          title: "Marca",
          ...TextSearchFilter("brand_name", "Marca")
        },
        {
          key: "quantity",
          dataIndex: "quantity",
          title: "Cantidad",
          width: "150px",
          ...NumberRangeFilter("quantity", "Cantidad"),
        },
        {
          key: "cost",
          dataIndex: "cost",
          title: "Costo",
          width: "150px",
          ...NumberRangeFilter("quantity", "Cantidad"),
          render: (value) => {
            return formatter.format(Number(value))
          }
        },
        {
          key: "factor",
          dataIndex: "factor",
          title: "Factor",
          width: "150px",
          ...NumberRangeFilter("quantity", "Cantidad"),
          render: (value) => {
            return `${value} %`
          }
        },
        {
          key: "amount",
          dataIndex: "amount",
          title: "Monto",
          width: "250px",
          ...NumberRangeFilter("quantity", "Cantidad"),
          render: (value) => {
            return formatter.format(Number(value))
          }
        },
        {
          key: "unit",
          dataIndex: "unit",
          title: "Unidad",
          width: "250px",
          ...TextSearchFilter("unit", "Unidad")
        },
        {
          key: "user_name",
          dataIndex: "user_name",
          title: "Agente Cotizador",
          width: "250px",
          ...TextSearchFilter("user_name", "Agente"),
          render: (value, record) => {
            return `${record.user_name} ${record.user_middle_name || ""} ${record.user_last_name || ""}`
          }
        },
        {
          key: "currency",
          dataIndex: "currency",
          title: "Moneda",
          width: "250px",
          ...TextSearchFilter("currency", "Moneda")
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
          ...TextSearchFilter("buyer", "Comprador"),
          render: (value, record) => {
            return `${record.buyer_name} ${record.buyer_last_name || ""}`
          }
        },
        {
          key: "client_name",
          dataIndex: "client_name",
          title: "Cliente",
          width: "250px",
          ...TextSearchFilter("client_name", "Cliente")
        },
        {
          key: "expiration_date",
          dataIndex: "expiration_date",
          title: "Fecha de expiración",
          width: "250px",
          render: (value, record) => { return new Date(value).toLocaleDateString() }
        },


      ]} />
    </div>
  )
}

export default Partitions