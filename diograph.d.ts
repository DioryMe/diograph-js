interface DiographParams {
    path: string;
}
interface Diograph {
    rootId: string;
    diograph: object;
}
declare class Diograph {
    path: string;
    rootId: string;
    diograph: object;
    constructor({ path }: DiographParams);
    load: () => void;
}
export default Diograph;
