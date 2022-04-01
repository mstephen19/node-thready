import { ThreadifyOptions } from '../types';
declare const createWorkerFile: (script: Function, { debug, imports }?: Partial<ThreadifyOptions>) => Promise<string>;
export declare const cleanWorkerFile: (workerFile: string) => Promise<void>;
export default createWorkerFile;
//# sourceMappingURL=createWorkerFile.d.ts.map