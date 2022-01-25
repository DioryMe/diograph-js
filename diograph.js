"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
class Diograph {
    constructor({ path }) {
        this.rootId = '';
        this.diograph = {};
        this.load = () => {
            return new Promise((resolve, reject) => {
                fs.readFile(this.path, 'utf8', (err, diographJsonContents) => {
                    if (err) {
                        reject(err);
                    }
                    const parsedJson = JSON.parse(diographJsonContents);
                    this.rootId = parsedJson.rootId;
                    this.diograph = parsedJson.diograph;
                    resolve(true);
                });
            });
        };
        this.get = (id) => {
            return this.diograph[id];
        };
        this.path = path;
    }
}
exports.default = Diograph;
