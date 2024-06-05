import './App.less';
import {
    Button,
    Col,
    Flex,
    Layout,
    Row,
    Space,
    App as AntdApp,
    Drawer,
    Radio,
    Modal,
} from 'antd';
import { Annotator, Action } from 'poplar-annotation';
import { Graph } from '@antv/g6';
import { useRef, useEffect, useState, useMemo } from 'react';
import { defalutData } from './constant';
import { annoDataToGraphData } from './utils';
import DataForm from './components/DataForm';
import { IAnnoData } from './type';
import _ from 'lodash';

const App = () => {
    const anno = useRef<Annotator>();
    const graph = useRef<Graph>();
    const annoData = useRef<IAnnoData>(defalutData);

    const { message, modal } = AntdApp.useApp();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [cateType, setCateType] = useState<'label' | 'connection'>();
    const [cateId, setCateId] = useState<string | number>();
    const [itemId, setItemId] = useState<string | number>();
    const [idxs, setIdxs] = useState<[number, number]>();

    useEffect(() => {
        initAnnotator();
        return () => {
            anno.current?.remove();
        };
    }, []);

    useEffect(() => {
        initGraph();
    }, []);

    const initState = () => {
        setModalOpen(false);
        setCateId(undefined);
        setItemId(undefined);
        setCateType(undefined);
        setIdxs(undefined);
    };

    const initGraph = () => {
        if (graph.current) {
            return;
        }
        const data = annoDataToGraphData(
            defalutData.content,
            defalutData.labelCategories,
            defalutData.connectionCategories,
            defalutData.labels,
            defalutData.connections,
        );
        graph.current = new Graph({
            container: 'graph',
            data,
            node: {
                style: {
                    labelText: (d) => d.name as string,
                    ports: [],
                },
                palette: {
                    type: 'group',
                    field: 'cluster',
                },
            },
            edge: {
                type: 'line',
                style: {
                    labelText: (d) => d.name as string,
                    endArrow: true,
                    labelTextBaseline: 'bottom',
                },
            },
            layout: {
                type: 'force',
                linkDistance: 50,
                clustering: true,
                nodeClusterBy: 'cluster',
                clusterNodeStrength: 70,
            },
            behaviors: ['zoom-canvas', 'drag-canvas', 'drag-element'],
        });
        graph.current.render();
        (window as any).graph = graph.current;
    };

    const initAnnotator = (data?: IAnnoData) => {
        anno.current?.remove();
        anno.current = new Annotator(
            data || defalutData,
            document.getElementById('annotation') as HTMLElement,
            {
                contentEditable: false,
            },
        );
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        anno.current.on('textSelected', onTextSelected);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        anno.current.on('connectionClicked', onConnectionClicked);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        anno.current.on('twoLabelsClicked', onTwoLabelsClicked);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        anno.current.on('labelDoubleClicked', onLabelDoubleClicked);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        anno.current.on('labelRightClicked', onLabelRightClicked);
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        anno.current.on('connectionRightClicked', onConnectionRightClicked);
    };

    const onTextSelected = (startIndex: number, endIndex: number) => {
        // 输出用户选取的那些字
        const text = annoData.current.content.slice(startIndex, endIndex);
        setModalOpen(true);
        setCateType('label');
        setIdxs([startIndex, endIndex]);
    };

    const onConnectionClicked = (id: number) => {
        setItemId(id);
        const item = anno.current?.store.connectionRepo.get(id);
        setCateId(item?.categoryId);
        setCateType('connection');
        setModalOpen(true);
    };

    const onTwoLabelsClicked = (first: number, second: number) => {
        setIdxs([first, second]);
        setCateType('connection');
        setModalOpen(true);
    };

    const onLabelDoubleClicked = (id: number, _evt: MouseEvent) => {
        setItemId(id);
        const item = anno.current?.store.labelRepo.get(id);
        setCateId(item?.categoryId);
        setCateType('label');
        setModalOpen(true);
        return;
    };

    const onLabelRightClicked = (id: number, _evt: MouseEvent) => {
        modal.confirm({
            title: '删除标注',
            content: '确定删除该标注？',
            onOk() {
                anno.current?.applyAction(Action.Label.Delete(id));
            },
        });
    };
    const onConnectionRightClicked = (id: number, _evt: MouseEvent) => {
        modal.confirm({
            title: '删除关系',
            content: '确定删除该关系？',
            onOk() {
                anno.current?.applyAction(Action.Connection.Delete(id));
            },
        });
    };

    const handleAnnoDataChange = (data: IAnnoData) => {
        initAnnotator({ ...data, labels: [], connections: [] });
        annoData.current = data;
        graph.current?.clear();
    };

    const handleOk = () => {
        if (_.isUndefined(cateId)) {
            message.warning('请选择一个分类', 1);
            return;
        }
        if (cateType === 'label') {
            if (_.isUndefined(itemId) && idxs) {
                anno.current?.applyAction(
                    Action.Label.Create(cateId as number, idxs[0], idxs[1]),
                );
            } else {
                anno.current?.applyAction(
                    Action.Label.Update(itemId as number, cateId as number),
                );
            }
        } else if (cateType === 'connection') {
            if (_.isUndefined(itemId) && idxs) {
                anno.current?.applyAction(
                    Action.Connection.Create(
                        cateId as number,
                        idxs[0],
                        idxs[1],
                    ),
                );
            } else {
                anno.current?.applyAction(
                    Action.Connection.Update(
                        itemId as number,
                        cateId as number,
                    ),
                );
            }
        }
        initState();
    };

    const LabelEditContent = useMemo(() => {
        return (
            <>
                <Radio.Group>
                    <Radio.Group
                        onChange={(e) => {
                            setCateId(e.target.value);
                        }}
                        value={cateId}
                    >
                        <Space direction="vertical">
                            {_.map(annoData.current.labelCategories, (cate) => {
                                return (
                                    <Radio key={cate.id} value={cate.id}>
                                        {cate.text}
                                    </Radio>
                                );
                            })}
                        </Space>
                    </Radio.Group>
                </Radio.Group>
            </>
        );
    }, [cateId]);
    const ConnectionEditContent = useMemo(() => {
        return (
            <>
                <Radio.Group>
                    <Radio.Group
                        onChange={(e) => {
                            setCateId(e.target.value);
                        }}
                        value={cateId}
                    >
                        <Space direction="vertical">
                            {_.map(
                                annoData.current.connectionCategories,
                                (cate) => {
                                    return (
                                        <Radio key={cate.id} value={cate.id}>
                                            {cate.text}
                                        </Radio>
                                    );
                                },
                            )}
                        </Space>
                    </Radio.Group>
                </Radio.Group>
            </>
        );
    }, [cateId]);

    return (
        <>
            <Layout>
                <Layout.Header>
                    <Flex justify="flex-end">
                        <Space align="center">
                            <Button
                                type="primary"
                                onClick={() => {
                                    setDrawerOpen(true);
                                }}
                            >
                                输入文本及配置分类
                            </Button>
                            <Button type="primary">导出分类数据</Button>
                            <Button type="primary">导出标注数据</Button>
                            <Button
                                type="primary"
                                onClick={async () => {
                                    const url = await graph.current?.toDataURL({
                                        mode: 'overall',
                                        type: 'image/bmp',
                                    });
                                    if (url) {
                                        const link =
                                            document.createElement('a');
                                        link.href = url;
                                        link.download = 'graph.bmp';
                                        link.click();
                                    }
                                }}
                            >
                                导出图谱数据
                            </Button>
                        </Space>
                    </Flex>
                </Layout.Header>
                <Layout.Content>
                    <Row className="contentRow">
                        <Col span={12}>
                            <div id="annotation"></div>
                        </Col>
                        <Col span={12}>
                            <div id="graph"></div>
                        </Col>
                    </Row>
                </Layout.Content>
            </Layout>
            <Drawer
                title="标注数据配置"
                placement="left"
                width={500}
                onClose={() => setDrawerOpen(false)}
                open={drawerOpen}
                destroyOnClose
            >
                <DataForm
                    data={annoData.current}
                    onCancel={() => setDrawerOpen(false)}
                    onSubmit={(data) => {
                        annoData.current = data;
                        setDrawerOpen(false);
                        handleAnnoDataChange(data);
                    }}
                />
            </Drawer>
            <Modal
                title="选择分类"
                open={modalOpen}
                onCancel={initState}
                onOk={handleOk}
            >
                {cateType === 'label' && LabelEditContent}
                {cateType === 'connection' && ConnectionEditContent}
            </Modal>
        </>
    );
};

export default App;
