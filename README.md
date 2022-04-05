# Thready

## Installation

```
npm i node-thready
```

## Importing

ES6+

```TypeScript
import { Thready } from 'node-thready'
```

ES5-

```JavaScript
const { Thready } = require('node-thready')
```

## Example

```TypeScript
import express from 'express';
import { Thready } from 'node-thready';

// Instantiate the class
Thready.init({
    dir: __dirname,
});

const PORT = process.env.PORT || 3000;

const app = express();

let count = 0;

app.get('/normal', (_, res) => {
    count++;
    res.json({ count });
});

const runWhileLoop = (msg: string) => {
    let i = 0;

    while (i < 9999999999) {
        i++;
    }

    return msg;
};

// Even if we promisify runWhileLoop, it still blocks all other requests until it's done
app.get('/heavy', async (_, res) => {
    // By using Thready, this massive while-loop no longer blocks the main thread
    const data: string = await Thready.go({
        script: runWhileLoop,
        args: ['hello world'],
        debug: true,
    });

    res.json({ data });
});
```

## `Thready.init(InitOptions)`

Initialize Thready.

> Only **one** Thready instance can be created.

```TypeScript
interface InitOptions {
    // The directory you want the /workers files folder to live
    dir: string;
    // If not provided, will be calculated based on cores
    maxThreads?: number;
}
```

**Usage:**

```TypeScript
Thready.init({
    dir: __dirname,
    maxThreads: 4,
})
```

## `Thready.go(GoOptions)`

> This is **asynchronous**

An entirely non-blocking operation which does the following:

1. Generate worker directory (if not already created)
2. Generate worker file
3. Wait for an available thread
4. Run the worker
5. Remove the worker file
6. Return the response of the worker

If the worker throws an error, the error will be thrown, and the worker file will still be deleted. This can be overridden with `deleteOnError` for debugging purposes.

```TypeScript
interface GoOptions {
    // The script to run
    script: Function;
    // Arguments to be passed to the script
    args?: any[];
    // Debug logs (includes threadId, active threads, and pending operations)
    debug?: boolean;
    // Any modules that should be imported at the top of the worker file
    imports?: ImportInterface[];
    // Delete the worker file when it throws an error
    deleteOnError?: boolean;
}
```

**Usage:**

```TypeScript
import { Thready } from 'node-thready';

Thready.init({
    dir: __dirname,
});

// Super blocking code
const runWhileLoop = (msg: string) => {
    let i = 0;
    while (i < 9999999999) {
        i++;
    }
    return msg;
};

(async () => {
    const msg = await Thready.go({
        script: runWhileLoop,
        args: ['hello world'],
    });

    console.log(msg);
})();

console.log('testing thready');

(async () => {
    await new Promise((r) => setTimeout(r, 5000));
    console.log('slept');
})();

console.log('last line');
```

In this case, the output to console will be:

```
testing thready
last line
slept
hello world
```

Without Thready, the log would look like this (the main thread would be blocked, waiting for the loop to finish):

```
hello world
testing thready
last line
slept
```

**Handling Imports:**

Since the provided script is run in a different, newly created file, it is running in a different scope. This means that any imports must be specified within the `imports` configuration option.

```TypeScript
interface ImportInterface {
    name: string;
    from: string;
}
```

**Usage:**

```TypeScript
// We have a function that needs the "axios" and "os" packages to be imported
const googleLoop = async () => {
    // Make 200 requests to Google
    for (const x of Array(200).keys()) {
        await axios.get('https://google.com');
    }

    // return the number of CPUs the machine has (for example)
    return cpus();
};

(async () => {
    const data = await Thready.go({
        script: googleLoop,
        imports: [
            // This will be translated to => "const axios = require('axios')"
            {
                name: 'axios',
                from: 'axios'
            },
            // This => "const { cpus } = require('os')"
            {
                name: '{ cpus }',
                from: 'os'
            }
        ]
    })
})();
```

If a required import isn't provided, an error will be thrown saying so.

## `thready.info`

Return info about Thready

```TypeScript
interface ThreadyInfo {
    active: number;
    waiting: number;
}
```