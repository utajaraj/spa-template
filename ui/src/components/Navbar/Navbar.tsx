import { Dispatch, useEffect, useState } from "react"
import { AiFillSecurityScan } from "react-icons/ai";
import { MdPrecisionManufacturing } from "react-icons/md"
import { RiBillFill } from "react-icons/ri"
import { HiUserCircle, HiChartBar } from "react-icons/hi"
import { GiCardboardBoxClosed } from "react-icons/gi"
import { MdDashboard, MdFormatColorFill } from "react-icons/md"
import chroma from "chroma-js"
import "./Navbar.css"
import { Link } from "react-router-dom";
import { Modal } from "antd"
import { Requester } from "../../factors/Requester";
import { notify } from "../../factors/notify";
import { Subject } from 'rxjs';
export const sidenavState = new Subject();

const setMyTheme = async (color: string | undefined, theme: boolean | undefined, collapsed: boolean | undefined) => {
    const updateMyColor = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/users/update/theme", method: "patch", body: { color, theme, collapsed } }).send()
    if (updateMyColor.status == true) {
        sidenavState.next(updateMyColor.data.collapsed);
        chroma.scale(updateMyColor.data.theme ? ["#161616", "#2f2f2f", "#4f4f4f", "#5d5d5d", "#fff", updateMyColor.data.color] : ["#fff", "#e6e6e6", "#a5a5a5", "#595959", "#000000", updateMyColor.data.color,]).colors(20).forEach((coolor: string, i: number) => {
            document.documentElement.style.setProperty(`--coolor${i + 1}`, coolor);
        });
        notify("success", "Color actualizado")
    } else {
        if (updateMyColor.message) {

            notify("error", updateMyColor.message)
        } else {

            notify("error", "No se pudo actualizar el color")
        }
    }
}
interface Props {
    show: boolean;
    setShow: Dispatch<boolean>,
    company:any
}


export const Links = ({ show, setShow, company }: Props) => {


    const [openDrawer, setOpenDrawer] = useState<boolean>(false)
    return <div className={`${show ? "extend" : "collapse"} links`}>
        <Modal footer={null} onCancel={() => { setOpenDrawer(false) }} closable={true} open={openDrawer}>
            <div className="style_option_container">
                <div>
                    Color de aplicación
                </div>
                <div style={{ padding: "15px", backgroundColor: "var(--coolor20)", width: "100%", marginBottom: "15px", color: "white", fontWeight: "bold", textAlign: "center" }}>
                    Color seleccionado
                </div>
                <div className="style_option" onClick={() => { setMyTheme("#5b3de2", undefined, undefined) }} style={{ color: "#5b3de2", borderColor: "#5b3de2" }}>Azul</div>
                <div className="style_option" onClick={() => { setMyTheme("#dc0404", undefined, undefined) }} style={{ color: "#dc0404", borderColor: "#dc0404" }}>Rojo</div>
                <div className="style_option" onClick={() => { setMyTheme("#c7cd2b", undefined, undefined) }} style={{ color: "#c7cd2b", borderColor: "#c7cd2b" }}>Amarillo</div>
                <div className="style_option" onClick={() => { setMyTheme("#db16ad", undefined, undefined) }} style={{ color: "#db16ad", borderColor: "#db16ad" }}>Rosa</div>
                <div className="style_option" onClick={() => { setMyTheme("#0e9946", undefined, undefined) }} style={{ color: "#0e9946", borderColor: "#0e9946" }}>Verde</div>
                <div className="style_option" onClick={() => { setMyTheme("#e5751a", undefined, undefined) }} style={{ color: "#e5751a", borderColor: "#e5751a" }}>Naranja</div>
            </div>
            <div className="style_option_container">
                <div>
                    Tema
                </div>
                <div className="style_option" onClick={() => { setMyTheme(undefined, true, undefined) }} style={{ color: "black" }}>Obscuro</div>
                <div className="style_option" onClick={() => { setMyTheme(undefined, false, undefined) }} style={{ color: "black" }}>Claro</div>
            </div>
            <div className="style_option_container">
                <div>
                    Navegación
                </div>
                <div className="style_option" onClick={() => { setMyTheme(undefined, undefined, true) }} style={{ color: "black" }}>Amplia</div>
                <div className="style_option" onClick={() => { setMyTheme(undefined, undefined, false) }} style={{ color: "black" }}>Compacta</div>
            </div>
        </Modal>
        <div id="sidenavLogo" style={{ justifyContent: "center" }}>
            <img id="logo" style={{ width: show ? "170px" : "65px" }} src={company.logo_name ? `/${ company.logo_name}.svg` : ""} />
        </div>
        <Link to="/crm/cotizaciones">
            <div className="linkContent">
                <div className="circle">
                    <RiBillFill />
                </div>
                <p>Cotizaciones</p>
            </div>
        </Link>
        <Link to="/crm/configuration">
            <div className="linkContent">
                <div className="circle">
                    <AiFillSecurityScan />
                </div>
                <p>Configuración</p>
            </div>
        </Link>
        <Link to="/crm/users">
            <div className="linkContent">
                <div className="circle">
                    <HiUserCircle />
                </div>
                <p>Usuarios</p>
            </div>
        </Link>
        <Link to={"#"} onClick={() => { setOpenDrawer(true) }}>
            <div className="linkContent">
                <div className="circle">
                    <MdFormatColorFill />
                </div>
                <p>Estilo</p>
            </div>
        </Link>
    </div>
}
const Navbar = ({ show, setShow, company }: Props) => {



    return (
        <div id="nav" className={`${show ? "showLinks" : "hideLinks"}`}>
            <Links show={show} setShow={setShow}  company={company}/>
        </div>
    )
}


export default Navbar
