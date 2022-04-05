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
const os_1 = require("os");
const fs = __importStar(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const utils_1 = require("./utils");
const consts_1 = require("./consts");
class Thready {
    numOfCpus;
    info;
    maxThreads;
    workersDir;
    initialized;
    static #instantiated = false;
    constructor() {
        if (Thready.#instantiated)
            throw new Error((0, utils_1.error)("Can't construct a new instance of Thready!"));
        this.numOfCpus = (0, os_1.cpus)().length;
        this.maxThreads = this.numOfCpus * 2;
        this.info = {
            active: 0,
            waiting: 0,
        };
        this.initialized = false;
        this.workersDir = '';
        Thready.#instantiated = true;
    }
    init({ dir, maxThreads }) {
        if (typeof dir !== 'string')
            throw new Error((0, utils_1.error)('dir must be a string!'));
        this.workersDir = path_1.default.join(dir + '/workers');
        if (maxThreads && typeof maxThreads === 'number')
            this.maxThreads = maxThreads;
        (0, consts_1.setWorkersPath)(this.workersDir);
        this.initialized = true;
        (0, utils_1.log)('Initialized');
    }
    async go(options) {
        const { script, args = [], debug = false, imports = [], deleteOnError = true, waited = false } = options;
        if (!this.initialized)
            throw new Error((0, utils_1.error)('Thready must first be initialized!'));
        if (!script || typeof script !== 'function')
            throw new Error((0, utils_1.error)('Script must be a function!'));
        if (typeof args !== 'object')
            throw new Error((0, utils_1.error)('Args must be an array!'));
        if (this.info.active >= this.maxThreads) {
            if (!waited)
                this.info.waiting += 1;
            await new Promise((r) => setTimeout(r, 100));
            return this.go({ ...options, waited: true });
        }
        if (waited)
            this.info.waiting -= 1;
        this.info.active += 1;
        await this.ensureWorkersDirectory();
        const workerFile = await (0, utils_1.createWorkerFile)(script, { debug, imports, info: this.info });
        let data;
        try {
            data = await (0, utils_1.runWorker)(workerFile, args);
            this.info.active -= 1;
            return data;
        }
        catch (err) {
            const e = err;
            throw new Error(`${e?.message}`);
        }
        finally {
            if (deleteOnError)
                await (0, utils_1.cleanWorkerFile)(workerFile);
        }
    }
    async ensureWorkersDirectory() {
        try {
            await fs.access(this.workersDir);
        }
        catch {
            return fs.mkdir(this.workersDir);
        }
    }
}
exports.default = new Thready();
