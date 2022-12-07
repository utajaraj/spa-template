import { useParams } from "react-router-dom"

const Analytics = ({ ...props }) => {
    let { name } = useParams()
    return <h1>{name}</h1>
}

export default Analytics