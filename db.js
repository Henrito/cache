'use strict';

//#region set up input/output stream
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});
//#region 

//#region helper variables
const NO_TRANSACTION = 'NO TRANSACTION';
const NULL = 'NULL';
//#endregion

//#endregion in-memory caches
const createBlock = (block = {}) => ({
    cache: new Map(block.cache),
    countCache: new Map(block.countCache), // keep a running count to avoid iterating to get value count
});

let transactions = [ createBlock() ];
let { cache, countCache } = transactions[0];
//#endregion

//#region helper functions
const incrementCacheCount = (key = '') => {
    const count = countCache.get(key) || 0;
    const value = count < 0 ? 1 : count + 1;
    countCache.set(key, value);
};

const decrementCacheCount = (key = '') => {
    const count = countCache.get(key) || 0;
    const value = count <= 0 ? 0 : count - 1;
    countCache.set(key, value);
};
//#endregion

//#region data command functions
const SET = (key = '', value = '') => {
    if (key && value) {
        const previousValue = cache.get(key) || 0;
        decrementCacheCount(previousValue); // decrement count for previous value since we may be overwriting a previous value
        incrementCacheCount(value);
        cache.set(key, value);
    }
};

const GET = (key = '') => {
    if (key) {
        console.log(cache.get(key) || NULL);
    }
};

const UNSET = (key = '') => {
    if (key) {
        const value = cache.get(key);
        decrementCacheCount(value);
        cache.delete(key);
    }
};

const NUMEQUALTO = (key = '') => {
    if (key) {
        console.log(countCache.get(key) || 0);
    }
};

const END = () => {
    process.exit(0);
};
//#endregion

//#region transaction commands
const BEGIN = () => {
    const topTransaction = transactions[transactions.length - 1];
    const block = createBlock(topTransaction);
    cache = block.cache;
    countCache = block.countCache;

    transactions.push(block);
};

const ROLLBACK = () => {
    if (transactions.length > 1) { // need 1 transaction for initial state before first BEGIN command
        transactions.pop();

        const topTransaction = transactions[transactions.length - 1];
        cache = topTransaction.cache;
        countCache = topTransaction.countCache;
    }
    else {
        console.log(NO_TRANSACTION);
    }
};

const COMMIT = () => {
    if (transactions.length > 1) {
        const flattenedBlock = transactions.reduceRight((block, transaction) => {
            transaction.cache.forEach((value, key) => {
                if (!block.cache.has(key)) {
                    SET(key, value); // can use SET here since cache and countCache still reference block
                }
            });

            return block;
        });

        transactions = [ flattenedBlock ];
    }
    else {
        console.log(NO_TRANSACTION);
    }
};
//#endregion

//#region Recursive call to fetch user input. Acts as main loop.
const COMMANDS = {
    SET,
    GET,
    UNSET,
    NUMEQUALTO,
    END,
    BEGIN,
    ROLLBACK,
    COMMIT,
};

const getStdin = () => {
    rl.question('', line => {
        const [
            command = '',
            key = '',
            value = '',
        ] = `${line}`.split(/\s+/g);

        const sanitizedCommand = `${command}`.toUpperCase();
        const processCommand = COMMANDS[sanitizedCommand];

        if (typeof processCommand === 'function') {
            processCommand(key, value);
        }

        getStdin();
    });
};

getStdin();
//#endregion
