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
exports.error = exports.log = exports.runWorker = exports.cleanWorkerFile = exports.createWorkerFile = void 0;
const createWorkerFile_1 = __importStar(require("../scripts/createWorkerFile"));
exports.createWorkerFile = createWorkerFile_1.default;
Object.defineProperty(exports, "cleanWorkerFile", { enumerable: true, get: function () { return createWorkerFile_1.cleanWorkerFile; } });
const runWorker_1 = __importDefault(require("../scripts/runWorker"));
exports.runWorker = runWorker_1.default;
const logs_1 = require("./logs");
Object.defineProperty(exports, "log", { enumerable: true, get: function () { return logs_1.log; } });
Object.defineProperty(exports, "error", { enumerable: true, get: function () { return logs_1.error; } });
