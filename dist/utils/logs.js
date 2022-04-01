"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.log = void 0;
const chalk_1 = __importDefault(require("chalk"));
const log = (msg, ...rest) => {
    console.log(chalk_1.default.green('[ THREADY ] '), msg, ...rest);
};
exports.log = log;
const error = (msg) => {
    return new Error(`${chalk_1.default.red('[ THREADY ERROR ]')} ${msg}`);
};
exports.error = error;
