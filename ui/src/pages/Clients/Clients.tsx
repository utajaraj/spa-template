
import { Form, Spin, Table, Input, Select, Switch, Skeleton, Button } from "antd"
import { useEffect, useState } from "react";
import { Requester } from "../../factors/Requester";
import { TextSearchFilter } from "../../factors/Filters/TextSearchFilter";
import "./Clients.css";
import { notify } from "../../factors/notify";
interface ClientInterface {
    id?: string,
    active: boolean,
    accountOwnerID?: number,
    city?: string,
    client_name: string,
    client_serialization: string,
    country?: string,
    postalCode?: string,
    state?: string,
    street?: null
}

const Clients = ({ ...props }) => {

    const [clients, setClients] = useState<ClientInterface[] | any>([])
    const [users, setUsers] = useState<ClientInterface[] | any>([])
    const [clickedClient, setClickedClient] = useState<ClientInterface | any>({})

    const swapOneWithNew = (object: any, array: any, setter: any) => {

        setter(array.map((item:any)=>{
            if(item.id===object.id){
                return object
            }else{
                return item
            }
        }))
    }

    const loadResults = async () => {
        const pageDateResquests = [
            new Requester({ url: import.meta.env.VITE_APP_APIURL + "/clients/read/all", method: "get" }).send(),
            new Requester({ url: import.meta.env.VITE_APP_APIURL + "/users/read/all", method: "get" }).send(),
        ]
        const [clientsResult, usersResult] = await Promise.all(pageDateResquests)
        setClients(clientsResult)
        setUsers(usersResult)
    }

    useEffect(() => {
        loadResults()
    }, [])

    useEffect(() => {
        setFormValues(clickedClient, PatchClientForm, ["id", "active", "client_name", "accountOwnerID", "country", "state", "city", "postalCode", "tax_identifaction_number"])
    }, [clickedClient])

    const ClientsList = () => {
        if (clients.length !== 0) {
            return (
                <div>
                    <Table
                        onRow={
                            (row: any, key) => {
                                return {
                                    onClick: async (e) => {
                                        setClickedClient(row)
                                    }
                                }
                            }
                        }
                        dataSource={clients}
                        columns={
                            [
                                {
                                    key: "client_name",
                                    dataIndex: "client_name",
                                    title: "Nombre de Cliente",
                                    ...TextSearchFilter("client_name", "Nombre de Cliente"),
                                },
                            ]
                        }




                    />
                </div>
            )

        }
        return <Spin></Spin>
    }

    const [PatchClientForm] = Form.useForm()


    const changeActiveStatus = async (data: any) => {
        try {
            const changedStatus = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/clients/update/one", body: { active: !data }, method: "patch" }).send()
            if (changedStatus.status) {
                notify("success", changedStatus.message)
            } else {
                notify("error", changedStatus.message)
            }
        } catch (error) {
            notify("error", "Error al actualizar información del cliente")
        }

    }


    const PatchClient = async (body: any) => {
        try {
            const changedStatus = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/clients/update/one", body, method: "patch" }).send()
            if (changedStatus.status) {
                notify("success", changedStatus.message)
                swapOneWithNew(changedStatus.data[0],clients,setClients)
            } else {
                notify("error", changedStatus.message)
            }
        } catch (error) {
            notify("error", "Error al actualizar información del cliente")
        }

    }



    const setFormValues = (values: any, form: any, include: any) => {

        const fieldsToSet: any = []

        for (const key in values) {
            const [name, value] = [key, values[key]]
            if (include.includes(name)) {
                fieldsToSet.push({ name, value })
                values
            }
        }

        form.setFields(fieldsToSet)
    }



    const UpdateClientForm = () => {

        return (
            <div>

                <div style={{ textAlign: "right" }}>
                    <Switch className="greenRed" checkedChildren="Activo" unCheckedChildren="Inactivo" defaultChecked={clickedClient.active} onChange={() => { changeActiveStatus }} />
                </div>
                <Form form={PatchClientForm} onFinish={PatchClient}>
                    <Form.Item hidden name={"id"}>
                        <Input />
                    </Form.Item>
                    <div>
                        <label>Nombre del cliente</label>
                        <Form.Item name={"client_name"}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Dueño de cuenta</label>
                        <Form.Item name={"accountOwnerID"}>
                            <Select>
                                <Select.Option disabled selected value="">Selecciona dueño de cuenta</Select.Option>
                                {
                                    users.map((user: any, i: number) => {
                                        return <Select.Option key={`accountOwner_patch_${i}`} value={user.id}>{user.user_name} {user.user_middle_name || ""} {user.user_last_name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <label>País</label>
                        <Form.Item name={"country"}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Estado</label>
                        <Form.Item name={"state"}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Ciudad</label>
                        <Form.Item name={"city"}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Calle</label>
                        <Form.Item name={"street"}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Código postal</label>
                        <Form.Item name={"postalCode"}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Número de Contribución Fiscal</label>
                        <Form.Item name={"tax_identification_number"}>
                            <Input />
                        </Form.Item>
                    </div>
                    <Form.Item >
                        <Button htmlType="submit">Actualizar cliente</Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }

    return (
        <div>
            <h1>Clientes</h1>
            <div className="clientsContainer">
                <ClientsList />
                {
                    Object.keys(clickedClient).length ? <UpdateClientForm /> : <div></div>
                }
            </div>
        </div>
    )
}

export default Clients