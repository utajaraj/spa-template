import React, { useRef, useState, useEffect, BaseSyntheticEvent } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table, Slider, InputNumber, message } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import { notify } from '../../factors/notify';
import Highlighter from 'react-highlight-words';
import { Requester } from '../../factors/Requester';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

});
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

interface PartitionInterface {

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
  type PartitionKey = keyof PartitionInterface;

  const NumberRangeFilter = (dataIndex: PartitionKey, key: string, render: boolean): ColumnType<PartitionInterface> => {

    const searchInput = useRef<InputRef>(null);
    const [searchText, setSearchText] = useState('');
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
    const handleSearch = (
      selectedKeys: string[],
      confirm: (param?: FilterConfirmProps) => void,
      dataIndex: PartitionKey,
    ) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };

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
              onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => { setMin(0); setMax(10000000) }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
      onFilter: (value: any, record: PartitionInterface) => {
        console.log(Number(record[dataIndex]) < max && Number(record[dataIndex]) > min);

        return Number(record[dataIndex]) < max && Number(record[dataIndex]) > min
      },
      onFilterDropdownOpenChange: (visible: boolean) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },
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
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
      clearFilters();
      setSearchText('');
    }
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
        <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
          <Input
            ref={searchInput}
            placeholder={`Buscar ${key}`}
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type="primary"
              onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
              icon={<SearchOutlined />}
              size="small"
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                close();
              }}
            >
              close
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
      render: (value: any) => searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: 'var(--coolor19)', padding: 0, color: "white" }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={value ? value.toString() : ''}
        />
      ) : (
        value
      ),
    }

  };

  const [xPos, setXPos] = useState<string>("")
  const [yPos, setYPos] = useState<string>("")
  const [selectedRow, setSelectedRow] = useState<PartitionInterface | {}>({})
  const [visibleContextMenu, setVisibleContextMenu] = useState<boolean>(false)

  const [messageApi, contextHolder] = message.useMessage();
  const key = 'updatable';
  const downloadQuote = async () => {

    messageApi.open({
      key,
      type: 'loading',
      content: 'Loading...',
    });

    try {
      const { quoteID, reference }: any = selectedRow

      const sendQuote = await new Requester({ url: import.meta.env.VITE_APP_APIURL + `/quotes/update/submit`, method: "patch", body: { id: quoteID } }).send()

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

        messageApi.open({
          key,
          type: 'success',
          content: 'Descargada!',
          duration: 2,
        });

      } else {
        notify("error", sendQuote.message)
      }


    } catch (error) {

      notify("error", "Error al generar cotización")

    }finally{
      messageApi.destroy()
    }

  }
  const ContextMenu = () => {
    return <div onMouseLeave={() => { setVisibleContextMenu(false) }} className={`contextMenu ${visibleContextMenu ? "" : "hidden"}`} style={{ left: xPos, top: yPos }}>
      <p onClick={downloadQuote}>Descargar cotización</p>
    </div>
  }

  return (
    <div>
      {contextHolder}
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
          key: "reference",
          dataIndex: "reference",
          width: "100px",
          title: "Referencíá",
          ...TextSearchFilter("reference", "Referencia")

        },
        {
          key: "name",
          dataIndex: "partition_name",
          width: "100px",
          title: "Nombre",
          ...TextSearchFilter("partition_name", "Nombre")

        },
        {
          key: "description",
          dataIndex: "description",
          width: "100px",
          title: "Descripción",
          ...TextSearchFilter("description", "Descripción")
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
          ...NumberRangeFilter("quantity", "Cantidad", false),
        },
        {
          key: "cost",
          dataIndex: "cost",
          title: "Costo",
          width: "100px",
          ...NumberRangeFilter("quantity", "Cantidad", true),
          render: (value) => {
            return formatter.format(Number(value))
          }
        },
        {
          key: "factor",
          dataIndex: "factor",
          title: "Factor",
          width: "75px",
          ...NumberRangeFilter("quantity", "Cantidad", true),
          render: (value) => {
            return `${value} %`
          }
        },
        {
          key: "amount",
          dataIndex: "amount",
          title: "Monto",
          width: "100px",
          ...NumberRangeFilter("quantity", "Cantidad", true),
          render: (value) => {
            return formatter.format(Number(value))
          }
        },
        {
          key: "unit",
          dataIndex: "unit",
          title: "Unidad",
          width: "100px",
        },
        {
          key: "user_name",
          dataIndex: "user_name",
          title: "Agente Cotizador",
          width: "100px",
          render: (value, record) => {
            return `${record.user_name} ${record.user_middle_name || ""} ${record.user_last_name || ""}`
          }
        },
        {
          key: "currency",
          dataIndex: "currency",
          title: "Moneda",
          width: "100px",
        },
        {
          key: "created_at",
          dataIndex: "created_at",
          title: "Fecha iniciada",
          width: "100px",
          render: (value, record) => { return new Date(value).toLocaleDateString() }
        },
        {
          key: "modified_at",
          dataIndex: "modified_at",
          title: "Ultíma modificación",
          width: "100px",
          render: (value, record) => { return new Date(value).toLocaleDateString() }
        },
        {
          key: "buyer",
          dataIndex: "buyer",
          title: "Comprador",
          width: "100px",
          render: (value, record) => {
            return `${record.buyer_name} ${record.buyer_last_name || ""}`
          }
        },
        {
          key: "client_name",
          dataIndex: "client_name",
          title: "Cliente",
          width: "100px",
        },
        {
          key: "expiration_date",
          dataIndex: "expiration_date",
          title: "Fecha de expiración",
          width: "100px",
          render: (value, record) => { return new Date(value).toLocaleDateString() }
        },


      ]} />
    </div>
  )
}

export default Cotizaciones