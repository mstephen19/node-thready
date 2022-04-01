import { Worker, SHARE_ENV } from 'worker_threads';
import { WORKERS_PATH } from '../consts';
import path from 'path';
import { error } from '.';

const runWorker = (workerFile: string, args: any[]) => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(WORKERS_PATH + `/${workerFile}`), {
            workerData: {
                args,
            },
            env: SHARE_ENV,
        });

        worker.on('error', async (err) => {
            reject(error(`Worker failed: ${err}`));
        });

        worker.on('message', (data) => {
            resolve(data);
        });
    });
};

export default runWorker;
