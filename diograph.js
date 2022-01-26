"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const fsPromise = require('fs').promises;
const path = require('path').posix;
class Diograph {
    constructor({ path }) {
        this.rootId = '';
        this.diograph = {};
        this.load = () => {
            return new Promise((resolve, reject) => {
                fs.readFile(this.path, 'utf8', (err, diographJsonContents) => {
                    if (err)
                        reject(err);
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
        this.save = () => {
            return new Promise((resolve, reject) => {
                const diographJson = {
                    rootId: this.rootId,
                    diograph: this.diograph,
                };
                const fileContent = JSON.stringify(diographJson, null, 2);
                return fsPromise.writeFile('diograph2.json', fileContent).then((err) => {
                    if (err)
                        reject(err);
                    console.log(`diograph.save(): Saved diograph.json to ${this.path}`);
                    resolve(true);
                });
            });
        };
        this.path = path;
    }
}
exports.default = Diograph;
