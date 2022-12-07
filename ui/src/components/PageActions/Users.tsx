import { Button } from "antd"
import { Dispatch } from "react"
interface Props {
    setShowUsers: Dispatch<boolean>
}
const UsersActions = ({ setShowUsers }: Props) => {
    return (
        <div>
            <Button onClick={() => { setShowUsers(true) }}>
                New User
            </Button>
        </div>

    )
}

export default UsersActions