"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.log = void 0;
const console_log_colors_1 = require("console-log-colors");
const { green, red } = console_log_colors_1.color;
const log = (msg, ...rest) => {
    console.log(green('[thready] '), msg, ...rest);
};
exports.log = log;
const error = (msg) => `${red('[thready error]')} ${msg}`;
exports.error = error;
