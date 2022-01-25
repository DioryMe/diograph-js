"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Diograph {
    constructor({ path }) {
        this.rootId = '';
        this.diograph = {};
        this.load = () => {
            fs.readFile(this.path, 'utf8', (err, diographJsonContents) => {
                if (err) {
                    throw err;
                }
                const parsedJson = JSON.parse(diographJsonContents);
                this.rootId = parsedJson.rootId;
                this.diograph = parsedJson.diograph;
                console.log(this.rootId);
                console.log(Object.keys(this.diograph)[0]);
            });
        };
        this.path = path;
    }
}
exports.default = Diograph;
