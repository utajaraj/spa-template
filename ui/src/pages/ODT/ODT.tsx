import { Link } from "react-router-dom";
import { Button } from "antd"

const ODT = ({ ...props }) => {

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Módulo en ordenes de trabajo</h1>

            <div style={{ textAlign: "center" }}>
                <Link to="/crm/cotizaciones">
                    <Button>
                        Cotizaciones
                    </Button>
                </Link>
            </div>

        </div>
    )
}

export default ODT