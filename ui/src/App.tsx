import './App.css'
import Navbar, { Links } from './components/Navbar/Navbar'
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
import Cotizaciones from './pages/Cotizaciones/TabbingPage';
import Users from './pages/Users/Users';
import ODT from './pages/ODT/ODT';

function App() {
  let [show, setShow] = useState<boolean>(false)
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (

    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }}>
        <Sider id='sidenav' className={`${!show ? "collapse" : "extend"}`} trigger={null} collapsible collapsed={!show} width={250} >
          <div className="logo" />
          <Links show={show} setShow={setShow} />
        </Sider>
        <Layout className={`site-layout ${!show ? "collapse" : "extend"}`}>
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
                <Route path="/cotizaciones" element={<Cotizaciones />} />
                <Route path="/odt" element={<ODT />} />
                {/* <Route path="/users" element={<Users />} /> */}
              </Routes>
            </div>
          </div>
        </Layout>
      </Layout>

    </BrowserRouter>
  )
}

export default App
