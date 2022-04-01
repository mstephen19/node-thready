export interface ThreadyInterface {
    numOfCpus: number;
    info: ThreadyInfo;
    maxThreads: number;
    workersDir: string;
}

export interface ThreadyOptions {
    dir: string;
    maxThreads?: number;
}

export interface ImportInterface {
    name: string;
    from: string;
}

export interface ThreadifyOptions {
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
