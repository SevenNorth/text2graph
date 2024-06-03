import './App.less';
import { Button, Col, Flex, Layout, Row, Space, App as AntdApp } from 'antd';
import { Annotator } from 'poplar-annotation';
import { Graph } from '@antv/g6';
import { useRef, useEffect } from 'react';
import { defalutData } from './constant';
import { annoDataToGraphData } from './utils';

const App = () => {
    const anno = useRef<Annotator>();
    const graph = useRef<Graph>();

    const { modal } = AntdApp.useApp();

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
        console.log('🚀-fjf : annoDataToGraphData:');

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
            behaviors: ['zoom-canvas', 'drag-canvas'],
        });
        graph.current.render();
    };

    return (
        <Layout>
            <Layout.Header>
                <Flex justify="flex-end">
                    <Space align="center">
                        <Button type="primary">输入文本</Button>
                        <Button type="primary">配置分类</Button>
                        <Button type="primary">导出分类数据</Button>
                        <Button type="primary">导出标注数据</Button>
                        <Button type="primary">导出图谱数据</Button>
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
    );
};

export default App;
