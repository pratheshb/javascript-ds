let promise1 = new Promise(resolve => setTimeout(() => resolve('after 10 sec'), 10000));
(async () => { let res = await promise1; console.log(res) })();


function cloneDeep(object) {
    const res = Array.isArray(object) ? [] : {};
    for (let key in object) {
        res[key] = typeof object[key] === 'object' ? cloneDeep(object[key]) : object[key];
    }
    return res;
}

function isDeepEqual(obj1, obj2) {
    const obj1Type = typeof obj1;
    const obj2Type = typeof obj2;

    if (obj1Type !== obj2Type) return false;

    if (obj1Type !== 'object' || obj1 === null || obj2 === null) return obj1 === obj2;

    if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

    if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

    for (let key in obj1) {
        if (!obj2.hasOwnProperty(key)) return false;
        if (!isDeepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

function isDeepEqualV2(obj1, obj2) {
    if (typeof obj1 === 'object' && typeof obj2 === 'object' && obj1 !== null && obj2 !== null) {

        if (Array.isArray(obj1) !== Array.isArray(obj2)) return false;

        if (Object.keys(obj1).length !== Object.keys(obj2).length) return false;

        for (const key in obj1) {
            if (!obj2.hasOwnProperty(key)) return false;
            if (!isDeepEqualV2(obj1[key], obj2[key])) return false;
        }

        return true;
    }
    return obj1 === obj2;
}

function getDiff(obj1, obj2) {
    const res = { created: {}, updated: {} };
    for (let key in obj2) {
        const value1 = obj1[key];
        const value2 = obj2[key];
        if (value1 && value2 && typeof value1 === 'object' && typeof value2 === 'object') {
            const diffObj = getDiff(value1, value2);
            if (Object.keys(diffObj.created).length) {
                res.created[key] = diffObj.created;
            }
            if (Object.keys(diffObj.updated).length) {
                res.updated[key] = diffObj.updated;
            }
        } else if (value1 !== value2) {
            res[obj1.hasOwnProperty(key) ? 'updated' : 'created'][key] = value2;
        }
    }
    return res;
}


function promiseAll(promises) {
    const result = [];
    let count = 0;
    return new Promise((resolve, reject) => {
        promises.forEach((promise, i) => {
            Promise.resolve(promise).then(res => {
                result[i] = res;
                count++;
                if (count === promises.length) {
                    resolve(result);
                }
            }, err => {
                reject(err)
            });
        });
    });
}

function promiseRace(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            Promise.resolve(promise).then(res => {
                resolve(res);
            }, err => {
                reject(err)
            });
        });
    });
}


function reverseStr(str) {
    if (str.length === 1) {
        return str;
    }
    let mid = Math.floor(str.length / 2);
    let firstHalf = str.slice(0, mid);
    let secondHalf = str.slice(mid, str.length);
    return reverseStr(secondHalf) + reverseStr(firstHalf);
}


function promiseAllSetteled(promises) {
    const output = [];
    let count = 0;
    const resolveFn = (i, resolve, value, isResolved) => {
        output[i] = isResolved ? { status: 'fulfilled', value } : { status: 'rejected', reason: value };
        count++;
        if (count === promises.length) {
            resolve(output);
        }
    };
    return new Promise(resolve => {
        promises.forEach((promise, i) => {
            promise.then(value => {
                resolveFn(i, resolve, value, true);
            }).catch(reason => {
                resolveFn(i, resolve, reason, false);
            });
        });
    });
}

function findIndexByBinarySearch(arr, elm, i) {
    if (!arr.length) {
        return -1;
    }
    if (typeof i !== 'number') {
        i = 0;
    }
    let mid = Math.floor(arr.length / 2);
    if (arr[mid] === elm) {
        return i + mid;
    } else if (elm < arr[mid]) {
        return findIndexByBinarySearch(arr.slice(0, mid), elm, i);
    } else {
        return findIndexByBinarySearch(arr.slice(mid + 1), elm, i + mid + 1);
    }
}

findIndexByBinarySearch([0, 1, 2, 3, 4, 5], 5) // 5


function BinarySearch(arr, elm) {
    let hi = arr.length-1;
    let lo = 0;

    while(lo < hi) {
        const mid = lo + Math.floor((hi-lo+1)/2);
        if(elm < arr[mid]) {
            hi = mid-1;
        } else {
            lo = mid;
        }
    }

    return  arr[lo] === mid ? lo : -1
}


