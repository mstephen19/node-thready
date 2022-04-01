import path from 'path';

export let WORKERS_PATH = path.join(__dirname + '/workers');

export const setWorkersPath = (path: string) => {
    WORKERS_PATH = path;
};
