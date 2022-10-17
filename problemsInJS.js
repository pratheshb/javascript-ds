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
    let resolvedPromiseCount = 0;
    return new Promise((resolve, reject) => {
        promises.forEach((promise, i) => {
            promise.then(res => {
                result[i] = res;
                resolvedPromiseCount++;
                if (resolvedPromiseCount === promises.length) {
                    resolve(result);
                }
            }).catch(reject);
        });
    });
}

function promiseRace(promises) {
    return new Promise((resolve, reject) => {
        promises.forEach(promise => {
            promise.then(res => {
                resolve(res);
            }).catch(reject);
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