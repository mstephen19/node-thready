import { ThreadifyOptions, ThreadyInfo, ThreadyInterface, ThreadyOptions } from './types';
export declare class Thready implements ThreadyInterface {
    #private;
    readonly numOfCpus: number;
    info: ThreadyInfo;
    readonly maxThreads: number;
    readonly workersDir: string;
    constructor({ dir, maxThreads }: ThreadyOptions);
    threadify({ script, args, debug, imports }: ThreadifyOptions): Promise<unknown>;
    private wait;
    private waitForOpening;
}
//# sourceMappingURL=Thready.d.ts.map