import { cpus } from 'os';
import * as fs from 'fs/promises';
import path from 'path';

import { GoOptions, ThreadyInfo, InitOptions } from './types';
import { cleanWorkerFile, createWorkerFile, runWorker, log, error } from './utils';
import { setWorkersPath } from './consts';

class Thready {
    readonly numOfCpus: number;
    readonly info: ThreadyInfo;
    private maxThreads: number;
    private workersDir: string;
    private initialized: boolean;

    static #instantiated: boolean = false;

    constructor() {
        if (Thready.#instantiated) throw new Error(error("Can't construct a new instance of Thready!"));

        this.numOfCpus = cpus().length;

        this.maxThreads = this.numOfCpus * 2;

        this.info = {
            active: 0,
            waiting: 0,
        };

        this.initialized = false;

        this.workersDir = '';

        Thready.#instantiated = true;
    }

    /**
     * Initialize Thready
     * 
     * @param initOptions The "dir" key is required, and should point to the directory you'd like the /workers folder to live
     */
    init({ dir, maxThreads }: InitOptions) {
        if (typeof dir !== 'string') throw new Error(error('dir must be a string!'));

        this.workersDir = path.join(dir + '/workers');

        if (maxThreads && typeof maxThreads === 'number') this.maxThreads = maxThreads;

        setWorkersPath(this.workersDir);

        this.initialized = true;

        log('Initialized');
    }

    /**
     * 
     * @param options An object containing the script, any args and imports, and other options
     */
    async go(options: GoOptions): Promise<unknown> {
        const { script, args = [], debug = false, imports = [], deleteOnError = true, waited = false } = options as GoOptions & { waited?: boolean };

        // Validations
        if (!this.initialized) throw new Error(error('Thready must first be initialized!'));
        if (!script || typeof script !== 'function') throw new Error(error('Script must be a function!'));
        if (typeof args !== 'object') throw new Error(error('Args must be an array!'));

        // If the max threads has been reached, recursively wait
        if (this.info.active >= this.maxThreads) {
            if (!waited) this.info.waiting += 1;
            await new Promise((r) => setTimeout(r, 100));
            return this.go({ ...options, waited: true } as GoOptions);
        }

        if (waited) this.info.waiting -= 1;
        this.info.active += 1;

        // Create /worker folder if doesn't already exist
        await this.ensureWorkersDirectory();

        // Create and add workerfile to the /worker directory
        const workerFile = await createWorkerFile(script, { debug, imports, info: this.info });

        let data: unknown;

        try {
            data = await runWorker(workerFile, args);
            this.info.active -= 1;
            return data;
        } catch (err) {
            const e = err as Error;
            throw new Error(`${e?.message}`);
        } finally {
            if (deleteOnError) await cleanWorkerFile(workerFile);
        }
    }

    private async ensureWorkersDirectory() {
        try {
            await fs.access(this.workersDir);
        } catch {
            return fs.mkdir(this.workersDir);
        }
    }
}

export default new Thready();
