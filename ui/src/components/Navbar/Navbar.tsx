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
        <Link to="/dashboard"><MdDashboard /><p>Panel</p></Link>
        <Link to="/analytics"><HiChartBar /><p>Analytics</p></Link>
        <Link to="/quotes"><RiBillFill /><p>Quotes</p></Link>
        <Link to="/wo"><GiCardboardBoxClosed /><p>WO's</p></Link>
        <Link to="/clients"><MdPrecisionManufacturing /><p>Clients</p></Link>
        <Link to="/monitor"><AiFillSecurityScan /><p>Monitor</p></Link>
        <Link to="/users"><HiUserCircle /><p>Users</p></Link>
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