// overcome uncaught promise issue by using a method in promise prototype which ignores the error as of now
Promise.prototype.defer = function() {
    this.then(null, () => {});
    return this;
};

const p1 = Promise.reject('errr') // will throw uncaught error

const p2 = Promise.reject('errr').defer() // wont show uncaught error as we pass error handler in defer

p2.then(null, err=> console.log(err)); // now error is logged because p2 is rejected and since promises are immutable once they are rejected always rejected

// same in promise constructor
const p3 = new Promise((resolve, reject) => {
    reject('err');
}).defer();

p3.then(null, err => console.log(err));


function timeOutPromise(delay) {
    return new Promise((resolve, reject) => {
        setTimeout(() => reject('time out'), delay);
    });
}

const p4 = new Promise(resolve => {
    setTimeout(() => resolve(4), 4000);
});

Promise.race([
    p4,
    timeOutPromise(3000)
]).then((val) => {
    console.log(val);
}, (err) => {
    console.error(err);
});


Promise.none = function none(promises) {
    let count = 0;
    const output = [];
    return new Promise((resolve, reject) => {
        promises.forEach((pr, i) => {
            Promise.resolve(pr).then((val) => {
                reject(val);
            }, (err) => {
                count++;
                output[i] = err;
                if (count === promises.length) {
                    resolve(output);
                }
            });
        });
    });
};

Promise.last = function last(promises) {
    let count = 0;
    let reoslveVal = null;
    return new Promise((resolve, reject) => {
        promises.forEach((pr) => {
            Promise.resolve(pr).then((val) => {
                count++;
                reoslveVal = val;
                if (count === promises.length) {
                    resolve(val);
                }
            }, (err) => {
                count++;
                if (count === promises.length) {
                    reoslveVal === null ? reject(err) : resolve(reoslveVal);
                }
            });
        });
    });
}


Promise.map = function(promises, cb) {
    return new Promise((resolve, reject) => {
        Promise.all(
           promises.map((pr) => {
            cb(pr, resolve)
           })
        );
    });
}

let p1 = Promise.resolve(42);
let p2 = Promise.resolve(21);
Promise.map([p1, p2], function(pr, done) {
    Promise.resolve(pr).then(val => {
        done(val*2);
    }, done)
}).then(vals => console.log(vals));



// generator utility to handle multiple async


function run(gen) {
    let it = gen();

    return Promise.resolve().then(
        function handleNext(value) {
            let next = it.next(value);
            return (
                function handleValue(next) {
                    if (next.done) {
                        return next.value;
                    } else {
                        return Promise.resolve(next.value).then(
                            handleNext,
                            function handleError(err) {
                                Promise.resolve(
                                    it.throw(err)
                                ).then(handleValue)
                            });
                    }
                }
            )(next)
        });
}


function foo() {
    return new Promise(resolve => setTimeout(() => resolve(123), 2000))
}


function *main() {
    try {
        let res = yield foo();
        console.log(res);
    } catch(e) {
        console.log(e);
    }
}

run(main);


const btn = document.getElementById('test');

function TripleClick(elm, callback) {
    let timeStamps = [];
    elm.addEventListener('click', function(e) {
        if(timeStamps.length > 0 && e.timeStamp - timeStamps[timeStamps.length -1] > 500) {
            timeStamps = [];
        } else {
          timeStamps.push(e.timeStamp);
          if(timeStamps.length === 3) {
            timeStamps = [];
            callback();
          }
        }
    });
}

TripleClick(btn, () => console.log('clicked thrice'))


async function test() {
    const res1 = await new Promise(resolve => setTimeout(() => resolve(1), 2000));
    const res2 = await new Promise(resolve => setTimeout(() => resolve(res1 +1), 4000));

    return res2;
}

function* gen() {
    try {
        const res1 = yield new Promise(resolve => setTimeout(() => resolve(1), 2000));
        const res2 = yield new Promise(resolve => setTimeout(() => resolve(res1+1), 4000));
    
        console.log(res2);
    } catch(e) {
        console.log('error', e);
    }

}

let it = gen();

let pr1 = it.next().value;

