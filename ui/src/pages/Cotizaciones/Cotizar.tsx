import { useState, Dispatch, SetStateAction, useEffect } from 'react';
import { Form, Input, Button, Select, DatePicker, InputNumber, Divider, Space, Table } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import moment from "moment"
import type { FormInstance } from 'antd';
import { Subject } from 'rxjs';
import dayjs from 'dayjs'
import { MdOutlinePlusOne } from 'react-icons/md';
// type declarations on state setters
const eventStream = new Subject();
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
interface QuoteItemInterface {
    name: string,
    description: string,
    category?: string,
    brand?: string,
    quantity: BigInteger,
    amount: number,
    cost: number,
    factor: number
}

const units = (
    <Select defaultValue="pzs" style={{ width: 85 }}>
        <Select.Option value="pzs">Piezas</Select.Option>
        <Select.Option value="lt">Litros</Select.Option>
        <Select.Option value="kg">Kilos</Select.Option>
        <Select.Option value="unt">Unidades</Select.Option>
        <Select.Option value="mt">Metros</Select.Option>
        <Select.Option value="mt3">Metros³</Select.Option>
    </Select>
);


interface props {
    quoteItems: QuoteItemInterface[] | [],
    setQuoteItems: Dispatch<SetStateAction<QuoteItemInterface[] | []>>
}
const Sign = (
    <Select defaultValue="add" style={{ width: 60 }}>
        <Select.Option value="add">+</Select.Option>
        <Select.Option value="minus">-</Select.Option>
    </Select>
);

