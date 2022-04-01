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
const thready = new Thready({
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
    const data: string = await thready.threadify({
        script: runWhileLoop,
        args: ['hello world'],
        debug: true,
    });

    res.json({ data });
});
```

## `new Thready(ThreadyOptions)`

Create a new instance of Thready.

> Only **one** Thready instance can be created.

```TypeScript
interface ThreadyOptions {
    // The directory you want the worker files to live
    dir: string;
    // If not provided, will be calculated based on cores
    maxThreads?: number;
}
```

**Usage:**

```TypeScript
const thready = new Thready({
    dir: __dirname,
    maxThreads: 4,
})
```

## `await instance.threadify(ThreadifyOptions)`

An entirely non-blocking operation which does the following:

1. Generate worker directory (if not already created)
2. Generate worker file
3. Wait for an available thread
4. Run the worker
5. Remove the worker file
6. Return the response of the worker

If the worker throws an error, the error will be thrown and 