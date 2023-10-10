import { Drawer, Table, Form, Input, Select, Modal, Switch, message } from "antd"
import { ColumnsType } from "antd/es/table";
import { useState, useEffect, useRef } from "react";
import { TextSearchFilter } from "../../factors/Filters/TextSearchFilter";
import { notify } from "../../factors/notify";
import { Requester } from "../../factors/Requester";
import { AiFillLock, AiFillCopy, AiFillPlusCircle, AiFillCheckCircle } from "react-icons/ai";
import { BsFillShieldLockFill } from "react-icons/bs"
import MyButton from "../../components/Navbar/MyButton";
import toClipBoard from "../../factors/toClipBoard"
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


const Users: React.FC = () => {

    const [open, setOpen] = useState(false)
    const [users, setUsers] = useState<UsersInterface[] | []>([])
    const [openPasswordReset, setOpenPasswordReset] = useState(false)
    const [messageApi, contextHolder] = message.useMessage();


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

    const openResetModal = () => {
        setOpenPasswordReset(true)
    }
    const closeResetModal = () => {
        setOpenPasswordReset(false)
    }

    const NewPasswordRef = useRef(null)

    const generateRandomNist = async (): Promise<string> => {
        const { GeneratePassword } = await import("js-generate-password")

        const password = GeneratePassword({
            length: 14,
            symbols: true,
        });

        return password
    }

    const clipboardNotification = (value: string) => {
        toClipBoard(value)
        messageApi.open({
            type: "success",
            content: "Contraseña copiada."
        })
    }


    function ResetModal() {
        const inputRef: any = useRef(null)
        const setGen = async () => {
            inputRef.current.value = await generateRandomNist()
        }

        const saveNewPass = async () => {
            try {
                const newPasswordSet = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/users/update/password", method: "patch", body: { password: inputRef.current.value } }).send()
                if (newPasswordSet.status) {
                    notify("success", "Contraseña actualizada con éxito")
                    return
                } else {
                    notify("error", "Error al actualizar contraseña", newPasswordSet.message || "Contacta al administrador")
                }
            } catch (error) {
                notify("error", "Error inesperado en el servidor contacta al administrador.")
            }
        }

        return <Modal open={openPasswordReset} onCancel={closeResetModal} footer={null} >
            <h2>Restablecer contraseña</h2>
            <p>Para restablecer la contraseña puedes generar una o crear una tú.</p>
            <MyButton icon={<BsFillShieldLockFill />} text="Generar" onClick={setGen} />
            <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
                <AiFillCopy onClick={() => { inputRef.current ? clipboardNotification(inputRef.current.value) : notify("error", "Error al copiar texto", "Por favor copialo por tu cuenta.") }} style={{ position: "absolute", fontSize: "24px", marginRight: "15px", cursor: "pointer" }} />
                <input ref={inputRef} />
            </div>
            <MyButton icon={<AiFillCheckCircle />} text="Guardar contraseña" onClick={saveNewPass} />
        </Modal>
    }

    return (
        <div id="usersPage">
            {contextHolder}
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
                    <div style={{ marginBottom: "24px" }}>
                        <ResetModal />
                        <label>Contraseña</label>
                        <MyButton onClick={openResetModal} icon={<AiFillLock />} text="Restablecer contraseña" style={{ width: "100%" }} />
                    </div>
                    <div>
                        <label>Nombre <span className='requiredMark' /></label>
                        <Form.Item name="user_name" rules={[{ required: true, message: "Nombre es onbligatorio." }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Apellido <span className='requiredMark' /></label>
                        <Form.Item name="user_last_name" rules={[{ required: true, message: "Apellido se requerido." }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <MyButton icon={<AiFillLock />} text="Actualizar usuario" />
                </Form>
            </Drawer>
            <MyButton icon={<AiFillPlusCircle />} text="Agregar usuario" onClick={() => { setOpen(true) }} />
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
                        <label>Apellido <span className='requiredMark' /></label>
                        <Form.Item name="user_last_name" rules={[{ required: true, message: "Apellido se requerido." }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <MyButton icon={<AiFillCheckCircle />} text="Agregar usuario" htmlType="submit" />
                </Form>
            </Drawer>

            <Table className="usersTable"
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
                                        name: "user_last_name",
                                        value: row.user_last_name
                                    },
                                    {
                                        name: "email",
                                        value: row.email
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
                        key: "user_last_name",
                        dataIndex: "user_last_name",
                        width: "50px",
                        title: "Apellido",
                        ...TextSearchFilter("user_last_name", "Apellido"),
                    }
                ]} />
        </div>
    )
}
export default Users