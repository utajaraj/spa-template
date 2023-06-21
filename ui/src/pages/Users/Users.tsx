import { Drawer, Button, Table, Form, Input, Select, Modal, Switch } from "antd"
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
    active: boolean,
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

interface CompanySitesInterface {
    id: number,
    companyID: string,
    company_site_name: string,
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
    const [companies, setCompanies] = useState<CompanyInterface[] | []>([])
    const [users, setUsers] = useState<UsersInterface[] | []>([])


    const loadCompanySites = async (id: any) => {

        try {
            const companySitesResult = await new Requester({ url: import.meta.env.VITE_APP_APIURL + `/companysites/read/id/${id}`, method: "get" }).send()
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
            setUsers(usersResult.map((user: any, i: number) => {
                user.key = `user-${i}`
                return user
            }))
        } catch (error) {
            notify("error", "No se pudieron cargar los usuarios")
        }
    }


    useEffect(() => {
        loadUsers()
        loadCompanies()
    }, [])

    const [createUserForm] = Form.useForm()
    const createUser = async (form: UsersInterface) => {
        const newUserResult = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/users/create/one", method: "post", body: form }).send()
        if (newUserResult.status) {
            loadUsers()
            notify("success", "Usario creado con éxito")
            createUserForm.resetFields()
            return
        } else {
            notify("error", "Error al crear usuario", newUserResult.message || "Contacta al administrador")
        }
    }

    const [selectedUserRow, setSelectedUserRow] = useState<{} | UsersInterface>({})
    const [editUserDrawerVisible, setEditUserDrawerVisible] = useState<boolean>(false)
    const [updateUserForm] = Form.useForm()
    const editUserDrawerTitle: any = selectedUserRow
    const title = Object.keys(editUserDrawerTitle) ? "Actualizar usuario" : `Actualizar ${editUserDrawerTitle.user_name}`
    const [activationForm] = Form.useForm()

    const updateUser = async (user: UsersInterface) => {
        const body = user
        body.active = !body.active
        const updatedUserResult = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/users/update/one", method: "patch", body: body }).send()
        if (user.active !== undefined) {
            activationForm.setFieldValue("active", body.active)
        }
        if (updatedUserResult.status) {
            loadUsers()
            notify("success", "Usario actualizado con éxito")
            return
        } else {
            notify("error", "Error al crear usuario", updatedUserResult.message || "Contacta al administrador")
        }
    }



    const StatusForm = () => {
        useEffect(() => {
        }, [activationForm])
        return <Form style={{ padding: "15px 0", textAlign: "right" }} form={activationForm} onFinish={updateUser}>

            <Form.Item hidden={true} name="id" rules={[{ required: true, message: "Usuario es requerido." }]}>
                <Input />
            </Form.Item>

            <Form.Item hidden={true} name="active" rules={[{ required: true, message: "Estatus es requerido." }]}>
                <Input />
            </Form.Item>

            <Switch className="greenRed" checkedChildren="Activo" unCheckedChildren="Inactivo" defaultChecked={activationForm.getFieldValue("active")} onChange={() => { activationForm.submit() }} />
        </Form>
    }


    return (
        <div id="usersPage">
            <Drawer title={title} open={editUserDrawerVisible} closable onClose={() => { setEditUserDrawerVisible(false) }}>

                <StatusForm />

                <Form form={updateUserForm} onFinish={updateUser}>
                    <div>
                        <Form.Item hidden={true} name="id" rules={[{ required: true, message: "Usuario es requerido." }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Correo <span className='requiredMark' /></label>
                        <Form.Item name="email" rules={[{ required: true, message: "Correo es requerido." }]}>
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
                        <Form.Item name={"companyID"} rules={[{ required: true, message: "Empresa es obligatorio." }]}>
                            <Select onChange={loadCompanySites}>
                                {
                                    companies.map((company, i) => {
                                        return <Select.Option value={company.id}>
                                            {company.company_name}
                                        </Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <label>Sucursal <span className='requiredMark' /></label>
                        <Form.Item name="company_siteID" rules={[{ required: true, message: "Sucursal ese requerido." }]}>
                            <Select>
                                {
                                    companySites.map((companySite, i) => {
                                        return <Select.Option value={companySite.id}>
                                            {companySite.company_site_name}
                                        </Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <Button htmlType="submit">Actualizar usuario</Button>
                    </div>
                </Form>
            </Drawer>
            <div style={{ padding: "15px 0", textAlign: "right" }}>
                <Button onClick={() => { setOpen(true) }}>
                    Nuevo Usuario
                </Button>
            </div>
            <Drawer title="Agregar Usuario" placement="right" onClose={() => { setOpen(false) }} open={open}>
                <Form form={createUserForm} onFinish={createUser}>
                    <div>
                        <label>Correo <span className='requiredMark' /></label>
                        <Form.Item name="email" rules={[{ required: true, message: "Correo ese requerido." }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Contraseña <span className='requiredMark' /></label>
                        <Form.Item name="password" rules={[{ required: true, message: "Contraseña es requerida." }]}>
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
                        <Form.Item initialValue={""} rules={[{ required: true, message: "Empresa es obligatorio." }]}>
                            <Select onChange={loadCompanySites} defaultValue={""}>
                                <Select.Option value={""} selected disabled>
                                    Selecciona una empresa
                                </Select.Option>
                                {
                                    companies.map((company, i) => {
                                        return <Select.Option value={company.id}>
                                            {company.company_name}
                                        </Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <label>Sucursal <span className='requiredMark' /></label>
                        <Form.Item name="company_siteID" rules={[{ required: true, message: "Sucursal ese requerido." }]}>
                            <Select defaultValue={""}>
                                <Select.Option value={""} selected disabled>
                                    Selecciona una sucursal
                                </Select.Option>
                                {
                                    companySites.map((companySite, i) => {
                                        return <Select.Option value={companySite.id}>
                                            {companySite.company_site_name}
                                        </Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    <div style={{ padding: "15px 0", textAlign: "right" }}>
                        <Button htmlType="submit">Agregar usuario</Button>
                    </div>
                </Form>
            </Drawer>

            <Table
                onRow={
                    (row: any, key) => {
                        return {
                            onClick: async (e) => {
                                activationForm.setFields([
                                    {
                                        name: "active",
                                        value: row.active || false
                                    },
                                    {
                                        name: "id",
                                        value: row.id
                                    },
                                ])

                                await loadCompanySites(row.companyID)
                                updateUserForm.setFields([
                                    {
                                        name: "user_name",
                                        value: row.user_name
                                    },
                                    {
                                        name: "id",
                                        value: row.id
                                    },
                                    {
                                        name: "user_middle_name",
                                        value: row.user_middle_name
                                    },
                                    {
                                        name: "user_last_name",
                                        value: row.user_last_name
                                    },
                                    {
                                        name: "email",
                                        value: row.email
                                    },
                                    {
                                        name: "companyID",
                                        value: Number(row.companyID)
                                    },
                                    {
                                        name: "company_siteID",
                                        value: Number(row.company_siteID)
                                    },

                                ])
                                setEditUserDrawerVisible(true)
                                setSelectedUserRow(row)
                            }
                        }
                    }
                }
                dataSource={users} columns={[
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