import './App.css'
import Navbar, { Links, sidenavState } from './components/Navbar/Navbar'
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
import { useState, useEffect } from "react"
import { AiFillDownSquare, AiFillUpSquare, AiFillSecurityScan } from "react-icons/ai";
import Dashboard from './pages/Dashboard/Dashboard';
import Cotizaciones from './pages/Cotizaciones/TabbingPage';
import ODT from './pages/ODT/ODT';
import Clients from './pages/Clients/Clients';
import CompaniesTabbingPage from './pages/Configuration/Configuration';
import { Requester } from './factors/Requester';
import chroma from "chroma-js"
import Users from './pages/Users/Users';

// set theme
(async () => {
  try {
    const updateMyColor = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/users/read/me", method: "get" }).send()


    const { theme, color, collapsed } = updateMyColor[0]

    sidenavState.next(collapsed);

    if (updateMyColor.length > 0) {
      chroma.scale(theme === 1 ? ["#161616", "#2f2f2f", "#4f4f4f", "#5d5d5d", "#fff", color] : ["#fff", "#eee", "#ececec", "#200000", "#000", color]).colors(20).forEach((coolor: string, i: number) => {
        document.documentElement.style.setProperty(`--coolor${i + 1}`, coolor);
      })
    }
  } catch (error) {

  } finally {

    document.getElementById("loading")?.remove()
  }
})()

function App() {
  let [show, setShow] = useState<any>(false)

  const [company, setCompany] = useState<any>({})

  const loadCompanyInformation = async () => {
    const companyInformation = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/companies/read/one", method: "get" }).send()

    if (Array.isArray(companyInformation)===false && companyInformation.status == undefined) {
      setCompany(companyInformation)
    }
  }

  useEffect(() => {
    loadCompanyInformation()
  }, [])
  useEffect(() => {
    const subscription = sidenavState.subscribe({
      next(x:any) {
        setShow(x)
      },
      error(err:any) {
        console.error('something wrong occurred: ' + err);
      },
      complete() {
        console.log('done');
      },
    });
  }, [])
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (

    <BrowserRouter>
      <Layout style={{ minHeight: "100vh" }} className="theAside">
        <Sider id='sidenav' className={`${!show ? "collapse" : "extend"}`} trigger={null} collapsible collapsed={!show} width={250} >
          <div className="logo" />
          <Links show={show} setShow={setShow} company={company} />
        </Sider>
        <Layout className={`site-layout ${!show ? "collapse" : "extend"}`}>
          <Header id='navbarDesktop'>
            <i className='trigger' onClick={() => { setShow(!show) }}>{!show ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</i>
          </Header>
          <div className="App">
            <Navbar show={show} setShow={setShow} company={company} />
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
                <Route path="/crm/dashboard" element={<Dashboard />} />
                <Route path="/crm/cotizaciones" element={<Cotizaciones />} />
                <Route path="/crm/clients" element={<Clients />} />
                <Route path="/crm/configuration" element={<CompaniesTabbingPage />} />
                <Route path="/crm/odt" element={<ODT />} />
                <Route path="/crm/users" element={<Users />} />
              </Routes>
            </div>
          </div>
        </Layout>
      </Layout>

    </BrowserRouter>
  )
}

export default App
