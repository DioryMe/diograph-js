interface DiographJsonParams {
    path: string;
}
interface DiographJson {
    path: string;
    rootId: string;
    diograph: Diograph;
}
interface Diograph {
    [key: string]: Diory;
}
interface Diory {
    id: string;
    text?: string;
    image?: string;
    latlng?: string;
    date?: string;
    data?: Array<object>;
    style?: object;
    links: object;
}
declare class DiographJson {
    path: string;
    rootId: string;
    diograph: Diograph;
    constructor({ path }: DiographJsonParams);
    load: () => Promise<void>;
    get: (id: string) => Diory;
    save: () => Promise<void>;
}
export default DiographJson;
