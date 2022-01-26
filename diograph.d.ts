interface DiographParams {
    path: string;
}
interface Diograph {
    rootId: string;
    diograph: Diograph2;
}
interface Diograph2 {
    [key: string]: Diory;
}
interface Diory {
    id: string;
    text: string;
    image?: string;
    latlng?: string;
    date?: string;
    data?: Array<object>;
    style?: object;
    links: object;
}
declare class Diograph {
    path: string;
    rootId: string;
    diograph: Diograph2;
    constructor({ path }: DiographParams);
    load: () => Promise<void>;
    get: (id: string) => Diory;
    save: () => Promise<void>;
}
export default Diograph;
