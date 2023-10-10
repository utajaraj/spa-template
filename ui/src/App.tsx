import './App.css'
import Navbar, { Links, sidenavState } from './components/Navbar/Navbar'
import {
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';
import { Layout, theme } from 'antd';

const { Header, Sider } = Layout;
import { useState, useEffect, ReactElement } from "react"
import { AiFillDownSquare, AiFillUpSquare } from "react-icons/ai";
import { Requester } from './factors/Requester';
import chroma from "chroma-js"
import Users from './pages/Users/Users';
import Dashboard from './pages/Dashboard/Dashboard';
import Page404 from './pages/404/Users';

const pSBC = (p: any, c0: any, c1?: any, l?: any): string => {
  let obj: any = {}
  let r, g, b, P, f, t, h, i = parseInt, m = Math.round, a: any = typeof (c1) == "string";
  if (typeof (p) != "number" || p < -1 || p > 1 || typeof (c0) != "string" || (c0[0] != 'r' && c0[0] != '#') || (c1 && !a)) return "";
  if (obj === undefined || !obj.pSBCr) {
    obj.pSBCr = (d: any) => {
      let n = d.length, x: any = {};
      if (n > 9) {
        [r, g, b, a] = d = d.split(","), n = d.length;
        if (n < 3 || n > 4) return "";
        x.r = i(r[3] == "a" ? r.slice(5) : r.slice(4)), x.g = i(g), x.b = i(b), x.a = a ? parseFloat(a) : -1
      } else {
        if (n == 8 || n == 6 || n < 4) return "";
        if (n < 6) d = "#" + d[1] + d[1] + d[2] + d[2] + d[3] + d[3] + (n > 4 ? d[4] + d[4] : "");
        d = i(d.slice(1), 16);
        if (n == 9 || n == 5) x.r = d >> 24 & 255, x.g = d >> 16 & 255, x.b = d >> 8 & 255, x.a = m((d & 255) / 0.255) / 1000;
        else x.r = d >> 16, x.g = d >> 8 & 255, x.b = d & 255, x.a = -1
      } return x
    };
  }
  h = c0.length > 9, h = a ? c1.length > 9 ? true : c1 == "c" ? !h : false : h, f = obj.pSBCr(c0), P = p < 0, t = c1 && c1 != "c" ? obj.pSBCr(c1) : P ? { r: 0, g: 0, b: 0, a: -1 } : { r: 255, g: 255, b: 255, a: -1 }, p = P ? p * -1 : p, P = 1 - p;
  if (!f || !t) return "";
  if (l) r = m(P * f.r + p * t.r), g = m(P * f.g + p * t.g), b = m(P * f.b + p * t.b);
  else r = m((P * f.r ** 2 + p * t.r ** 2) ** 0.5), g = m((P * f.g ** 2 + p * t.g ** 2) ** 0.5), b = m((P * f.b ** 2 + p * t.b ** 2) ** 0.5);
  a = f.a, t = t.a, f = a >= 0 || t >= 0, a = f ? a < 0 ? t : t < 0 ? a : a * P + t * p : 0;
  if (h) return "rgb" + (f ? "a(" : "(") + r + "," + g + "," + b + (f ? "," + m(a * 1000) / 1000 : "") + ")";
  else return "#" + (4294967296 + r * 16777216 + g * 65536 + b * 256 + (f ? m(a * 255) : 0)).toString(16).slice(1, f ? undefined : -2)
}
// set theme
(async () => {
  try {
    const updateMyColor = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/users/read/me", method: "get" }).send()


    const { theme, color, collapsed } = updateMyColor[0]

    sidenavState.next({ theme, color, collapsed });

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

let outerUrl = 0
interface AppRoutesInterface {
  path: string,
  element: any
}
const appRoutes: AppRoutesInterface[] = [
  { path: "/", element: <Dashboard /> },
  { path: "/crm", element: <Dashboard /> },
  { path: "/crm/usuarios", element: <Users /> },
  { path: "/crm/*", element: Page404 }
]
function App() {


  const navigate = useNavigate();
  let [show, setShow] = useState<any>(false)

  const [colorStop, setColorStop] = useState<string>("")
  const [dark, setDark] = useState<Boolean>(false)

  useEffect(() => {
    if (outerUrl === 0 && window.location.pathname !== "" || window.location.pathname !== "/") {
      if (window.location.pathname.startsWith("/crm") && window.location.pathname.length > 5) {
        outerUrl = 1
        navigate(window.location.pathname.toLowerCase())
      }
    }
  }, [])

  useEffect(() => {
    const subscription = sidenavState.subscribe({
      next(x: any) {
        const colorDelta = 0.3
        setShow(x.collapsed)
        const shapeColor: any = x.theme ? pSBC(-0.97, x.color) : pSBC(0.65, x.color)
        setColorStop(shapeColor)
        setDark(x.theme)
      },
      error(err: any) {
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

    <Layout style={{ minHeight: "100vh" }} className="theAside">
      <Sider id='sidenav' className={`${!show ? "collapse" : "extend"}`} trigger={null} collapsible collapsed={!show} width={250} >
        <div className="logo" />
        <Links show={show} setShow={setShow} />
      </Sider>
      <Layout className={`site-layout ${!show ? "collapse" : "extend"}`}>
        <div className='shapes'>
          <svg className='topRight' width="147" height="142" viewBox="0 0 147 142" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="70" cy="74.5" rx="70" ry="67.5" fill="black" />
            <ellipse cx="76.7935" cy="68" rx="70" ry="68" fill={colorStop} />
          </svg>

          <svg className='bottomLeft' width="822" height="885" viewBox="0 0 822 885" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_b_131_151)">
              <path
                d="M746.794 489C476.617 679.714 385.998 1003.67 278.22 839.602C155.603 652.939 120.538 662.79 25.599 579.283C-67.3718 497.508 126.095 508.466 145.632 311.532C202.316 -259.856 479.602 119.176 519.905 177.746C523.166 182.485 528.33 185.509 534.017 186.383C946.835 249.833 814.296 441.351 746.794 489Z"
                fill="url(#paint0_linear_131_151)" />
            </g>
            <defs>
              <filter id="filter0_b_131_151" x="-39.5327" y="-39.6257" width="901.363" height="964.158"
                filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="20" />
                <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_131_151" />
                <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_131_151"
                  result="shape" />
              </filter>
              <linearGradient id="paint0_linear_131_151" x1="507.792" y1="147.713" x2="-16.3644"
                y2="488.819" gradientUnits="userSpaceOnUse">
                <stop stopColor={colorStop} />
                <stop offset="0.8125" stopColor={dark ? "black" : "white"} />
              </linearGradient>
            </defs>
          </svg>
          <svg className='bottomRight' width="254" height="253" viewBox="0 0 254 253" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.38643 54.1451C-2.95215 22.9056 22.8168 -3.23623 54.1154 0.653196L208.878 19.8852C249.571 24.9421 268.033 74.5693 239.855 103.155L106.546 238.393C78.3675 266.979 28.4803 249.232 22.8394 208.615L1.38643 54.1451Z" fill={colorStop} />
          </svg>

        </div>
        <Navbar show={show} setShow={setShow} />
        <div id="navbar">
          <div id="togglerContainer" >
            {
              show ? <AiFillUpSquare className={`${show ? "pushUp" : null}`} id="navbarToggler" onClick={() => { setShow(!show) }} /> : <AiFillDownSquare href="#togglerContainer" className={`${show ? null : "pullDown"}`} id="navbarToggler" onClick={() => { setShow(!show) }} />
            }
          </div>
        </div>

        <Header id='navbarDesktop'>
          <i className='trigger' onClick={() => { setShow(!show) }}>{!show ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}</i>
        </Header>
        <div className="App">
          <div id="body">
            <Routes>
              {
                appRoutes.map((x, index: number): ReactElement => {
                  return <Route key={index+"route_key"} path={x.path} element={x.element} />
                })
              }
            </Routes>
          </div>
        </div>
      </Layout>
    </Layout>

  )
}

export default App
