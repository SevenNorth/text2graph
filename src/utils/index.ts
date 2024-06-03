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
    const EntityIdMap: Record<string | number, string | number> = {};
    const EntityNameMap: Record<string, string | number> = {};
    _.each(labelCategories, (cate) => {
        NodeColorMap[cate.id] = cate.color;
    });
    _.each(connectionCategories, (cate) => {
        EdgeLabelMap[cate.id] = cate.text;
    });
    _.each(labels, (l) => {
        const name = content.slice(l.startIndex, l.endIndex);
        if (_.isUndefined(EntityNameMap[name])) {
            (EntityNameMap[name] = l.id), (EntityIdMap[l.id] = l.id);
        } else {
            EntityIdMap[l.id] = EntityNameMap[name];
        }
    });
    const nodes: NodeData[] = _.map(
        _.filter(labels, (la) => la.id === EntityIdMap[la.id]),
        (l) => {
            const node: NodeData = {
                id: l.id.toString(),
                style: {
                    fill: NodeColorMap[l.categoryId],
                },
                name: content.slice(l.startIndex, l.endIndex),
            };
            return node;
        },
    );

    const edges = _.uniqBy(
        _.map(connections, (c) => {
            const edge: EdgeData = {
                source: EntityIdMap[c.fromId].toString(),
                target: EntityIdMap[c.toId].toString(),
                name: EdgeLabelMap[c.categoryId],
                id: `${EntityIdMap[c.fromId]}---${c.categoryId}---${
                    EntityIdMap[c.toId]
                }`,
            };
            return edge;
        }),
        'id',
    );

    return {
        nodes,
        edges,
    };
};

export { annoDataToGraphData };