pr1.then(res => {
    let pr2 = it.next(res).value;
    pr2.then(res => it.next(res));
}).catch(e => it.throw(e));


function bar() {
   return new Promise(resolve => setTimeout(() => resolve(1))).then(res1 => new Promise(resolve => setTimeout(() => resolve(res1 +1))))
}


function resolveAfter1Second() {
    return new Promise(resolve => setTimeout(() => resolve('after 1 sec'), 1000))
}

function resolveAfter2Second() {
    return new Promise(resolve => setTimeout(() => resolve('after 1 sec'), 2000))
}

function parallel() {
    Promise.all([
        (async() =>console.log(await resolveAfter2Second()))(),
        (async() =>console.log(await resolveAfter1Second()))()
    ])
}


let a = 1;

function *gen() {
    a = yield;
    console.log(x);
}

let it = gen();
it.next();



function main(gen) {
    const it = gen();
    Promise.resolve().then(
        function handleNext(value) {
            let next = it.next(value);
            if(!next.done) {
                Promise.resolve(next.value).then(handleNext, err => it.throw(err));
            }
        }
    )
}


function* gen() {
    console.log(yield* [1, 2, 3])
}


function runAll(...args) {
    args.forEach(fn => {
        let it = fn();
        Promise.resolve().then(function handleNext(val) {
            let next = it.next(val);
            if(!next.done) {
                Promise.resolve(next.value).then(handleNext, err => it.throw(err));
            }
        })
    })
} 

let res = [];
function *gen1() {
    let p1 = new Promise(resolve => setTimeout(() => resolve(1), 1000));

    yield;

    res.push(yield p1);
}

function *gen2() {
    let p2 = new Promise(resolve => setTimeout(() => resolve(2), 2000));

    yield;

    res.push(yield p2);
}


function secondMinDiff(arr) {
    let min = Number.MAX_SAFE_INTEGER;
    let second_min = min;
    let low = arr[0];
    let secondLow = low;
    let high = low;
    let secondHigh = low;
    for(let i = 1; i< arr.length; i++) {
        const cur = arr[i];
        let first = Math.min(Math.abs(cur - low), Math.abs(high - cur));
        let second = Math.min(Math.abs(cur - secondLow), Math.abs(secondHigh - cur));
        if(first < min) {
            second_min = min;
            min = first;
        } else if(first > min && first < second_min) {
            second_min = first;
        } else if(second < second_min) {
            second_min = second;
        }
        if(cur < secondLow) {
            secondLow = cur;
        }
        if(cur >  secondHigh) {
            secondHigh = cur;
        }
        if(cur < low) {
            secondLow = low
            low = cur;
        }
        if(cur > high) {
            secondHigh = high;
            high = cur;
        }
    }
    return second_min;
}


// Given an input string (s) and a pattern (p), implement wildcard pattern matching with support for '?' and '*' where:

// '?' Matches any single character.
// '*' Matches any sequence of characters (including the empty sequence).
// The matching should cover the entire input string (not partial).

 

// Example 1:

// Input: s = "aa", p = "a"
// Output: false
// Explanation: "a" does not match the entire string "aa".
// Example 2:

// Input: s = "aa", p = "*"
// Output: true
// Explanation: '*' matches any sequence.
// Example 3:
// abcde p = a*e
// Input: s = "cb", p = "?a"
// Output: false
// Explanation: '?' matches 'c', but the second letter is 'a', which does not match 'b'.

function checkPattern(s, p) {
    let stringIndex = 0;
    for (let i = 0; i < p.length; i++) {
        const pattern = p[i];
        if (pattern === s[stringIndex] || pattern === '?') {
            stringIndex++;
        } else if (pattern === '*') {
            const nextCharInPattern = p[i + 1];
            if (nextCharInPattern) {
                const nextIndex = s.lastIndexOf(nextCharInPattern);
                while (stringIndex < nextIndex) {
                    stringIndex++;
                }
            } else {
                return true;
            }
        } else {
            return false;
        }
    }
    return stringIndex === s.length;
}


