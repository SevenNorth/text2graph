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
} from 'antd';
import { Annotator } from 'poplar-annotation';
import { Graph } from '@antv/g6';
import { useRef, useEffect, useState } from 'react';
import { defalutData } from './constant';
import { annoDataToGraphData } from './utils';
import DataForm from './components/DataForm';
import { IAnnoData } from './type';

const App = () => {
    const anno = useRef<Annotator>();
    const graph = useRef<Graph>();

    const { modal } = AntdApp.useApp();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [annoData, setAnnoData] = useState<IAnnoData>(defalutData);

    useEffect(() => {
        anno.current?.remove();
        anno.current = new Annotator(
            defalutData,
            document.getElementById('annotation') as HTMLElement,
            {},
        );

        return () => {
            anno.current?.remove();
        };
    }, []);

    useEffect(() => {
        initGraph();
    }, []);

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

    const handleAnnoDataChange = (data: IAnnoData) => {
        anno.current?.remove();
        graph.current?.clear();
        anno.current = new Annotator(
            { ...data, labels: [], connections: [] },
            document.getElementById('annotation') as HTMLElement,
            {},
        );
    };

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
                    data={annoData}
                    onCancel={() => setDrawerOpen(false)}
                    onSubmit={(data) => {
                        setAnnoData(data);
                        setDrawerOpen(false);
                        handleAnnoDataChange(data);
                    }}
                />
            </Drawer>
        </>
    );
};

export default App;
