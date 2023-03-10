import { useState, useEffect, useRef } from 'react';
import { PuffLoader } from "react-spinners"
import { Form, Input, Button, Select, DatePicker, InputNumber, Divider, Space, Table, Tooltip, Checkbox } from 'antd';
import type { FormInstance } from 'antd';
import { Subject } from 'rxjs';
import dayjs from 'dayjs'
import { MdOutlinePlusOne } from 'react-icons/md';
import { Requester } from "../../factors/Requester"
import { notify } from '../../factors/notify';
import { addRowsWithCalculations } from '../../factors/AddRowsWithCalculations';

function addMinutes(date: any,) {
    return new Date(date.getTime() + date.getTimezoneOffset() * 60000);
}


// type declarations on state setters

// created partition stream
const eventStream = new Subject();

// loaded saved partitions stream
const savedQuotesPartitionStream = new Subject();
const isDecimal = (string: any) => {
    return /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/.test(string)
}

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',

});

const streamPartition = function (object: {}) {
    eventStream.next(object);
}

const streamPartitions = function (partitions: {}) {
    savedQuotesPartitionStream.next(partitions);
}



interface QuoteItemInterface {
    id: number,
    partition_name: string,
    description: string,
    category?: string,
    brand?: string,
    quantity: BigInteger,
    amount: number,
    cost: number,
    factor: number
}
interface QuoteInterface {
    id: number,
    reference: string,
    currency: string,
    clientID?: number,
    dateOfExpiration?: string,
    buyerID?: number,
    agentID?: number,
    client_name: string,
    created_at: string
}


interface BrandsInterface {
    id: number,
    brand_name: string,
    created_at?: string,
    created_by?: string,
    modified_at?: string,
    modified_by?: string,
}

interface CategoriesInterface {
    id: number,
    category_name: string,
    created_at?: string,
    created_by?: string,
    modified_at?: string,
    modified_by?: string,
}

interface ClientInterface {
    id: number,
    client_name: string,
    accountOwnerID: number,
    street?: string,
    postalCode?: string,
    city?: string,
    state?: string,
    country?: string,
}

interface BuyerInterface {
    id: number,
    buyer_name: string,
    buyer_last_name?: number,
    clientID?: string,
    created_at?: string,
    created_by?: string,
    modified_at?: string,
    modified_by?: string,
}


interface AgentsInterface {
    id: number,
    user_name: string,
    user_middle_name: string,
    user_last_name: string,
    email: string,
    assignedPhone: string,
    rfc: string,
    curp: string,
    city_id: string,
    state_id: string,
    country_id: string,
    position_id: string,
    department_id: string,
    role: string,
    username: string,
    created_by: string,
    modified_by: string,
    created_at: string,
    modified_at: string,
}

const units = (
    <Form.Item name={"unit"}>
        <Select defaultValue="pzs" style={{ width: 85 }}>
            <Select.Option value="pzs">Piezas</Select.Option>
            <Select.Option value="lt">Litros</Select.Option>
            <Select.Option value="kg">Kilos</Select.Option>
            <Select.Option value="unt">Unidades</Select.Option>
            <Select.Option value="mt">Metros</Select.Option>
            <Select.Option value="mt3">Metros³</Select.Option>
        </Select>
    </Form.Item>
);



const Sign = (
    <Select defaultValue="add" style={{ width: 60 }}>
        <Select.Option value="add">+</Select.Option>
        <Select.Option value="minus">-</Select.Option>
    </Select>
);

interface PartitionInterface {
    calculatedRow?: boolean
    id?: string,
    name: string,
    description: string,
    created_by: string,
    modified_by: string,
    quoteID?: number,
    categoryID?: number,
    brandID?: number,
    quantity?: number,
    cost?: number,
    factor?: number,
    amount?: number,
}

