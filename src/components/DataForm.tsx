import { Button, ColorPicker, Flex, Form, Input, Space } from 'antd';
import { IAnnoData } from '../type';
import { CloseOutlined, PlusOutlined } from '@ant-design/icons';
import _ from 'lodash';

interface PropsType {
    data: IAnnoData;
    onSubmit: (data: IAnnoData) => void;
    onCancel: () => void;
}

const DataForm = (props: PropsType) => {
    const { data, onSubmit, onCancel } = props;

    const [form] = Form.useForm<IAnnoData>();
    return (
        <Form
            form={form}
            name="dynamic_form_nest_item"
            onFinish={(values) => {
                values.labelCategories = _.map(
                    values.labelCategories,
                    (cate, idx) => {
                        return {
                            ...cate,
                            id: cate.id ?? idx,
                        };
                    },
                );
                values.connectionCategories = _.map(
                    values.connectionCategories,
                    (cate, idx) => {
                        return {
                            ...cate,
                            id: cate.id ?? idx,
                        };
                    },
                );
                onSubmit(values);
            }}
            autoComplete="off"
            initialValues={data}
            layout="vertical"
        >
            <Form.Item<IAnnoData>
                label="标注文本"
                name="content"
                rules={[{ required: true, message: '请输入内容' }]}
            >
                <Input.TextArea
                    autoSize={{
                        minRows: 3,
                        maxRows: 10,
                    }}
                    allowClear
                />
            </Form.Item>
            <Form.Item
                label="标签分类"
                rules={[
                    {
                        required: true,
                    },
                ]}
            >
                <Form.List name="labelCategories">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    style={{ display: 'flex' }}
                                    align="center"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'text']}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入分类名',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="输入分类名称" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'color']}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请选择标签颜色',
                                            },
                                        ]}
                                    >
                                        <ColorPicker showText />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        hidden
                                        name={[name, 'borderColor']}
                                        rules={[
                                            {
                                                required: false,
                                                message: '选择标签边框颜色',
                                            },
                                        ]}
                                    >
                                        <ColorPicker showText />
                                    </Form.Item>
                                    <Form.Item>
                                        <CloseOutlined
                                            onClick={() => {
                                                fields.length > 1 &&
                                                    remove(name);
                                            }}
                                        />
                                    </Form.Item>
                                </Space>
                            ))}
                            <Form.Item wrapperCol={{ span: 24 }}>
                                <Button
                                    type="default"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    添加
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item>
            <Form.Item label="关系分类">
                <Form.List name="connectionCategories">
                    {(fields, { add, remove }) => (
                        <>
                            {fields.map(({ key, name, ...restField }) => (
                                <Space
                                    style={{ display: 'flex' }}
                                    align="center"
                                >
                                    <Form.Item
                                        {...restField}
                                        name={[name, 'text']}
                                        rules={[
                                            {
                                                required: true,
                                                message: '请输入分类名',
                                            },
                                        ]}
                                    >
                                        <Input placeholder="输入分类名称" />
                                    </Form.Item>
                                    <Form.Item
                                        {...restField}
                                        hidden
                                        name={[name, 'lineColor']}
                                        rules={[
                                            {
                                                required: false,
                                                message: '选择边线颜色',
                                            },
                                        ]}
                                    >
                                        <ColorPicker showText />
                                    </Form.Item>
                                    <Form.Item>
                                        <CloseOutlined
                                            onClick={() => {
                                                fields.length > 1 &&
                                                    remove(name);
                                            }}
                                        />
                                    </Form.Item>
                                </Space>
                            ))}
                            <Form.Item wrapperCol={{ span: 24 }}>
                                <Button
                                    type="default"
                                    onClick={() => add()}
                                    block
                                    icon={<PlusOutlined />}
                                >
                                    添加
                                </Button>
                            </Form.Item>
                        </>
                    )}
                </Form.List>
            </Form.Item>
            <Form.Item>
                <Flex justify="end">
                    <Space>
                        <Button onClick={onCancel}>取消</Button>
                        <Button type="primary" htmlType="submit">
                            确认
                        </Button>
                    </Space>
                </Flex>
            </Form.Item>
        </Form>
    );
};

export default DataForm;
