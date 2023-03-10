import React, { useState } from 'react';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Users from './Users';
import Empresas from './Companies';


const UsersTabbingPage = ({ ...props }) => {


  const items: TabsProps['items'] = [
    {
      key: 'users',
      label: `Usuarios`,
      children: <Users />
    },
    {
      key: 'empresas',
      label: `Empresas`,
      children: <Empresas />
    },
  ];

  return (
    <div>
       <Tabs defaultActiveKey="users" items={items} />
    </div>
  )
}

export default UsersTabbingPage