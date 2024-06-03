import _ from 'lodash';
import { GraphData, NodeData, EdgeData } from '@antv/g6';
import {
    IAnnoConnection,
    IAnnoConnectionCate,
    IAnnoLabel,
    IAnnoLabelCate,
} from '../type';

const annoDataToGraphData = (
    content: string,
    labelCategories: IAnnoLabelCate[],
    connectionCategories: IAnnoConnectionCate[],
    labels: IAnnoLabel[],
    connections: IAnnoConnection[],
): GraphData => {
    const NodeColorMap: Record<string | number, string> = {};
    const EdgeLabelMap: Record<string | number, string> = {};
    _.each(labelCategories, (cate) => {
        NodeColorMap[cate.id] = cate.color;
    });
    _.each(connectionCategories, (cate) => {
        EdgeLabelMap[cate.id] = cate.text;
    });
    const nodes: NodeData[] = _.map(labels, (l) => {
        const node: NodeData = {
            id: l.id.toString(),
            style: {
                fill: NodeColorMap[l.categoryId],
            },
            name: content.slice(l.startIndex, l.endIndex),
        };
        return node;
    });

    const edges = _.map(connections, (c) => {
        const edge: EdgeData = {
            source: c.fromId.toString(),
            target: c.toId.toString(),
            name: EdgeLabelMap[c.categoryId],
        };
        return edge;
    });

    return {
        nodes,
        edges,
    };
};

export { annoDataToGraphData };
