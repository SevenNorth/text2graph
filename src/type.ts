export interface IAnnoConnectionCate {
    id: number | string;
    text: string;
    lineColor?: string;
}

export interface IAnnoLabelCate extends Omit<IAnnoConnectionCate, 'lineColor'> {
    color: string;
    borderColor: string;
}

export interface IAnnoLabel {
    id: number | string;
    categoryId: number | string;
    startIndex: number;
    endIndex: number;
}

export interface IAnnoConnection {
    id: number | string;
    categoryId: number | string;
    fromId: number | string;
    toId: number | string;
}

export interface IAnnoData {
    content: string;
    labelCategories: IAnnoLabelCate[];
    connectionCategories: IAnnoConnectionCate[];
    labels: IAnnoLabel[];
    connections: IAnnoConnection[];
}
