import { Link } from "react-router-dom";
import { Button } from "antd"
import { useEffect, useState } from "react"
import { Requester } from "../../factors/Requester";
const Marcas = ({ ...props }) => {
    const [brands, setBrands] = useState<any>([])
    const loadBrands = async () => {
        const results = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/brands/read/all", method: "get" }).send()
        setBrands(results)
    }
    useEffect(() => {
        loadBrands()
    }, [])
    return (
        <div>

            <div>
                {
                    brands.map((brand: any, i:number) => {
                        return <p>{brand.brand_name}</p>
                    })
                }
            </div>

        </div>
    )
}

export default Marcas