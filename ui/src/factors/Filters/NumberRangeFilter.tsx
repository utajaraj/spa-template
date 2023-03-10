

import { SearchOutlined } from '@ant-design/icons';
import type { ColumnType } from 'antd/es/table';
import type { InputRef } from 'antd';
import {useState, useRef} from "react"
import { Button, Space, InputNumber,Slider } from 'antd';
export const NumberRangeFilter = (dataIndex: string, key: string): ColumnType<{}> => {

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
            >
              Search
            </Button>
            <Button
              onClick={() => { setMin(0); setMax(10000000); setSelectedKeys([]); confirm(); }}
              size="small"
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type="link"
              size="small"
              onClick={() => {
                setSelectedKeys([min, max])
                confirm({ closeDropdown: false });
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
      onFilter: (value: any, record: any) => {
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