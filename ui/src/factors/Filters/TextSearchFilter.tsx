

import { SearchOutlined } from '@ant-design/icons';
import type { FilterConfirmProps } from 'antd/es/table/interface';
import Highlighter from 'react-highlight-words';
import type { ColumnType } from 'antd/es/table';
import type { InputRef } from 'antd';
import {useState, useRef} from "react"
import { Button, Space, Select } from 'antd';
export const TextSearchFilter = (dataIndex: string, key: string): ColumnType<{}> => {
    const searchInput = useRef<InputRef>(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const handleSearch = (
      selectedKeys: string[],
      confirm: (param?: FilterConfirmProps) => void,
      dataIndex: string,
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
            onChange={(e:any) => {
              setSelectedKeys(e)
            }}
            autoFocus
            options={[]}
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
              onClick={() => { clearFilters && handleReset(clearFilters); setSelectedKeys([]); confirm(); }}
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
                setSearchText(selectedKeys.toString().replaceAll(",", ""));
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
      sorter: (a: any, b: any) => {
        return a[dataIndex].localeCompare(b[dataIndex]);
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

  