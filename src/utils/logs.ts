import chalk from 'chalk';

export const log = (msg: string, ...rest: any[]) => {
    console.log(chalk.green('[ THREADY ] '), msg, ...rest);
};

export const error = (msg: string) => {
    return new Error(`${chalk.red('[ THREADY ERROR ]')} ${msg}`);
};
