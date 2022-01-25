"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Diograph {
    constructor({ path }) {
        this.load = () => {
            console.log(this.path);
            // parsed_diograph = JSON.parse(File.read(path))
            // diograph = parsed_diograph['diograph']
            // root_id = parsed_diograph['rootId']
        };
        this.path = path;
    }
}
exports.default = Diograph;
