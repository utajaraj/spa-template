import { Link } from "react-router-dom";
import { Button } from "antd"
import { useEffect, useState } from "react"
import { Requester } from "../../factors/Requester";
const Categories = ({ ...props }) => {
    const [categories, setCategories] = useState<any>([])
    const loadCategories = async () => {
        const results = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/categories/read/all", method: "get" }).send()
        setCategories(results)
    }
    useEffect(() => {
        loadCategories()
    }, [])
    return (
        <div className="catalogueContainer">

            <div>
                {
                    categories.map((category: any, i:number) => {
                        return <p>{category.category_name}</p>
                    })
                }
            </div>

        </div>
    )
}

export default Categories