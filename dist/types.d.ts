export interface InitOptions {
    dir: string;
    maxThreads?: number;
}
export interface ImportInterface {
    name: string;
    from: string;
}
export interface GoOptions {
    script: Function;
    args?: any[];
    debug?: boolean;
    imports?: ImportInterface[];
    deleteOnError?: boolean;
}
export interface ThreadyInfo {
    active: number;
    waiting: number;
}
//# sourceMappingURL=types.d.ts.map