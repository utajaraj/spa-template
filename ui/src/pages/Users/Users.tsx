import { Drawer, Button, Table } from "antd"
import { ColumnsType } from "antd/es/table";
import { useState } from "react";
// filterDropdown: ({
//     setSelectedKeys,
//     selectedKeys,
//     confirm,
//     clearFilters,
// }) => {
//     let keys = []
//     let input = document.getElementById(column._id)
//     let value = input ? input.value : null
//     if (value) {
//         keys = [value]
//     }
//     return (
//         <div
//             style={{
//                 padding: "10px",
//                 textAlign: "right",
//                 background: "white",
//                 width: "250px",
//             }}
//         >
//             <Input
//                 autoFocus
//                 id={column._id}
//                 placeholder="Type text here"
//                 onChange={(e) => {
//                     keys = e.target.value ? [e.target.value] : []
//                     confirm({ closeDropdown: false });
//                 }}
//                 onPressEnter={() => {
//                     setSelectedKeys(keys)
//                     confirm({ closeDropdown: true });
//                 }}
//             ></Input>
//             <hr></hr>
//             <Button
//                 style={{ border: "none" }}
//                 className="ant-btn"
//                 onClick={() => {
//                     clearFilters();
//                     confirm();
//                 }}
//             >
//                 Reset
//             </Button>
//             <Button
//                 className="ant-btn mainButton"
//                 onClick={() => {
//                     setSelectedKeys(keys)
//                     confirm({ closeDropdown: true });
//                 }}
//                 type="primary"
//             >
//                 Search
//             </Button>
//         </div>
//     );
// }
interface ColumnInterface {
    title: string,
    dataIndex: string,
    columnType: "person" | "text" | "number" | "positive",
    editable: boolean,
    filterType: "options" | "text",
    key?: any
}


const UsersColumns: Array<ColumnInterface> = [
    {
        title: "Nombre de Uusario",
        dataIndex: "useranme",
        columnType: "person",
        editable: true,
        filterType: "options",
        key: "users_column"
    },
]

const generateColumns = (columnsArray: [ColumnInterface]): ColumnsType => {
    return [{
        title: "Five",
        dataIndex: "five"
    }]
}

const Users: React.FC = () => {

    const [open, setOpen] = useState(false)
    const [users, setUser] = useState(true)

    return (
        <div id="usersPage">
            <Button onClick={() => { setOpen(true) }}>
                Add User
            </Button>
            <Drawer title="Add User" placement="right" onClose={() => { setOpen(false) }} open={open}>
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
            <Table />
        </div>
    )
}
export default Users