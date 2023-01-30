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
        <div id="sidenavLogo" style={{ justifyContent: "center" }}>
            <img id="logo" style={{ width: show ? "60px" : "40px" }} src="/garle-logo.png" />
        </div>
        <Link to="/cotizaciones">
            <div className="linkContent">
                <div className="circle">
                    <RiBillFill />
                </div>
                <p>Cotizaciones</p>
            </div>
        </Link>
        <Link to="/odt">
            <div className="linkContent">
                <div className="circle">
                    <GiCardboardBoxClosed />
                </div>
                <p>Ordenes</p>
            </div>
        </Link>
        <Link to="/odt">
            <div className="linkContent">
                <div className="circle">
                    <MdPrecisionManufacturing />
                </div>
                <p>Clientes</p>
            </div>
        </Link>
        <Link to="/odt">
            <div className="linkContent">
                <div className="circle">
                    <AiFillSecurityScan />
                </div>
                <p>Configuración</p>
            </div>
        </Link>
        <Link to="/odt">
            <div className="linkContent">
                <div className="circle">
                    <HiUserCircle />
                </div>
                <p>Usuarios</p>
            </div>
        </Link>
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
