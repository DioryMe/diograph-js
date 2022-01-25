interface DiographParams {
    path: string;
}
declare class Diograph {
    path: string;
    constructor({ path }: DiographParams);
    load: () => void;
}
export default Diograph;
