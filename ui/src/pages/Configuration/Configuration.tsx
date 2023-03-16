import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Companies from './Companies';
import Categories from './Categories';
import Brands from './Brands';


const CompaniesTabbingPage = ({ ...props }) => {


    const items: TabsProps['items'] = [
        {
            key: 'empresas',
            label: `Empresas`,
            children: <Companies />
        },
        {
            key: 'marcas',
            label: `Marcas`,
            children: <Brands />
        },
        {
            key: 'categorias',
            label: `Categorias`,
            children: <Categories />
        },
    ];

    return (
        <div>
            <Tabs defaultActiveKey="appConfig" items={items} />
        </div>
    )
}

export default CompaniesTabbingPage