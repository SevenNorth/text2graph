export interface IAnnoConnectionCate {
    id: number;
    text: string;
}

export interface IAnnoLabelCate extends IAnnoConnectionCate {
    color: string;
    borderColor: string;
}

export interface IAnnoLabel {
    id: number;
    categoryId: number;
    startIndex: number;
    endIndex: number;
}

export interface IAnnoConnection {
    id: number;
    categoryId: number;
    fromId: number;
    toId: number;
}
