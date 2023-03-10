import { Drawer, Button, Table, Form, Input, Select } from "antd"
import { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { NumberRangeFilter } from "../../factors/Filters/NumberRangeFilter";
import { TextSearchFilter } from "../../factors/Filters/TextSearchFilter";
import { notify } from "../../factors/notify";
import { Requester } from "../../factors/Requester";

interface ColumnInterface {
    title: string,
    dataIndex: string,
    columnType: "person" | "text" | "number" | "positive",
    editable: boolean,
    key?: any
}

interface UsersInterface {
    id: number,
    user_name: string,
    user_middle_name?: string,
    user_last_name: string,
    email: string,
    color: string,
    collapsed: boolean,
    theme: boolean,
    password: string,
    company_siteID: number,
    roleID: number,
    created_by: number,
    modified_by: number,
    created_at: string,
    modified_at: string,
}

interface RolesInterface {
    id: number,
    role_name: string,
    quotes_permission: string,
    clients_permission: string,
    buyers_permission: string,
    wos_permission: boolean,
    users_permission: string,
    configuration_permission: boolean,
    modified_by: number,
    modified_at: string,
}

interface CompanySitesInterface {
    id: number,
    companyID: string,
    site_name: string,
    company_site_address: string,
    created_at: string,
    created_by: number,
    modified_at: string,
    modified_by: number,
}


interface CompanyInterface {
    id: number,
    companyID: string,
    company_name: string,
    company_address: string,
    created_at: string,
    created_by: number,
    modified_at: string,
    modified_by: number,
}



const Users: React.FC = () => {

    const [open, setOpen] = useState(false)
    const [companySites, setCompanySites] = useState<CompanySitesInterface[] | []>([])
    const [roles, setRoles] = useState<RolesInterface[] | []>([])
    const [companies, setCompanies] = useState<CompanyInterface[] | []>([])
    const [users, setUsers] = useState<UsersInterface[] | []>([])


    const loadCompanySites = async () => {
        const companySitesResult = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/companysites/read/all", method: "get" }).send()
        try {
            setCompanySites(companySitesResult)
        } catch (error) {
            notify("error", "No se pudieron cargar las sucursales.")
        }
    }

    const loadCompanies = async () => {
        const companiesResult = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/companies/read/all", method: "get" }).send()
        try {
            setCompanies(companiesResult)
        } catch (error) {
            notify("error", "No se pudieron cargar las sucursales.")
        }
    }

    const loadUsers = async () => {
        const usersResult = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/users/read/all", method: "get" }).send()
        try {
            setUsers(usersResult.map((user:any,i:number)=>{
                user.key=`user-${i}`
                return user
            }))
        } catch (error) {
            notify("error", "No se pudieron cargar los usuarios")
        }
    }


    useEffect(() => {
        loadUsers()
        loadCompanies()
        loadCompanySites()
    }, [])

    return (
        <div id="usersPage">
            <div>
                <Button onClick={() => { setOpen(true) }}>
                    Agregar Usuario
                </Button>
            </div>
            <Drawer title="Agregar Usuario" placement="right" onClose={() => { setOpen(false) }} open={open}>
                <Form>
                    <div>
                        <label>Correo <span className='requiredMark' /></label>
                        <Form.Item name="email" rules={[{ required: true, message: "Correo ese requerido." }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Nombre <span className='requiredMark' /></label>
                        <Form.Item name="user_name" rules={[{ required: true, message: "Nombre es onbligatorio." }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Segundo Nombre <span className='requiredMark' /></label>
                        <Form.Item name="user_middle_name">
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Apellido <span className='requiredMark' /></label>
                        <Form.Item name="user_last_name" rules={[{ required: true, message: "Apellido se requerido." }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Empresa <span className='requiredMark' /></label>
                        <Form.Item initialValue={""} name="companySiteID" rules={[{ required: true, message: "Empresa es obligatorio." }]}>
                            <Select defaultValue={""}>
                                <Select.Option value={""} selected disabled>
                                    Selecciona una empresa
                                </Select.Option>

                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <label>Sucursal <span className='requiredMark' /></label>
                        <Form.Item name="companySiteID" rules={[{ required: true, message: "Sucursal ese requerido." }]}>
                            <Select defaultValue={""}>
                                <Select.Option value={""} selected disabled>
                                    Selecciona una sucursal
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

            <Table dataSource={users} columns={[
                {
                    key: "user_name",
                    dataIndex: "user_name",
                    width: "50px",
                    title: "Nombre",
                    ...TextSearchFilter("user_name", "Nombre"),
                },
                {
                    key: "user_middle_name",
                    dataIndex: "user_middle_name",
                    width: "50px",
                    title: "Segundo Nombre",
                    ...TextSearchFilter("user_middle_name", "Segundo Nombre"),
                },
                {
                    key: "user_last_name",
                    dataIndex: "user_last_name",
                    width: "50px",
                    title: "Apellido",
                    ...TextSearchFilter("user_last_name", "Apellido"),
                },
                {
                    key: "role_name",
                    dataIndex: "role_name",
                    width: "50px",
                    title: "Rol",
                    ...TextSearchFilter("role_name", "Rol"),
                },
                {
                    key: "company_site_name",
                    dataIndex: "company_site_name",
                    width: "85px",
                    title: "Sucursal",
                    ...TextSearchFilter("company_site_name", "Sucursal"),
                },
            ]} />
        </div>
    )
}
export default Users