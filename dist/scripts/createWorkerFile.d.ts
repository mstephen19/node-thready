import { GoOptions, ThreadyInfo } from '../types';
declare const createWorkerFile: (script: Function, { debug, imports, info }?: Partial<GoOptions> & Partial<{
    info: ThreadyInfo;
}>) => Promise<string>;
export declare const cleanWorkerFile: (workerFile: string) => Promise<void>;
export default createWorkerFile;
//# sourceMappingURL=createWorkerFile.d.ts.map