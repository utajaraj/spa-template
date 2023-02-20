import { Link } from "react-router-dom";
import { Button } from "antd"

const Clients = ({ ...props }) => {

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Módulo de clientes</h1>

            <div style={{ textAlign: "center" }}>
                <Link to="/cotizaciones">
                    <Button>
                        Cotizaciones
                    </Button>
                </Link>
            </div>

        </div>
    )
}

export default Clients