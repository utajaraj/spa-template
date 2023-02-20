import { Drawer, Button, Table, Form, Input, Select } from "antd"
import { ColumnsType } from "antd/es/table";
import { useState } from "react";

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


const Users: React.FC = () => {

    const [open, setOpen] = useState(false)
    const [users, setUser] = useState(true)

    return (
        <div id="usersPage">
            <Button onClick={() => { setOpen(true) }}>
                Add User
            </Button>
            <Drawer title="Add User" placement="right" onClose={() => { setOpen(false) }} open={open}>
                <Form>
                    <div>
                        <label>Correo <span className='requiredMark' /></label>
                        <Form.Item name="email" rules={[{ required: true, message: "Correo ese requerido" }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Nombre <span className='requiredMark' /></label>
                        <Form.Item name="user_nam" rules={[{ required: true, message: "Correo ese requerido" }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Segundo Nombre <span className='requiredMark' /></label>
                        <Form.Item name="user_middle_name" rules={[{ required: true, message: "Correo ese requerido" }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Apellido <span className='requiredMark' /></label>
                        <Form.Item name="user_last_name" rules={[{ required: true, message: "Correo ese requerido" }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Planta <span className='requiredMark' /></label>
                        <Form.Item name="companySiteID" rules={[{ required: true, message: "Correo ese requerido" }]}>
                            <Select>
                                <Select.Option>
                                    Ciudad Juárez
                                </Select.Option>
                                <Select.Option>
                                    Chihuahua
                                </Select.Option>
                                <Select.Option>
                                    Hermosillo
                                </Select.Option>
                                <Select.Option>
                                    Cancún
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <label>Rol <span className='requiredMark' /></label>
                        <Form.Item name="roleID" rules={[{ required: true, message: "Correo ese requerido" }]}>
                            <Select>
                                <Select.Option>
                                    Gerente General
                                </Select.Option>
                                <Select.Option>
                                    Gerente de Sucursal
                                </Select.Option>
                                <Select.Option>
                                    Vendedor
                                </Select.Option>
                                <Select.Option>
                                    Consultor Externo
                                </Select.Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <label>Contraseña <span className='requiredMark' /></label>
                        <Form.Item name="email" rules={[{ required: true, message: "Correo ese requerido" }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <Button htmlType="submit">Agregar usuario</Button>
                    </div>
                </Form>
            </Drawer>
            <Table />
        </div>
    )
}
export default Users