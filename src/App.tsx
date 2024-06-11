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
    const idMap = useRef<Record<string | number, string | number>>();
    const nodeColorMap = useRef<Record<string | number, string>>();

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
        const [data, entityIdMap, nodeColor] = annoDataToGraphData(
            defalutData.content,
            defalutData.labelCategories,
            defalutData.connectionCategories,
            defalutData.labels,
            defalutData.connections,
        );
        idMap.current = entityIdMap;
        nodeColorMap.current = nodeColor;
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
                // type: 'cubic',
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
        const c = anno.current?.store.labelRepo.get(id);
        let hasMore = false;
        if (anno.current && c) {
            const entityName = annoData.current.content.slice(
                c.startIndex,
                c.endIndex,
            );
            for (const item of anno.current.store.labelRepo) {
                const itemName = annoData.current.content.slice(
                    item[1].startIndex,
                    item[1].endIndex,
                );
                if (
                    itemName === entityName &&
                    c.startIndex !== item[1].startIndex &&
                    c.endIndex !== item[1].endIndex
                ) {
                    hasMore = true;
                    break;
                }
            }
        }

        modal.confirm({
            title: '删除标注',
            content: '确定删除该标注？',
            onOk() {
                anno.current?.applyAction(Action.Label.Delete(id));
                !hasMore && deleteNode(idMap.current?.[id] ?? id);
                delete idMap.current?.[id];
            },
        });
    };
    const onConnectionRightClicked = (id: number, _evt: MouseEvent) => {
        modal.confirm({
            title: '删除关系',
            content: '确定删除该关系？',
            onOk() {
                const c = anno.current?.store.connectionRepo.get(id);
                if (c) {
                    const edgeId = `${c.fromId}---${c.categoryId}---${c.toId}`;
                    anno.current?.applyAction(Action.Connection.Delete(id));
                    deleteEdge(edgeId);
                }
            },
        });
    };

    const deleteEdge = (id: number | string) => {
        graph.current?.removeEdgeData([String(id)]);
        graph.current?.draw();
    };
    const deleteNode = (id: number | string) => {
        graph.current?.removeNodeData([String(id)]);
        graph.current?.draw();
    };

    const handleAnnoDataChange = (data: IAnnoData) => {
        initAnnotator({ ...data, labels: [], connections: [] });
        const [d, entityIdMap, nodeColor] = annoDataToGraphData(
            data.content,
            data.labelCategories,
            data.connectionCategories,
            data.labels || [],
            data.connections || [],
        );
        idMap.current = entityIdMap;
        nodeColorMap.current = nodeColor;
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
                const action = Action.Label.Create(
                    cateId as number,
                    idxs[0],
                    idxs[1],
                );
                anno.current?.applyAction(action);
                const text = annoData.current.content.slice(idxs[0], idxs[1]);
                const existNode = _.find(
                    graph.current?.getNodeData(),
                    (n) => n.name === text,
                );
                let newId;
                if (anno.current) {
                    for (const item of anno.current.store.labelRepo) {
                        if (
                            item[1].startIndex === idxs[0] &&
                            item[1].endIndex === idxs[1]
                        ) {
                            newId = item[1].id;
                            break;
                        }
                    }
                }
                if (!_.isUndefined(newId) && idMap.current) {
                    if (existNode) {
                        idMap.current[newId as number] = existNode.id;
                    } else {
                        idMap.current[newId as number] = newId as number;
                        graph.current?.addNodeData([
                            {
                                id: String(newId),
                                name: text,
                                style: {
                                    fill: nodeColorMap.current?.[
                                        cateId as number
                                    ],
                                    x: 200 + Math.random() * 100,
                                    y: 200 + Math.random() * 100,
                                },
                            },
                        ]);
                        graph.current?.draw();
                    }
                }
            } else {
                anno.current?.applyAction(
                    Action.Label.Update(itemId as number, cateId as number),
                );
                const c = anno.current?.store.labelRepo.get(itemId as number);
                if (anno.current && c) {
                    const sameEntityIds: number[] = [];
                    const entityName = annoData.current.content.slice(
                        c.startIndex,
                        c.endIndex,
                    );
                    for (const item of anno.current.store.labelRepo) {
                        const itemName = annoData.current.content.slice(
                            item[1].startIndex,
                            item[1].endIndex,
                        );

                        if (
                            itemName === entityName &&
                            c.startIndex !== item[1].startIndex &&
                            c.endIndex !== item[1].endIndex
                        ) {
                            sameEntityIds.push(item[1].id as number);
                        }
                    }
                    _.each(sameEntityIds, (id) => {
                        anno.current?.applyAction(
                            Action.Label.Update(id as number, cateId as number),
                        );
                    });
                }
                graph.current?.updateNodeData([
                    {
                        id: String(
                            idMap.current?.[String(itemId)] ??
                                (itemId as string),
                        ),
                        style: {
                            fill: nodeColorMap.current?.[cateId as number],
                        },
                    },
                ]);
                graph.current?.draw();
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
                const text = annoData.current.connectionCategories.find(
                    (c) => c.id === cateId,
                )?.text;
                const id = `${idxs[0]}---${cateId}---${idxs[1]}`;

                graph.current?.addEdgeData([
                    {
                        id: id,
                        source: idMap.current?.[idxs[0]].toString() || '',
                        target: idMap.current?.[idxs[1]].toString() || '',
                        name: text,
                    },
                ]);
                graph.current?.draw();
            } else {
                const c = anno.current?.store.connectionRepo.get(
                    itemId as number,
                );

                const newText = annoData.current.connectionCategories.find(
                    (c) => c.id === cateId,
                )?.text;

                if (anno.current && c) {
                    const sameRelations: Array<{
                        id: number;
                        fromId: number;
                        toId: number;
                    }> = [];
                    for (const item of anno.current.store.connectionRepo) {
                        if (
                            c.categoryId === item[1].categoryId &&
                            idMap.current?.[c.fromId] ===
                                idMap.current?.[item[1].fromId] &&
                            idMap.current?.[c.toId] ===
                                idMap.current?.[item[1].toId]
                        ) {
                            sameRelations.push({
                                id: item[1].id as number,
                                fromId: item[1].fromId as number,
                                toId: item[1].toId as number,
                            });
                        }
                    }
                    _.each(sameRelations, (r) => {
                        anno.current?.applyAction(
                            Action.Connection.Update(
                                r.id as number,
                                cateId as number,
                            ),
                        );
                        const rmId = `${r.fromId}---${c.categoryId}---${r.toId}`;
                        const addId = `${r.fromId}---${cateId}---${r.toId}`;
                        graph.current?.removeEdgeData([rmId]);
                        graph.current?.addEdgeData([
                            {
                                id: addId,
                                source:
                                    idMap.current?.[c.fromId].toString() || '',
                                target:
                                    idMap.current?.[c.toId].toString() || '',
                                name: newText,
                            },
                        ]);
                    });

                    graph.current?.draw();
                }
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
