"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promises_1 = require("fs/promises");
class DiographJson {
    constructor({ path }) {
        this.rootId = '';
        this.diograph = {};
        this.load = () => {
            return (0, promises_1.readFile)(this.path, { encoding: 'utf8' }).then((diographJsonContents) => {
                const parsedJson = JSON.parse(diographJsonContents);
                this.rootId = parsedJson.rootId;
                this.diograph = parsedJson.diograph;
            });
        };
        this.get = (id) => {
            return this.diograph[id];
        };
        this.save = () => {
            const diographJsonContents = {
                rootId: this.rootId,
                diograph: this.diograph,
            };
            const fileContent = JSON.stringify(diographJsonContents, null, 2);
            return (0, promises_1.writeFile)(this.path, fileContent).then(() => {
                console.log(`diograph.save(): Saved diograph.json to ${this.path}`);
            });
        };
        this.path = path;
    }
}
exports.default = DiographJson;
