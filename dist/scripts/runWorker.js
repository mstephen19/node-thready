"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const worker_threads_1 = require("worker_threads");
const consts_1 = require("../consts");
const path_1 = __importDefault(require("path"));
const utils_1 = require("../utils");
const runWorker = (workerFile, args) => {
    return new Promise((resolve, reject) => {
        const worker = new worker_threads_1.Worker(path_1.default.join(consts_1.WORKERS_PATH + `/${workerFile}`), {
            workerData: {
                args,
            },
            env: worker_threads_1.SHARE_ENV,
        });
        worker.on('error', async (err) => {
            reject(new Error((0, utils_1.error)(`Worker failed: ${err.message}`)));
        });
        worker.on('message', (data) => {
            resolve(data);
        });
    });
};
exports.default = runWorker;
