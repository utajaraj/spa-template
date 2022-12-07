import './App.css'
import Navbar,{Links} from './components/Navbar/Navbar'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';

const { Header, Sider, Content } = Layout;
import { useState } from "react"
import { AiFillDownSquare, AiFillUpSquare, AiFillSecurityScan } from "react-icons/ai";
import Dashboard from './pages/Dashboard/Dashboard';
import Analytics from './pages/Analytics/Analytics';
import Users from './pages/Users/Users';

function App() {
  let [show, setShow] = useState<boolean>(true)
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (

    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider id='sidenav' className={`${!show?"collapse":"extend"}`} trigger={null} collapsible collapsed={!show} width={150} >
          <div className="logo" />
          <Links show={show} setShow={setShow}/>
        </Sider>
        <Layout className={`site-layout ${!show?"collapse":"extend"}`}>
          <Header id='navbarDesktop'>
            <i className='trigger' onClick={() => { setShow(!show) }}>{!show ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</i>

          </Header>
          <div className="App">
            <Navbar show={show} setShow={setShow} />
            <div id="navbar">
              <div id="togglerContainer" >
                {
                  show ? <AiFillUpSquare className={`${show ? "pushUp" : null}`} id="navbarToggler" onClick={() => { setShow(!show) }} /> : <AiFillDownSquare href="#togglerContainer" className={`${show ? null : "pullDown"}`} id="navbarToggler" onClick={() => { setShow(!show) }} />
                }
              </div>
            </div>
            <div id="body">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/users" element={<Users />} />
              </Routes>
            </div>
          </div>
        </Layout>
      </Layout>

    </BrowserRouter>
  )
}

export default App