const QuotePartitionForm = () => {
    const [createQuoteItemForm]: [FormInstance] = Form.useForm()
    const [partitionAmount, setPartitionAmount] = useState<any>(0)
    const [people, setPeople] = useState<any[]>([{ value: "Prueba", label: "Prueba" }])
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
    useEffect(() => {
        return calculatePartitionAmount()
    }, [])
    return (
        <div>
            <Form form={createQuoteItemForm} onFinish={(values) => {
                streamPartition(values)
            }} >
                <div className="quoteCreatorFormSection">
                    <h3>Información de Partidas</h3>
                    <div>
                        <label>Nombre</label>
                        <Form.Item initialValue={"Batería LTI 5000"} name="name" hasFeedback rules={[{ required: true, message: "Nombre es obligatorio" }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Descripción</label>
                        <Form.Item initialValue={"Batería de Lithio tipo xtr-5000"} name="description" hasFeedback rules={[{ required: true, message: "Descripción es obligatoria" }]}>
                            <Input />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Categoría</label>
                        <Form.Item initialValue={"Prueba"} name="category" hasFeedback rules={[{ required: true, message: "Categoría es obligatoria" }]}>
                            <Select defaultValue={"Prueba"} allowClear showSearch optionFilterProp="children" dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Space style={{ padding: '0 8px 4px' }}>
                                        <input
                                            placeholder="Crear nueva categoría"
                                            id="newCategoryField"
                                        />
                                        <Button type="text" icon={<MdOutlinePlusOne />} onClick={(e) => {
                                            const { value }: any = document.getElementById("newCategoryField")
                                            setPeople([...people, { label: value, value: value }])
                                            const element: any = document.getElementById("newCategoryField")
                                            element.value = ""
                                        }}>
                                            Crear
                                        </Button>
                                    </Space>
                                </>
                            )}>
                                {
                                    people.map((item) => {
                                        return <Select.Option value={item.value}>{item.label}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <label>Marca</label>
                        <Form.Item initialValue={"Prueba"} name="brand" hasFeedback rules={[{ required: true, message: "Categoría es obligatoria" }]}>
                            <Select defaultValue={"Prueba"} allowClear showSearch optionFilterProp="children" dropdownRender={(menu) => (
                                <>
                                    {menu}
                                    <Divider style={{ margin: '8px 0' }} />
                                    <Space style={{ padding: '0 8px 4px' }}>
                                        <input
                                            placeholder="Crear nueva categoría"
                                            id="newBrandField"
                                        />
                                        <Button type="text" icon={<MdOutlinePlusOne />} onClick={(e) => {
                                            const { value }: any = document.getElementById("newBrandField")
                                            setPeople([...people, { label: value, value: value }])
                                            const element: any = document.getElementById("newBrandField")
                                            element.value = ""
                                        }}>
                                            Crear
                                        </Button>
                                    </Space>
                                </>
                            )}>
                                {
                                    people.map((item) => {
                                        return <Select.Option value={item.value}>{item.label}</Select.Option>
                                    })
                                }
                            </Select>
                        </Form.Item>
                    </div>
                    <div>
                        <label>Cantidad</label>
                        <Form.Item initialValue={12} name="quantity" hasFeedback rules={[{ required: true, message: "Cantidad es obligatoria" }, { pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/, message: "Este campo solo acepta decimales" }]}>
                            <InputNumber
                                addonAfter={units}
                                // formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                // parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                onChange={calculatePartitionAmount}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Costo</label>
                        <Form.Item initialValue={5000} name="cost" hasFeedback rules={[{ required: true, message: "Costo es obligatorio" }, { pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/, message: "Este campo solo acepta decimales" }]}>
                            <InputNumber
                                addonBefore={Sign}
                                formatter={(value) => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
                                onChange={calculatePartitionAmount}
                            />
                        </Form.Item>
                    </div>
                    <div>
                        <label>Factor</label>
                        <Form.Item initialValue={0.48} name="factor" hasFeedback rules={[{ required: true, message: "Factor es obligatorio" }, { pattern: /^[+-]?((\d+(\.\d*)?)|(\.\d+))$/, message: "Este campo solo acepta decimales" }]}>
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
                <Button htmlType="submit">Agregar Partida</Button>
</div>

            </Form>

        </div>
    )
}

const QuotePartitionsTable = () => {
    const [quotePartitions, setQuotePartitions] = useState<any>([])
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys);
    };
  
    const rowSelection = {
      selectedRowKeys,
      onChange: onSelectChange,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
        {
          key: 'odd',
          text: 'Select Odd Row',
          onSelect: (changableRowKeys:any) => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((_:any, index:any) => {
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
          text: 'Select Even Row',
          onSelect: (changableRowKeys:any) => {
            let newSelectedRowKeys = [];
            newSelectedRowKeys = changableRowKeys.filter((_:any, index:any) => {
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

    const subscription = eventStream.subscribe({
        next(x) {
            setQuotePartitions([...quotePartitions, x])
        },
        error(err) {
            console.error('something wrong occurred: ' + err);
        },
        complete() {
            console.log('done');
        },
    });

    return (

        <div className="quoteCreatorAddedItems">
            <div className='buttons-container'>
                <Button>Eliminar Partida(s)</Button>
            </div>
            <Table rowSelection={rowSelection} dataSource={quotePartitions} style={{ width: "100%" }} scroll={{ x: "100%", y: "80vh" }} columns={[
                {
                    key: "name",
                    dataIndex: "name",
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
                    dataIndex: "category",
                    width: "100px",
                    title: "Categoría"
                },
                {
                    key: "brand",
                    dataIndex: "brand",
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



const Cotizar = ({ ...props }) => {

    const [createQuoteForm]: [FormInstance] = Form.useForm()

    return (
        <div >
            <div className='buttons-container'>
                <button>Cobot 11R</button>
            </div>
            <div className="quoteCreator">
                <h2>Crear Cotización</h2>
                <div className='quoteCreatorFormContainer'>
                    <Form form={createQuoteForm}>
                        <div className="quoteCreatorFormSection">
                            <h3>Información de Cotización</h3>
                            <div>
                                <label>Referencia</label>
                                <Form.Item initialValue={"Requisición 12 para planta de baterías"}>
                                    <Input defaultValue={"Requisición 12 para planta de baterías"} />
                                </Form.Item>
                            </div>
                            <div>
                                <label>Moneda</label>
                                <Form.Item initialValue={"MXN"}>
                                    <Select defaultValue={"MXN"} showSearch optionFilterProp="children" >
                                        <Select.Option value="MXN">Pesos Mexicanos</Select.Option>
                                        <Select.Option value="USD">Dolares Americanos</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div>
                                <label>Cliente</label>
                                <Form.Item>
                                    <Select defaultValue={"TPI"} showSearch optionFilterProp="children" >
                                        <Select.Option value="Jabil">Jabil</Select.Option>
                                        <Select.Option value="TPI">TPI</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div>
                                <label>Fecha de Vencimiento</label>
                                <Form.Item initialValue={moment(new Date(), "DD-MM-YYYY").add(15, 'days')} >
                                    <DatePicker defaultValue={dayjs().add(15, 'day')} format="MMMM Do YY" />
                                </Form.Item>
                            </div>
                            <div>
                                <label>Comprador</label>
                                <Form.Item initialValue="TPI">
                                    <Select defaultValue="TPI" showSearch optionFilterProp="children" >
                                        <Select.Option value="Jabil">Gerente Jabil</Select.Option>
                                        <Select.Option value="TPI">Gerente TPI</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div>
                                <label>Agente</label>
                                <Form.Item initialValue="TPI">
                                    <Select defaultValue="TPI" showSearch optionFilterProp="children" >
                                        <Select.Option value="Jabil">Luis Moreno</Select.Option>
                                        <Select.Option value="TPI">Victor Primo</Select.Option>
                                    </Select>
                                </Form.Item>
                            </div>
                        </div>
                    </Form>
                    <QuotePartitionForm />

                </div>
                <QuotePartitionsTable />
                <div className='buttons-container'>
                    <Button>Guardar Progreso</Button>
                    <Button>Generar Cotización</Button>
                </div>
            </div>
        </div>
    )
}

export default Cotizar