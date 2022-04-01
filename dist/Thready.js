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
exports.Thready = void 0;
const os_1 = require("os");
const fs = __importStar(require("fs/promises"));
const utils_1 = require("./utils");
const consts_1 = require("./consts");
const path_1 = __importDefault(require("path"));
class Thready {
    numOfCpus;
    info;
    maxThreads;
    workersDir;
    static #instantiated = false;
    constructor({ dir, maxThreads }) {
        if (Thready.#instantiated)
            throw new Error((0, utils_1.error)('Can only create one Thready instance!'));
        this.numOfCpus = (0, os_1.cpus)().length;
        this.maxThreads = maxThreads || this.numOfCpus * 2;
        this.info = {
            active: 0,
            waiting: 0,
        };
        this.workersDir = path_1.default.join(dir + '/workers');
        (0, consts_1.setWorkersPath)(this.workersDir);
        Thready.#instantiated = true;
        (0, utils_1.log)('Instantiated.');
    }
    async threadify({ script, args = [], debug = false, imports = [], deleteOnError = true }) {
        if (!script || typeof script !== 'function') {
            throw new Error((0, utils_1.error)('Script must be a function!'));
        }
        if (typeof args !== 'object')
            throw new Error((0, utils_1.error)('Args must be an array!'));
        try {
            await fs.access(this.workersDir);
        }
        catch {
            await fs.mkdir(this.workersDir);
        }
        const workerFile = await (0, utils_1.createWorkerFile)(script, { debug, imports });
        this.info.waiting++;
        await this.waitForOpening();
        this.info.waiting--;
        this.info.active++;
        let data;
        try {
            data = await (0, utils_1.runWorker)(workerFile, args);
            this.info.active = this.info.active - 1;
            return data;
        }
        catch (err) {
            throw new Error(`${err}`);
        }
        finally {
            if (deleteOnError)
                await (0, utils_1.cleanWorkerFile)(workerFile);
        }
    }
    async wait() {
        return new Promise((resolve) => setTimeout(() => {
            if (this.info.active < this.maxThreads)
                resolve(true);
            else
                resolve(false);
        }, 1000));
    }
    async waitForOpening() {
        while (!(await this.wait())) { }
        return true;
    }
}
exports.Thready = Thready;
