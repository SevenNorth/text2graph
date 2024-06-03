export interface IAnnoConnectionCate {
    id: number | string;
    text: string;
}

export interface IAnnoLabelCate extends IAnnoConnectionCate {
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
