import { Drawer, Button, Table, Form, Input, Select, Empty, Modal } from "antd"
import { ColumnsType } from "antd/es/table";
import { useState, useEffect } from "react";
import { GiTruce } from "react-icons/gi";
import { TextSearchFilter } from "../../factors/Filters/TextSearchFilter";
import { notify } from "../../factors/notify";
import { Requester } from "../../factors/Requester";
import "./companies.css"


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


const Empresas: React.FC = () => {

    const [selectedCompany, setSelectedCompany] = useState<CompanyInterface | {}>({})
    const [companies, setCompanies] = useState<CompanyInterface[] | []>([])
    const [companySites, setCompanySites] = useState<CompanySitesInterface[] | []>([])
    const [selectedCompanySite, setSelectedCompanySite] = useState<CompanySitesInterface | {} | any>({})

    const loadCompanies = async () => {
        const results = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/companies/read/all", method: "get" }).send()
        setCompanies(results)
    }

    const selectCompany = async (id: Number) => {

        const selectedCompany = companies.filter(company => company.id === id)
        const results = await new Requester({ url: import.meta.env.VITE_APP_APIURL + `/companysites/read/id/${id}`, method: "get" }).send()

        setCompanySites(results)

        setSelectedCompany(selectedCompany[0])

    }

    useEffect(() => {
        loadCompanies()
    }, [])

    const patchCompany = async (fields: any) => {
        try {
            const result = await new Requester({ url: import.meta.env.VITE_APP_APIURL + `/companies/update/one`, method: "patch", body: fields }).send()
            if (result.status === true) {
                setSelectedCompany(fields)

                setCompanies(companies.map((company) => {
                    if (company.id === fields.id) {
                        return fields
                    } else {
                        return company
                    }
                }))
                notify("success", result.message || "Información de empresa actualizada.")
            } else {

                notify("error", result.message || "No se pudo actualizar la información de la empresa.")
            }
        } catch (error: any) {

            notify("error", error.message || "Error al actualizar la información de la empresa.")
        }
    }


    const patchCompanySite = async (fields: any) => {
        const result = await new Requester({ url: import.meta.env.VITE_APP_APIURL + `/companysites/update/one`, method: "patch", body: fields }).send()
        if (result.status === true) {
            setCompanySites(companySites.map((companySite) => {
                if (companySite.id === fields.id) {
                    return fields
                } else {
                    return companySite
                }
            }))
            notify("success", result.message || "Información de sucursal actualizada.")
        } else {
            notify("error", result.message || "No se pudo actualizar la información de la sucursal.")
        }
    }

    const [CompanyForm] = Form.useForm()

    const EditCompanyForm = () => {
        const selection: any = selectedCompany
        const { company_name, address, id, tax_id } = selection
        return <div className="updateCompanyForm">
            <h2>Información de la Empresa.</h2>
            <Form form={CompanyForm} onFinish={(fields) => { patchCompany(fields) }}>
                <Form.Item hidden initialValue={id} name="id" rules={[{ required: true, message: "ID es requerido." }]}>
                    <Input />
                </Form.Item>
                <div>
                    <label>Nombre de  la Empresa <span className='requiredMark' /></label>
                    <Form.Item initialValue={company_name} name="company_name" rules={[{ required: true, message: "Nombre es requerido." }]}>
                        <Input />
                    </Form.Item>
                </div>
                <div>
                    <label>Dirección Fiscal <span className='requiredMark' /></label>
                    <Form.Item initialValue={address} name="address" rules={[{ required: true, message: "Número es onbligatorio." }]}>
                        <Input />
                    </Form.Item>
                </div>
                <div>
                    <label>Número indentificador Fiscal <span className='requiredMark' /></label>
                    <Form.Item initialValue={tax_id} name="tax_id" rules={[{ required: true, message: "Número es onbligatorio." }]}>
                        <Input />
                    </Form.Item>
                </div>
                <Button htmlType="submit">Guardar Empresa</Button>
            </Form>
        </div>
    }


    const submitNewCompany = async () => {
        const result = await new Requester({ url: import.meta.env.VITE_APP_URL, method: "post" }).send()
        if (result.status === true) {
            notify("success", result.message || "Nueva empresa ha sido creada")
            setCompanies([...companies, result.data[0]])
        }
    }

    const submitNewCompanySite = async () => {
        const result = await new Requester({ url: import.meta.env.VITE_APP_URL, method: "post" }).send()
        if (result.status === true) {
            notify("success", result.message || "Error al crear nueva sucursal")
            setCompanySites([...companySites, result.data[0]])
        }
    }

    const [newCompanyModalVisible, setNewCompanyModalVisible] = useState<boolean>(false)

    const NewCompanyModal = () => {
        const [newCompanyForm] = Form.useForm()
        return <Drawer open={newCompanyModalVisible} closable onClose={() => { setNewCompanyModalVisible(false) }}>
            <Form form={newCompanyForm}>
                <div>
                    <label>Nombre de  la Empresa <span className='requiredMark' /></label>
                    <Form.Item name="company_name" rules={[{ required: true, message: "Nombre es requerido." }]}>
                        <Input />
                    </Form.Item>
                </div>
                <div>
                    <label>Dirección Fiscal <span className='requiredMark' /></label>
                    <Form.Item name="address" rules={[{ required: true, message: "Dirección es onbligatorio." }]}>
                        <Input />
                    </Form.Item>
                </div>
                <div>
                    <label>Número indentificador Fiscal <span className='requiredMark' /></label>
                    <Form.Item name="tax_id" rules={[{ required: true, message: "Número es onbligatorio." }]}>
                        <Input />
                    </Form.Item>
                </div>
            </Form>
        </Drawer>
    }

    const [newCompanySiteModalVisible, setNewCompanySiteModalVisible] = useState<boolean>(false)

    const NewCompanySiteModal = () => {
        const [newCompanySiteForm] = Form.useForm()
        return <Drawer open={newCompanySiteModalVisible} closable onClose={() => { setNewCompanySiteModalVisible(false) }}>
            <Form form={newCompanySiteForm}>
                <div>
                    <label>Nombre de  la sucursal <span className='requiredMark' /></label>
                    <Form.Item name="company_site_name" rules={[{ required: true, message: "Nombre es requerido." }]}>
                        <Input />
                    </Form.Item>
                </div>
                <div>
                    <label>Dirección Fiscal <span className='requiredMark' /></label>
                    <Form.Item name="address" rules={[{ required: true, message: "Número es onbligatorio." }]}>
                        <Input />
                    </Form.Item>
                </div>
            </Form>
        </Drawer>
    }

    const [CompanySiteForm] = Form.useForm()

    const EditCompanySiteForm = () => {
        const selection: any = selectedCompanySite
        const { company_site_name, address, id } = selection
        return <div className="updateCompanySiteForm">
            <h2>Información de la Sucursal.</h2>
            <Form form={CompanySiteForm} onFinish={(fields) => { patchCompanySite(fields) }}>
                <Form.Item hidden initialValue={id} name="id" rules={[{ required: true, message: "ID es requerido." }]}>
                    <Input />
                </Form.Item>
                <div>
                    <label>Nombre de  la sucursal <span className='requiredMark' /></label>
                    <Form.Item initialValue={company_site_name} name="company_site_name" rules={[{ required: true, message: "Nombre es requerido." }]}>
                        <Input />
                    </Form.Item>
                </div>
                <div>
                    <label>Dirección Fiscal <span className='requiredMark' /></label>
                    <Form.Item initialValue={address} name="address" rules={[{ required: true, message: "Número es onbligatorio." }]}>
                        <Input />
                    </Form.Item>
                </div>
                <Button htmlType="submit">Guardar Sucursal</Button>
            </Form>
        </div>
    }


    const loadSiteForm = async (id: number) => {

        const companySiteSelection = companySites.filter(companySite => companySite.id === id)
        setSelectedCompanySite(companySiteSelection[0])
    }

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "0 0 35px" }}>
                <Button style={{ marginRight: "15px" }} onClick={() => { setNewCompanyModalVisible(true) }}>
                    Nueva Empresa
                </Button>
                <Button onClick={() => { setNewCompanySiteModalVisible(true) }}>
                    Nueva Sucursal
                </Button>
            </div>
            <div>
                <NewCompanySiteModal />
                <NewCompanyModal />
            </div>
            <div id="companiesPage">
                <div className="companiesAndSites">
                    <Select defaultValue={""}
                        style={{ width: "100%" }}
                        showSearch
                        onChange={(id) => { selectCompany(Number(id)) }}
                        optionFilterProp="children"
                        filterOption={(input, option) => (option?.label ?? '').includes(input)}
                        filterSort={(optionA: any, optionB: any) =>
                            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                        }>
                        <Select.Option value="" disabled selected>
                            Selecciona empresa
                        </Select.Option>
                        {
                            !companies.length || companies.map((company, i) => {
                                return <Select.Option key={`company-${i}`} value={company.id}>
                                    {company.company_name}
                                </Select.Option>
                            })
                        }
                    </Select>
                    {
                        !companySites.length || companySites.map((site: any, i) => {
                            return <div className={`CompanySiteSelector ${selectedCompanySite.id === site.id ? "active" : ""}`} key={`companySite_selector_${i}`} onClick={() => { loadSiteForm(site.id) }}>
                                {site.company_site_name}
                            </div>
                        })
                    }
                </div>
                <div style={{ padding: "35px 15px" }}>
                    {
                        Object.keys(selectedCompany).length === 0
                            ? <Empty description="Selecciona una empresa" />
                            : <EditCompanyForm />
                    }
                    {
                        Object.keys(selectedCompany).length !== 0
                            ?
                            Object.keys(selectedCompanySite).length === 0
                                ? <Empty description="Selecciona una sucursal" />
                                : <EditCompanySiteForm />

                            : null
                    }

                </div>
            </div>
        </div>
    )
}
export default Empresas