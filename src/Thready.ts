import { cpus } from 'os';
import * as fs from 'fs/promises';

import { ThreadifyOptions, ThreadyInfo, ThreadyInterface, ThreadyOptions } from './types';
import { cleanWorkerFile, createWorkerFile, runWorker, log, error } from './utils';
import { setWorkersPath } from './consts';
import path from 'path';

export class Thready implements ThreadyInterface {
    readonly numOfCpus: number;
    info: ThreadyInfo;
    readonly maxThreads: number;
    readonly workersDir: string;

    static #instantiated: boolean = false;

    constructor({ dir, maxThreads }: ThreadyOptions) {
        if (Thready.#instantiated) throw error('Can only create one Thready instance!');

        this.numOfCpus = cpus().length;

        this.maxThreads = maxThreads || this.numOfCpus * 2;

        this.info = {
            active: 0,
            waiting: 0,
        };

        this.workersDir = path.join(dir + '/workers');

        setWorkersPath(this.workersDir);

        Thready.#instantiated = true;

        log('Instantiated.');
    }

    async threadify({ script, args = [], debug = false, imports = [] }: ThreadifyOptions) {
        if (!script || typeof script !== 'function') {
            throw error('Script must be a function!');
        }
        if (typeof args !== 'object') throw error('Args must be an array!');

        try {
            await fs.access(this.workersDir);
        } catch {
            await fs.mkdir(this.workersDir);
        }

        const workerFile = await createWorkerFile(script, { debug, imports });

        this.info.waiting++;
        await this.waitForOpening();
        this.info.waiting--;

        this.info.active++;
        const data = await runWorker(workerFile, args);
        this.info.active = this.info.active - 1;

        await cleanWorkerFile(workerFile);
        return data;
    }

    private async wait() {
        return new Promise((resolve) =>
            setTimeout(() => {
                if (this.info.active < this.maxThreads) resolve(true);
                else resolve(false);
            }, 1000)
        );
    }

    private async waitForOpening() {
        while (!(await this.wait())) {}
        return true;
    }
}
