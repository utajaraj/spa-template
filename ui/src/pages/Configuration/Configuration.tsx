import { Link } from "react-router-dom";
import { Button } from "antd"

const Configuration = ({ ...props }) => {

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Módulo de configuración</h1>

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

export default Configuration