const QuotePartitionForm = (props: any) => {
    const [createQuoteItemForm]: [FormInstance] = Form.useForm()
    const [partitionAmount, setPartitionAmount] = useState<any>(0)
    const [brands, setBrands] = useState<BrandsInterface[] | []>([])
    const [categories, setCategories] = useState<CategoriesInterface[] | []>([])


    const calculatePartitionAmount = () => {


        const cost: number = createQuoteItemForm.getFieldValue("cost")
        const factor: number = createQuoteItemForm.getFieldValue("factor")
        const quantity: number = createQuoteItemForm.getFieldValue("quantity")


        if (isDecimal(cost) && isDecimal(factor) && isDecimal(quantity)) {
            const amount = parseFloat((Number(cost) * (1 + (Number(factor) / 100))).toFixed(4)) * quantity
            setPartitionAmount(amount)
            createQuoteItemForm.setFieldValue("amount", amount)
        }
    }


    const postBrand = async () => {

        const { value }: any = document.getElementById("newBrandField")
        const element: any = document.getElementById("newBrandField")
        const body: {} = {
            brand_name: value
        }
        const createBrand = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/brands/create/one", method: "post", body }).send()

        if (createBrand.status) {
            // empty addeed field
            element.value = ""
            notify("success", createBrand.message, "")
            setBrands([...brands, createBrand.data[0]])
        } else {
            notify("error", createBrand.message, "")
        }
    }


    const postCategory = async () => {

        const { value }: any = document.getElementById("newCategoryField")
        const element: any = document.getElementById("newCategoryField")
        const body: {} = {
            category_name: value
        }
        const createCategory = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/categories/create/one", method: "post", body }).send()

        if (createCategory.status) {
            // empty addeed field
            element.value = ""
            notify("success", createCategory.message, "")
            setCategories([...categories, createCategory.data[0]])
        } else {
            notify("error", createCategory.message, "")
        }
    }


    const loadPartitionSelects = async () => {
        const [brands, categories] = await Promise.all([new Requester({ url: import.meta.env.VITE_APP_APIURL + "/brands/read/all", method: "get" }).send(), new Requester({ url: import.meta.env.VITE_APP_APIURL + "/categories/read/all", method: "get" }).send()])
        if (brands.status !== false) {
            setBrands(brands)
        }
        if (categories.status !== false) {

            setCategories(categories)
        }


    }

    useEffect(() => {
        loadPartitionSelects()
        return calculatePartitionAmount()
    }, [])
    return (
        <div>
            <Form form={createQuoteItemForm} onFinish={(values) => {

                document.getElementById("submitPartition")?.setAttribute("disabled", "true")
                document.getElementById("submitPartition")?.classList.add("ant-btn-loading")
                const partitionForm = { ...values }
                partitionForm.quoteID = props.quoteID
                streamPartition(partitionForm)
            }} >
                <div className="quoteCreatorFormSection">
                    <h3>Información de Partidas</h3>
                    <div>
                        <label>Nombre</label>
                        <Form.Item name="partition_name" hasFeedback rules={[{ required: true, message: "Nombre es obligatorio" }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Descripción</label>
                        <Form.Item name="description" hasFeedback rules={[{ required: true, message: "Descripción es obligatoria" }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Número de parte</label>
                        <Form.Item name="part_number" hasFeedback rules={[{ required: true, message: "Número de parte es obligatorio" }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Categoría</label>
                        <Form.Item name="categoryID" hasFeedback rules={[{ required: true, message: "Categoría es obligatoria" }]}>
                            <Select showSearch optionFilterProp="children" dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Space style={{ padding: '0 8px 4px' }}>
                                        <input
                                            placeholder="Crear nueva categoría"
                                            id="newCategoryField"
                                        />
                                        <Button type="text" icon={<MdOutlinePlusOne />} onClick={postCategory}>
                                            Crear
                                        </Button>
                                    </Space>
                                </>
                            )}>

                                <Select.Option value="" disabled>Selecciona categoría</Select.Option>
                                {
                                    categories.map((postCategory) => {
                                        return <Select.Option key={`category_id_${postCategory.id}`} value={postCategory.id}>{postCategory.category_name}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <label>Marca</label>
                        <Form.Item name="brandID" hasFeedback rules={[{ required: true, message: "Categoría es obligatoria" }]}>
                            <Select showSearch optionFilterProp="children" dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Space style={{ padding: '0 8px 4px' }}>
                                        <input
                                            placeholder="Crear nueva marca"
                                            id="newBrandField"
                                        />
                                        <Button type="text" icon={<MdOutlinePlusOne />} onClick={postBrand}>
                                            Crear
                                        </Button>
                                    </Space>
                                </>
                            )}>
                                <Select.Option value="" disabled>Selecciona marca</Select.Option>
                                {
                                    brands.map((brand) => {
                                        return <Select.Option key={`brand_id_${brand.id}`} value={brand.id}>{brand.brand_name}</Select.Option>
                                    })
                                }

                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <label>Fecha de Entrega <span className='requiredMark' /></label>
                        <Form.Item name="edd" hasFeedback rules={[{ required: true, message: "Fecha de vencimiento es obligatoria" }]}>
                            <DatePicker allowClear={false} format="MMMM Do YY" />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Cantidad</label>
                        <Form.Item name="quantity" hasFeedback rules={[{ required: true, message: "Cantidad es obligatoria" }, { pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/, message: "Este campo solo acepta decimales" }]}>
                            <InputNumber
                                addonAfter={
                                    <Form.Item name={"unit"} initialValue="pzs" noStyle>
                                        <Select defaultValue="pzs" style={{ width: 85 }}>
                                            <Select.Option value="pzs">Piezas</Select.Option>
                                            <Select.Option value="lt">Litros</Select.Option>
                                            <Select.Option value="kg">Kilos</Select.Option>
                                            <Select.Option value="unt">Unidades</Select.Option>
                                            <Select.Option value="mt">Metros</Select.Option>
                                            <Select.Option value="mt3">Metros³</Select.Option>
                                        </Select>
                                    </Form.Item>
                                }
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                onChange={calculatePartitionAmount}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Costo</label>
                        <Form.Item name="cost" hasFeedback rules={[{ required: true, message: "Costo es obligatorio" }, { pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/, message: "Este campo solo acepta decimales" }]}>
                            <InputNumber
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                onChange={calculatePartitionAmount}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Factor</label>
                        <Form.Item name="factor" hasFeedback rules={[{ required: true, message: "Factor es obligatorio" }, { pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/, message: "Este campo solo acepta decimales" }]}>
                            <InputNumber
                                min={0}
                                max={100}
                                addonBefore={"%"}
                                onChange={calculatePartitionAmount}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Monto</label>
                        <h2 style={{ margin: 0 }}>{`$ ${partitionAmount}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h2>
                        <Form.Item name="amount" hidden={true} initialValue={partitionAmount}>
                            <Input />
                        </Form.Item>
                    </div>
                </div>

                <div className='buttons-container'>
                    <Button htmlType="submit" id="submitPartition">Agregar Partida</Button>
                </div>

            </Form>

        </div>
    )
}

interface QuotePartitionsTableProps {
    setGenerateQuoteIsDisabled: any
}

const QuotePartitionsTable = (props: QuotePartitionsTableProps) => {
    const [quotePartitions, setQuotePartitions] = useState<PartitionInterface[] | []>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [selectedPartitionRows, setSelectedPartitionRows] = useState<PartitionInterface[] | []>([]);


    const deletePartition = async () => {

        const idsToDelete = selectedPartitionRows.map(partition => { return partition.id })
        try {
            const deletedQuote = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/partitions/delete/mine", method: "delete", body: { ids: idsToDelete } }).send()

            const typeOfNotification = deletedQuote.status ? "success" : "error"

            notify(typeOfNotification, deletedQuote.message)

            const remainingQuotes = quotePartitions.filter((quotePartition) => { return !idsToDelete.includes(quotePartition.id) && !quotePartition.calculatedRow })

            if (remainingQuotes.length > 0) {
                const partitionsWithAvergagesAndTotals = addRowsWithCalculations(remainingQuotes, ["cost", "factor", "amount"], "partitionsSum", "partitionsAverage")
                const newPartitions = partitionsWithAvergagesAndTotals.map((row) => {
                    const newRow = { ...row }
                    if (row.id) {
                        newRow.key = row.id.toString()
                    }

                    return newRow
                })
                props.setGenerateQuoteIsDisabled(true)
                setQuotePartitions(newPartitions)
            } else {
                props.setGenerateQuoteIsDisabled(true)
                setQuotePartitions([])
            }

        } catch (error) {
            notify("error", "Error al eliminar partida")
        }
    }

    const rowSelection = {
        //The selectedRowKeys take the value of selectedItems, so when they get patched, the selection resets
        selectedRowKeys: selectedRowKeys,
        onChange: (selectedKeys: any, selectedRows: any, clear: any) => {
            if (selectedKeys.length === 0) {
                setSelectedPartitionRows([])
                setSelectedRowKeys([]);
            } else {
                setSelectedPartitionRows(selectedRows)
                setSelectedRowKeys(selectedKeys);
            }
        },
        getCheckboxProps: (record: any) => {
            if (record.calculatedRow) {
                return {
                    disabled: true
                }
            }
        },
        selections: [
            Table.SELECTION_ALL,
            Table.SELECTION_INVERT,
            Table.SELECTION_NONE,
            {
                key: 'odd',
                text: 'Seleccionar impares',
                onSelect: (changableRowKeys: any) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((_: any, index: any) => {
                        if (index % 2 !== 0) {
                            return false;
                        }
                        return true;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
            {
                key: 'even',
                text: 'Seleccionar pares',
                onSelect: (changableRowKeys: any) => {
                    let newSelectedRowKeys = [];
                    newSelectedRowKeys = changableRowKeys.filter((_: any, index: any) => {
                        if (index % 2 !== 0) {
                            return true;
                        }
                        return false;
                    });
                    setSelectedRowKeys(newSelectedRowKeys);
                },
            },
        ],
    };



    // subscribe to load of saved quote

    useEffect(() => {
        const subscription = savedQuotesPartitionStream.subscribe({
            next(x: any) {

                if (x.length == 0) {
                    setQuotePartitions([])
                    return
                }


                const partitionsWithAvergagesAndTotals = addRowsWithCalculations(x, ["cost", "factor", "amount"], "partitionsSum", "partitionsAverage")
                const newPartitions = partitionsWithAvergagesAndTotals.map((row) => {
                    const newRow = { ...row }
                    if (row.id) {
                        newRow.key = row.id.toString()
                    }
                    return newRow
                })


                setQuotePartitions(
                    newPartitions
                )
                props.setGenerateQuoteIsDisabled(false)


            },
            error(err) {
                console.error('something wrong occurred: ' + err);
            },
            complete() {
                console.log('done');
            },
        });
        return () => {
            subscription.unsubscribe()

        }
    }, [])



    // subscribe to click of add partition
    useEffect(() => {
        const subscription = eventStream.subscribe({
            next(x) {

                (async () => {

                    const createPartition = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/partitions/create/one", method: "post", body: x }).send()


                    if (createPartition.status) {

                        const partitionsWithAvergagesAndTotals = addRowsWithCalculations([...quotePartitions.filter(x => { return !x.calculatedRow }), createPartition.data[0]], ["cost", "factor", "amount"], "partitionsSum", "partitionsAverage")
                        setQuotePartitions(partitionsWithAvergagesAndTotals.map((row) => {


                            const newRow = { ...row }
                            if (row.id) {

                                newRow.key = row.id.toString()
                            }
                            return newRow
                        })
                        )
                        props.setGenerateQuoteIsDisabled(false)
                    }

                    document.getElementById("submitPartition")?.classList.remove("ant-btn-loading")
                    document.getElementById("submitPartition")?.removeAttribute("disabled")

                    notify(createPartition.status ? "success" : "error", createPartition.message, "")

                })()


            },
            error(err) {
                console.error('something wrong occurred: ' + err);
            },
            complete() {
                console.log('done');
            },
        });
        return () => {

            subscription.unsubscribe()

        }
    }, [quotePartitions])


    return (

        <div className="quoteCreatorAddedItems">
            <div className='buttons-container'>
                <Button disabled={selectedPartitionRows.length === 0} onClick={deletePartition}>Eliminar Partida(s)</Button>
            </div>
            <Table rowSelection={{ type: "checkbox", ...rowSelection }} dataSource={quotePartitions} style={{ width: "100%" }} scroll={{ x: "100%", y: "80vh" }} columns={[
                {
                    key: "partition_name",
                    dataIndex: "partition_name",
                    width: "100px",
                    title: "Nombre"
                },
                {
                    key: "description",
                    dataIndex: "description",
                    width: "100px",
                    title: "Descripción"
                },
                {
                    key: "category",
                    dataIndex: "category_name",
                    width: "100px",
                    title: "Categoría"
                },
                {
                    key: "brand",
                    dataIndex: "brand_name",
                    width: "100px",
                    title: "Marca"
                },
                {
                    key: "quantity",
                    dataIndex: "quantity",
                    title: "Cantidad",
                    width: "92px",
                },
                {
                    key: "cost",
                    dataIndex: "cost",
                    title: "Costo",
                    width: "100px",
                    render: (value) => {
                        return formatter.format(Number(value))
                    }
                },
                {
                    key: "factor",
                    dataIndex: "factor",
                    title: "Factor",
                    width: "75px",
                    render: (value) => {
                        return `${value} %`
                    }
                },
                {
                    key: "amount",
                    dataIndex: "amount",
                    title: "Monto",
                    width: "100px",
                    render: (value) => {
                        return formatter.format(Number(value))
                    }
                }
            ]} />
        </div>
    )
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



interface FetchingInterface {
    buyers: boolean,
    initialSelects: boolean,
}

const Cotizar = ({ ...props }) => {
    const selectRef = useRef(null)
    const [createQuoteForm]: [FormInstance] = Form.useForm()
    const [generateQuoteIsDisabled, setGenerateQuoteIsDisabled] = useState<boolean>(true)
    const [generateQuoteIsLoading, setGenerateQuoteIsLoading] = useState<boolean>(false)
    const [quotes, setQuotes] = useState<QuoteInterface[] | []>([])
    
    const [companies, setCompanies] = useState<CompanyInterface[] | []>([])

    const [clients, setClients] = useState<ClientInterface[] | []>([])
    const [agents, setAgents] = useState<AgentsInterface[] | []>([])
    const [selectedQuote, setSelectedQuote] = useState<QuoteInterface | {}>({})
    const [buyers, setBuyers] = useState<BuyerInterface[] | [] | false>(false)
    const [includeBrand, setIncludeBrand] = useState<boolean>(false)
    const [rateIsOne, setRateIsOne] = useState<number | undefined>(1)
    const [fetching, setFetching] = useState<FetchingInterface>({
        buyers: false,
        initialSelects: false
    })
    const [selectedClient, setSelectedClient] = useState<ClientInterface | undefined>(undefined)


    const setFetchingProperty = (property: keyof FetchingInterface, boolean: boolean) => {
        const newFetchingObject: FetchingInterface = { ...fetching }
        newFetchingObject[property] = boolean
        setFetching(newFetchingObject)
    }

    const generateQuote = async () => {

        setGenerateQuoteIsLoading(true)
        setGenerateQuoteIsDisabled(true)


        try {
            const { id, reference }: any = selectedQuote

            const sendQuote = await new Requester({ url: import.meta.env.VITE_APP_APIURL + `${includeBrand?"/quotes/update/submit/brands":"`/quotes/update/submit"}`, method: "patch", body: { id: id } }).send()

            if (sendQuote.status) {

                notify("success", "Cotización generada", "La descarga iniciara automáticamente")

                const pdfBinary = sendQuote.data.data

                const data = new ArrayBuffer(pdfBinary.length);

                const view = new Uint8Array(data);

                for (let i = 0; i < pdfBinary.length; ++i) {
                    view[i] = pdfBinary[i];
                }


                // create the blob object with content-type "application/pdf"               
                var blob = new Blob([view], { type: "application/pdf" });
                const link = document.createElement('a')
                link.href = window.URL.createObjectURL(blob)
                link.download = `${reference}.pdf`
                link.click()
                link.remove();  //afterwards we remove the element again  


            } else {
                notify("error", sendQuote.message)
            }

            createQuoteForm.resetFields()
            setQuotes(quotes.filter(quote => { return quote.id !== id }))
            setSelectedQuote({})
            streamPartitions([])

        } catch (error) {

            notify("error", "Error al generar cotización")

        } finally {

            setGenerateQuoteIsDisabled(false)
            setGenerateQuoteIsLoading(false)
        }


    }

    const postQuote = async () => {

        try {
            const { id }: any = selectedQuote
            const body = createQuoteForm.getFieldsValue()
            if (id) {
                body.id = id
            }
            const postOrPatch = id ? "update" : "create"
            const startQuote = await new Requester({ url: import.meta.env.VITE_APP_APIURL + `/quotes/${postOrPatch}/one`, method: postOrPatch === "update" ? "patch" : "post", body }).send()

            if (startQuote.status) {
                if (postOrPatch === "update") {

                    setQuotes(quotes.map((quote) => {
                        if (quote.id !== id) {
                            return quote
                        } else {
                            return startQuote.data[0]
                        }
                    }))
                    setSelectedQuote(startQuote.data[0])
                } else {
                    setQuotes([...quotes, startQuote.data[0]])
                    setSelectedQuote(startQuote.data[0])
                }
            }

            notify(startQuote.status ? "success" : "error", startQuote.message, "")
        } catch (error) {
            console.log(error);

            notify("error", "Error inesperado")
        }

    }

    const postClient = async () => {

        const { value }: any = document.getElementById("newClientField")
        const element: any = document.getElementById("newClientField")
        const body: {} = {
            client_name: value
        }
        const createClient = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/clients/create/one", method: "post", body }).send()

        if (createClient.status) {
            // empty addeed field
            element.value = ""
            notify("success", createClient.message, "")
            setClients([...clients, createClient.data[0]])
        } else {
            notify("error", createClient.message, "")
        }

    }

    const postBuyer = async () => {

        const { value }: any = document.getElementById("newBuyerField")
        const element: any = document.getElementById("newBuyerField")
        const body: {} = {
            buyer_name: value,
            clientID: selectedClient ? selectedClient.id : undefined
        }
        const createBuyer = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/buyers/create/one", method: "post", body }).send()

        if (createBuyer.status) {
            // empty addeed field
            element.value = ""
            notify("success", createBuyer.message, "")
            if (buyers !== false) {
                setBuyers([...buyers, createBuyer.data[0]])
            }
        } else {
            notify("error", createBuyer.message, "")
        }

    }
    const loadSelects = async () => {

        try {
            setFetchingProperty('initialSelects', true)
            const quotesPromise = new Requester({ url: import.meta.env.VITE_APP_APIURL + "/quotes/read/mine", method: "get", params: { emitted: false } }).send()
            const clientsPromise = new Requester({ url: import.meta.env.VITE_APP_APIURL + "/clients/read/mine", method: "get" }).send()
            const usersPromise = new Requester({ url: import.meta.env.VITE_APP_APIURL + "/users/read/all", method: "get" }).send()
            const companiesPromise =  new Requester({ url: import.meta.env.VITE_APP_APIURL + "/companies/read/all", method: "get" }).send()
            const [resultQuotes, resultClients, resultsAgents, resultCompanies] = await Promise.all([quotesPromise, clientsPromise, usersPromise, companiesPromise])
            if (resultQuotes.status !== false) {
                setQuotes(resultQuotes)
            }
            if (resultClients.status !== false) {
                setClients(resultClients)
            }
            if (resultsAgents.status !== false) {
                setAgents(resultsAgents)
            }
            if(resultCompanies.status!==false){
                setCompanies(resultCompanies)
            }

            setFetchingProperty('initialSelects', false)

            return true
        } catch (error) {

            return false
        }


    }

    const setUpNewQuote = () => {
        createQuoteForm.resetFields()
        streamPartitions([])
        setSelectedQuote({})
        if (selectRef.current !== null) {
            selectRef.current = null
        }
    }

    const loadSavedQuote = async (quoteID: number) => {


        const quoteToSelect: any = quotes.filter(quote => { return quote.id === quoteID })[0]


        setSelectedQuote(quoteToSelect)


        const startQuoteFormSavedFields = []

        for (let i: number = 0; i < Object.keys(quoteToSelect).length; i++) {

            const key: any = Object.keys(quoteToSelect)[i];
            let value: any = quoteToSelect[key]

            // turn expiration date into dayjs object for the sake of the date selector widget
            if (key === "expiration_date") {
                value = dayjs(new Date(value)).add(15, 'day')
            }


            if (key === "clientID") {
                await selectClientAndSearchBuyers(value)
            }

            startQuoteFormSavedFields.push({ name: key, value: value })

        }

        createQuoteForm.setFields(startQuoteFormSavedFields)


        const savedQuotePartitions = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/partitions/read/quote", method: "get", params: { quoteID: quoteToSelect.id } }).send()

        if (savedQuotePartitions.length > 0) {

            streamPartitions(savedQuotePartitions)
        } else {

            streamPartitions([])
            notify("info", "No se encontraron partidas para la cotización: " + quoteToSelect.reference, "Intenta agregar partidas")
        }

    }

    const selectClientAndSearchBuyers = async (e: string | number) => {

        setFetchingProperty("buyers", true)

        const clientToSelect = clients.filter(x => { return x.id.toString() == e })[0]
        // set selected client
        setSelectedClient(
            clientToSelect
        )

        createQuoteForm.setFieldValue("buyerID", undefined)

        try {
            // fetch new list of buyers for the selected client
            const buyersResult = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/buyers/read/client", method: "get", params: { clientID: e } }).send()

            if (buyersResult.status == false) {
                throw new Error(buyersResult);
            }

            if (Array.isArray(buyersResult) && buyersResult.length == 0) {
                notify("info", `No existen compradores para el cliente ${clientToSelect.client_name}`, "Recuerda agregar uno primero")
            }


            setBuyers(buyersResult)



        } catch (error) {

            notify("error", `Error al cargar compradores de ${clientToSelect.client_name}`)


        } finally {
            setFetchingProperty("buyers", false)
            return true
        }
    }


    const deleteQuote = async () => {

        try {
            const { id }: any = selectedQuote



            const deletedQuote = await new Requester({ url: import.meta.env.VITE_APP_APIURL + "/quotes/delete/mine", method: "delete", body: { id: id } }).send()

            const typeOfNotification = deletedQuote.status ? "success" : "error"

            notify(typeOfNotification, deletedQuote.message)

            if (deletedQuote.status) {

                setGenerateQuoteIsDisabled(true)

                setUpNewQuote()

                setQuotes(quotes.filter(quote => { quote.id !== id }))

            }

        } catch (error) {

            notify("error", "Error al eliminar cotización")

        }
    }

    useEffect(() => {
        loadSelects()
    }, [])

    if (fetching.initialSelects) {
        return (
            <div style={{
                height: "500px",
                display: "flex",
                alignItems: "center",
                marginTop: "250px",
                flexDirection: "column"
            }}>
                <h2>Cargando...</h2>
                <PuffLoader
                    color={"#444"}
                    speedMultiplier={1}
                    size={"64px"}
                />
            </div>
        )
    }


    const { reference, id }: any = selectedQuote
    return (
        <div >
            <div className='buttons-container'>
                <div style={{ marginBottom: "15px" }}>
                    <label style={{ display: "block" }}>Cotizaciónes inconclusas</label>
                    <Select value={reference ? id : ""} showSearch optionFilterProp="children" style={{ width: "350px" }} onChange={loadSavedQuote}>
                        <Select.Option value={""} disabled>Seleccionar Cotización</Select.Option>
                        {quotes.map((quote) => {
                            return <Select.Option key={`quote_id_${quote.id}`} value={quote.id}>{quote.reference + " - " + addMinutes(new Date(quote.created_at)).toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric', hour: "numeric", minute: "numeric" })}</Select.Option>
                        })}
                    </Select>
                </div>
            </div>
            <div className="quoteCreator">
                <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                    <h2>{reference ? "Trabajando" : "Crear"} Cotización<span style={{ fontWeight: 200 }}>{reference ? `: ${reference}` : ""}</span></h2>
                    {reference ? <Button style={{ marginLeft: "15px" }} onClick={setUpNewQuote}>Nueva Cotización</Button> : null}
                </div>
                <div className='quoteCreatorFormContainer'>
                    <Form form={createQuoteForm} onFinish={postQuote} onFinishFailed={(errors) => {
                        notify("error", `Por favor corrige los siguientes ${errors.errorFields.length} error${errors.errorFields.length === 1 ? "" : "es"}`, <>
                            <ul>
                                {
                                    errors.errorFields.map((error, i) => {
                                        return <li key={`create_quote_error_${i}`}>{error.errors.toString()}</li>
                                    })
                                }
                            </ul>
                        </>)

                    }}>
                        <div className="quoteCreatorFormSection">
                            <h3>Información de Cotización</h3>
                            <div>
                                <label>Empresa <span className='requiredMark' /></label>
                                <Form.Item initialValue="" name="companyID" hasFeedback rules={[{ required: true, message: "Empresa es obligatoria" }]}>
                                    <Select showSearch optionFilterProp="children" >
                                        <Select.Option value="" disabled>Selecciona Empresa</Select.Option>
                                        {
                                        companies.map((company)=>{
                                            return <Select.Option value={company.id}>{company.company_name}</Select.Option>
                                        })   
                                        }
                                    </Select>
                                </Form.Item>
                            </div>
                            <div>
                                <label>Moneda <span className='requiredMark' /></label>
                                <Form.Item name="currency" initialValue={"MXN"} hasFeedback rules={[{ required: true, message: "Moneda es obligatoria" }]}>
                                    <Select showSearch optionFilterProp="children" onChange={(e) => { setRateIsOne(e === "MXN" ? 1 : undefined) }} >
                                        <Select.Option value="MXN">Pesos Mexicanos</Select.Option>
                                        <Select.Option value="USD">Dolares Americanos</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div>
                                <label>Tasa de cambio <span className='requiredMark' /></label>
                                <Form.Item initialValue={1} name="exchange_rate" hasFeedback rules={[{ required: true, message: "Tasa de cambio es obligatoria" }, { pattern: /^[+]?((\d+(\.\d*)?)|(\.\d+))$/, message: "Este campo solo acepta número positivos" }]}>
                                    <InputNumber
                                        disabled={rateIsOne ? true : false}
                                        formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                    />
                                </Form.Item>
                            </div>
                            <div>
                                <label>Cliente <span className='requiredMark' /></label>
                                <Form.Item initialValue={""} name="clientID" hasFeedback rules={[{ required: true, message: "Cliente es obligatorio" }]}>
                                    <Select showSearch optionFilterProp="children" onChange={(e) => {
                                        selectClientAndSearchBuyers(e)
                                    }} dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <input
                                                    placeholder="Crear nuevo cliente"
                                                    id="newClientField"
                                                />
                                                <Button type="text" icon={<MdOutlinePlusOne />} onClick={postClient}>
                                                    Crear
                                                </Button>
                                            </Space>
                                        </>
                                    )}>
                                        <Select.Option disabled value={""}>Selecciona cliente</Select.Option>
                                        {
                                            clients.map((client) => {
                                                return <Select.Option key={`client_id_${client.id}`} value={`${client.id}`}>{client.client_name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </div>
                            <div>
                                <label>Fecha de Vencimiento <span className='requiredMark' /></label>
                                <Form.Item name="expiration_date" initialValue={dayjs(new Date()).add(15, 'day')} hasFeedback rules={[{ required: true, message: "Fecha de vencimiento es obligatoria" }]}>
                                    <DatePicker allowClear={false} format="MMMM Do YY" />
                                </Form.Item>
                            </div>
                            <div>
                                <label>Comprador <span className='requiredMark' /></label>
                                <Form.Item initialValue="" name="buyerID" hasFeedback rules={[{ required: true, message: "Comprador es obligatorio" }]}>
                                    <Select showSearch optionFilterProp="children" disabled={!buyers} loading={fetching.buyers} dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <Space style={{ padding: '0 8px 4px' }}>
                                                <input
                                                    placeholder="Crear nuevo comprador"
                                                    id="newBuyerField"
                                                />
                                                <Button type="text" icon={<MdOutlinePlusOne />} onClick={postBuyer}>
                                                    Crear
                                                </Button>
                                            </Space>
                                        </>
                                    )}>
                                        {
                                            selectedClient == undefined ? <Select.Option disabled value="">Primero selecciona un cliente</Select.Option> : <Select.Option disabled value="">{fetching.buyers ? `Buscando compradores de ${selectedClient.client_name}` : "Selecciona Comprador"}</Select.Option>
                                        }
                                        {
                                            // if buyers is not equal to false
                                            !buyers || buyers.map((buyer) => {
                                                return <Select.Option key={`buyer_id_${buyer.id}`} value={`${buyer.id}`}>{buyer.buyer_name}{buyer.buyer_last_name || ""}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </div>
                            <div>
                                <label>Agente <span className='requiredMark' /></label>
                                <Form.Item name="agentID" initialValue="" hasFeedback rules={[{ required: true, message: "Agente es obligatorio" }]}>
                                    <Select showSearch optionFilterProp="children" >
                                        <Select.Option value="" disabled>Selecciona Agente</Select.Option>
                                        {
                                            agents.map((agent) => {
                                                return <Select.Option key={`agent_id_${agent.id}`} value={`${agent.id}`}>{agent.user_name} {agent.user_last_name}</Select.Option>
                                            })
                                        }
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                        <div className='buttons-container'>
                            {
                                Object.keys(selectedQuote).length === 0 ? <Button htmlType="submit" >Empezar cotización</Button> : <Button htmlType="submit" >Actualizar cotización</Button>
                            }
                        </div>

                    </Form>
                    {/* if the user selected an id show the partition */}
                    {id ? <QuotePartitionForm quoteID={id} /> : null}

                </div>
                <QuotePartitionsTable setGenerateQuoteIsDisabled={setGenerateQuoteIsDisabled} />
                <div className='buttons-container'>
                    {id ?
                        <div>
                            <div style={{ textAlign: "right" }}>
                                <label>Incluir marcas</label>
                                <Checkbox checked={includeBrand} onChange={(e) => { console.log(e); setIncludeBrand(e.target.checked) }} />
                            </div>
                            <div style={{ display: "flex" }}>
                                <Button disabled={id ? false : true} onClick={deleteQuote}>Eliminar Cotización</Button>
                                <Button id="generateQuote" disabled={generateQuoteIsDisabled} onClick={generateQuote} loading={generateQuoteIsLoading}>Generar Cotización</Button>
                            </div>
                        </div>
                        :
                        null
                    }
                </div>
            </div>
        </div>
    )
}

export default Cotizar