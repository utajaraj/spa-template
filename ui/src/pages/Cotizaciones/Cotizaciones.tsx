import React, { useRef, useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import { Button, Input, Space, Table, Slider, InputNumber } from 'antd';
import type { ColumnsType, ColumnType } from 'antd/es/table';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import { Requester } from '../../factors/Requester';
const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',

});


interface PartitionInterface {
  calculatedRow?: boolean
  id?: string,
  partition_name: string,
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








  return (
    <div>
      <h1>Cotizaciones</h1>
      <Table dataSource={tablePartitions} style={{ width: "100%" }} scroll={{ x: "100%", y: "80vh" }} columns={[
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
        }
      ]} />
    </div>
  )
}

export default Cotizaciones