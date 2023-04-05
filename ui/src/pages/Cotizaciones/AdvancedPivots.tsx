import { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import TableRenderers from 'react-pivottable/TableRenderers';
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';

import 'react-pivottable/pivottable.css';
import PivotTableUI from 'react-pivottable/PivotTableUI';
import { Requester } from '../../factors/Requester';
import { Button } from 'antd';
interface PartitionInterface {

    id?: string,
    description?: string,
    unit?: string,
    quoteID?: string,
    quantity?: string,
    categoryID?: string,
    brandID?: string,
    cost?: string,
    factor?: string,
    amount?: string,
    created_by?: string,
    modified_by?: string,
    created_at?: string,
    modified_at?: string,
    category_name?: string,
    brand_name?: string,
    reference?: string,
    currency?: string,
    buyerID?: string,
    agentID?: string,
    clientID?: string,
    emitted?: string,
    expiration_date?: string,
    user_name?: string,
    user_middle_name?: string,
    user_last_name?: string,
    buyer_name?: string,
    buyer_last_name?: string,
    client_name?: string,

}

const PivotesAvanzados = ({ ...props }) => {

    const [tablePartitions, setTablePartitions] = useState<any[] | []>([])



    const loadTablePartitions = async () => {

        const savedQuotePartitions = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/partitions/read/mine", method: "get" }).send()


        setTablePartitions(savedQuotePartitions.map((partition: any) => {
            return {
                "Agente": `${partition.user_name || ""} ${partition.user_middle_name || ""} ${partition.user_last_name || ""}`,
                "FDE": new Date(partition.expiration_date).toLocaleDateString('en', {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit"
                }),
                "Comprador": `${partition.buyer_name || ""} ${partition.buyer_last_name || ""}`,
                "Categoría": partition.category_name,
                "Costo": partition.cost,
                "Estatus": partition.status,
                "Cantidad": partition.quantity,
                "Moneda": partition.currency,
                "Monto": partition.amount,
                "Client": partition.client_name,
                "FEE": new Date(partition.edd).toLocaleDateString('en', {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit"
                }),
                "Factor": partition.factor,
                "Descripción": partition.description,
                "NDC": partition.reference,
                "Unidad": partition.unit,
                "PPU": (partition.cost) * (1 + (partition.factor/100))


            }
        })
        )

    }
    useEffect(() => {



        loadTablePartitions()

    }, [])


    const [settings, setSettings] = useState({});

    const PlotlyRenderers = createPlotlyRenderers(Plot);

    return (
        <div>
 <div style={{ textAlign: "right", padding: "15px 0" }}>
        <Button onClick={() => { loadTablePartitions() }}>Refrescar</Button>
      </div>
            <PivotTableUI renderers={Object.assign({}, TableRenderers, PlotlyRenderers)} data={tablePartitions} {...settings} onChange={(s: any) => setSettings(s)} />


        </div>
    )
}

export default PivotesAvanzados