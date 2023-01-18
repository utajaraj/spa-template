import { Dispatch } from "react"
import { AiFillSecurityScan } from "react-icons/ai";
import { MdPrecisionManufacturing } from "react-icons/md"
import { RiBillFill } from "react-icons/ri"
import { HiUserCircle, HiChartBar } from "react-icons/hi"
import { GiCardboardBoxClosed } from "react-icons/gi"
import { MdDashboard } from "react-icons/md"
import "./Navbar.css"
import { Link } from "react-router-dom";
interface Props {
    show: boolean;
    setShow: Dispatch<boolean>
}
export const Links = ({ show, setShow }: Props) => {
    return <div id="links" className={show ? "extend" : "collapse"}>
        <div style={{ justifyContent: "center" }}>
            <img style={{ width: show ? "60px" : "40px" }} src="/garle-logo.png" />
        </div>
        <Link to="/cotizaciones"><RiBillFill /><p>Cotizaciones</p></Link>
        <Link to="/odt"><GiCardboardBoxClosed /><p>Ordenes</p></Link>
        <Link to="/clientes"><MdPrecisionManufacturing /><p>Clientes</p></Link>
        <Link to="/configuración"><AiFillSecurityScan /><p>Configuración</p></Link>
        <Link to="/usuarios"><HiUserCircle /><p>Users</p></Link>
    </div>
}
const Navbar = ({ show, setShow }: Props) => {



    return (
        <div id="nav" className={`${show ? "showLinks" : "hideLinks"}`}>
            <Links show={show} setShow={setShow} />
        </div>
    )
}


export default Navbar
