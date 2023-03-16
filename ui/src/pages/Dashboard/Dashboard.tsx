import { Link } from "react-router-dom";
import { Button } from "antd"
import { useParams } from "react-router-dom"


const Dashboard = ({ ...props }) => {

    return (
        <div>
            <h1 style={{ textAlign: "center" }}>Intranet de Ventas Aliado</h1>

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

export default Dashboard