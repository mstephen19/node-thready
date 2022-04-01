import { color } from 'console-log-colors';
const { green, red } = color;

export const log = (msg: string, ...rest: any[]) => {
    console.log(green('[ THREADY ] '), msg, ...rest);
};

export const error = (msg: string) => `${red('[ THREADY ERROR ]')} ${msg}`;
