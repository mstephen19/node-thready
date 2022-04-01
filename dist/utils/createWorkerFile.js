"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanWorkerFile = void 0;
const uuid_1 = require("uuid");
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const _1 = require(".");
const consts_1 = require("../consts");
const createWorkerFile = async (script, { debug = false, imports = [] } = {}) => {
    const fileName = (0, uuid_1.v4)() + '.js';
    const stringified = script.toString();
    const string = `const { workerData, parentPort, isMainThread, threadId } = require('worker_threads');
${imports.map(({ name, from }) => `const ${name} = require('${from}')\n`)}
const script = ${stringified};
${debug ? '\nconsole.table({ isMainThread, threadId })\n' : ''}
const { args } = workerData;

const runScript = async () => {
    try {
        data = await script(...args)
    } catch (error) {
        throw new Error(\`Error occurred running script: \${error}\`);
    };

    if (!data) parentPort.postMessage(true);

    parentPort.postMessage(data);

    process.exit(0);
};

runScript();`;
    try {
        await fs.writeFile(path_1.default.join(consts_1.WORKERS_PATH + `/${fileName}`), string);
    }
    catch (err) {
        throw (0, _1.error)(`Failed to create worker file! ${err}`);
    }
    return fileName;
};
const cleanWorkerFile = async (workerFile) => {
    return fs.unlink(path_1.default.join(consts_1.WORKERS_PATH + `/${workerFile}`));
};
exports.cleanWorkerFile = cleanWorkerFile;
exports.default = createWorkerFile;
