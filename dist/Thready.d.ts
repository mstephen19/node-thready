import { GoOptions, ThreadyInfo, InitOptions } from './types';
declare class Thready {
    #private;
    readonly numOfCpus: number;
    readonly info: ThreadyInfo;
    private maxThreads;
    private workersDir;
    private initialized;
    constructor();
    init({ dir, maxThreads }: InitOptions): void;
    go(options: GoOptions): Promise<unknown>;
    private ensureWorkersDirectory;
}
declare const _default: Thready;
export default _default;
//# sourceMappingURL=Thready.d.ts.map