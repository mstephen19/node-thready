import { color } from 'console-log-colors';
const { green, red } = color;

export const log = (msg: string, ...rest: any[]) => {
    console.log(green('[thready] '), msg, ...rest);
};

export const error = (msg: string) => `${red('[thready error]')} ${msg}`;
