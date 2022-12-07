import { Drawer, Button } from "antd"
import { useState } from "react";

const Users: React.FC = () => {
    const [open, setOpen] = useState(false);


    return (
        <div id="usersPage">
            <Button onClick={()=>{setOpen(true)}}>
                Add User
            </Button>
            <Drawer title="Add User" placement="right" onClose={()=>{setOpen(false)}} open={open}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </div>
    )
}
export default Users