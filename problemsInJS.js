function binaryTree(value) {
    const node = { value };
    node[Symbol.iterator] = function* () {
        yield this.value;
        if(this.leftChild) yield* this.leftChild;
        if(this.rightChild) yield* this.rightChild;
    }
    return node;
}

function makeTree() {
    const tree = binaryTree('root');
    tree.leftChild = binaryTree('left branch');
    tree.rightChild = binaryTree('right branch');
    tree.leftChild.leftChild = binaryTree('left branch left leaf');
    tree.leftChild.rightChild = binaryTree('left branch right leaf');
    tree.rightChild.leftChild = binaryTree('right branch left leaf');
    return tree;
}


const tree = makeTree();

const results = [];

const generateStarWarsData = endPoint => async function* () {
        let nextUrl = `https://swapi.dev/api/${endPoint}`;
        while(nextUrl) {
            const response = await fetch(nextUrl);
            const data = await response.json();
            nextUrl = data.next;
            yield* data.results;
        }
        
};

const asyncGen = generateStarWarsData('people');

(async () => { for await (let char of asyncGen()) { console.log(char.name)}})();

let promise1 = new Promise(resolve => setTimeout(() => resolve('after 10 sec'), 10000));
(async () => { let res = await promise1; console.log(res)})();


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

    if(obj1Type !== obj2Type) return false;

    if(obj1Type !== 'object' || obj1 === null || obj2 === null) return obj1 === obj2;

    if(Array.isArray(obj1) !== Array.isArray(obj2)) return false;

    if(Object.keys(obj1).length !== Object.keys(obj2).length) return false;

    for(let key in obj1) {
        if(!obj2.hasOwnProperty(key)) return false;
        if(!isDeepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}


function getDiff(obj1, obj2) {
    const res = {created: {}, updated: {}};
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
                if(resolvedPromiseCount === promises.length) {
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