function calc(input) {
    const vals = [];
    const operators = ['+', '-', '*', '/'];
    let lastOperator = null;
    for(let val of input) {
        if(operators.includes(lastOperator)) {
            if(lastOperator === '*') {
                val *= vals.pop();
            } else if(lastOperator === '/') {
                val = val * vals.pop();
            } else if(lastOperator === '-') {
                val = val * -1;
            }
            vals.push(val);
        } else if(lastOperator !== null){
            vals.push(vals.pop() + val);
        } else {
            vals.push(val);
        }
        lastOperator = val;
    }
    return vals.reduce((acc, cur) => acc+ parseInt(cur, 10), 0);
}





function promisePool(fns, n) {
    let i = 0;
    return new Promise(resolve => {
        function handleResponse() {
           if(i === fns.length) {
               resolve('Success');
           } else if(i < fns.length) {
              fns[i++]().then(handleResponse);
           }
        }
         while(i < n) {
           fns[i++]().then(handleResponse);
        }
    });
}


async function promisePool(fns, n) {
    let i = 0;
    async function handlePromises() {
        if(i === fns.length) {
            return;
        }
        await fns[i++]();
        await handlePromises();
    }
    const concurrentPromises = Array(n).fill('').map(handlePromises);
    await Promise.all(concurrentPromises);
    return 'success';
}

function throttle(fn, t) {
    let isThrottled = false;
    let lastArgs = null;
    return function(...args) {
        if(isThrottled) {
            lastArgs = args;
        } else {
            fn(...args);
            isThrottled = true;
            setTimeout(() => {
                if(lastArgs) {
                    fn(...lastArgs);
                    lastArgs = null;
                }
                isThrottled = false;
            }, t)
        }
    }
}

let obj = {"a": 'sdsdsd', "b": true, c: {d: 234, e: null}}

function stringify(obj, res='') {
    res += '{';
    for(let key in obj) {
        res+= `"${key}":`;
        const val = obj[key];
        if(typeof val === 'object') {
           res += stringify(val)
        } else {
            if(typeof val === 'string') {
                res += `"${val}",`;
            } else {
                res += `${val},`
            }
        }
    }
    return res+'}';
}


function stringify(obj) {
    let res = '{';
    const keys = Object.keys(obj);
    keys.forEach((key, i) => {
        res+= `"${key}":`;
        const val = obj[key];
        if(val !== null && typeof val === 'object') {
            res += stringify(val);
        } else {
            if(typeof val === 'string') {
                res += `"${val}"`;
            } else {
                res += `${val}`
            }
            if(i < keys.length - 1) {
                res += ',';
            }
        }
    });
    return res+'}';
}


stringify(obj);


function getDiff(obj1, obj2) {
    const res = {};
    for(let key in obj1) {
        if(key in obj2) {
            const val1 = obj1[key];
            const val2 = obj2[key];
            if(typeof val1 === 'object' && typeof val2 === 'object') {
                const nestedDiff = getDiff(val1, val2);
                if(Object.keys(nestedDiff).length) {
                    res[key] = nestedDiff;
                }
            } else if(val1 !== val2) {
                res[key] = [val1, val2]
            }
        }
    }

    return res;
}


function curry(fn) {
    return function curried(...args) {
        if(args.length === fn.length) {
            return fn(...args);
        }

        return function wrapper(...nextArgs) {
            return curried(...args, ...nextArgs);
        }
    }
}



function deepMerge(obj1, obj2) {

    function isArray(obj) {
        return Array.isArray(obj);
    }

    function isObject(obj) {
        return typeof obj === 'object' && obj !== null;
    }

    if(!isObject(obj1) && !isObject(obj2)) {
        return obj2;
    }

    if(isArray(obj1) !== isArray(obj2)) {
        return obj2;
    }

    for(const key in obj2) {
        obj1[key] = deepMerge(obj1, obj2);
    }

    return obj2;
}


function promisePool(fns, n) {
    let i = 0;
    return new Promise(res => {
        const handleRes = () => {
            if(i === fns.length) {
                res();
            } else {
                fns[i++]().then(handleRes);
            }
        };
        while(i < n) {
            fns[i++]().then(handleRes);
        }
    })
}


async function promisePool() {
    
}


fn = (callback, a, b, c) => {
    return callback(a * b * c);
  }
  args = [1, 2, 3]
  const asyncFunc = promisify(fn);
  asyncFunc(1, 2, 3).then(console.log); // 6


  function promisify(fn) {
    return function() {
        return new Promise((resolve, reject) => {

        });
    }
  }