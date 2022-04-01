import { v4 } from 'uuid';
import * as fs from 'fs/promises';
import path from 'path';

import { error } from '.';
import { WORKERS_PATH } from '../consts';
import { ThreadifyOptions } from '../types';

const createWorkerFile = async (script: Function, { debug = false, imports = [] }: Partial<ThreadifyOptions> = {}) => {
    const fileName = v4() + '.js';
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
        await fs.writeFile(path.join(WORKERS_PATH + `/${fileName}`), string);
    } catch (err) {
        throw error(`Failed to create worker file! ${err}`);
    }

    return fileName;
};

export const cleanWorkerFile = async (workerFile: string) => {
    return fs.unlink(path.join(WORKERS_PATH + `/${workerFile}`));
};

export default createWorkerFile;
