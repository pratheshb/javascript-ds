function fibonnaci(n, memo = {}) {
    if(n < 2) {
        return n;
    }
    if(n in memo) {
        return memo[n];
    }
    memo[n] = fibonnaci(n-1, memo) + fibonnaci(n-2, memo);
    return memo[n];
}

/* possible ways to travel from start to end in 2D grid;
    eg: 2*3 grid(3 ways)
    start empty empty
    empty empty end
*/

function gridTraveller(m,n, memo = {}) {
    const key = `${m}, ${n}`;
    const key1 = `${n}, ${m}`;
    if(m === 0 || n === 0) {
        return 0;
    }

    if(m === 1 && n === 1) {
        return 1;
    }

    if(key in memo) {
        return memo[key];
    }

    if(key1 in memo) {
        return memo[key1];
    }

    memo[key] = gridTraveller(m-1, n, memo) + gridTraveller(m, n-1, memo);
    return memo[key];
}

/**
 * if numbers in array can add upto the target(with repetation)
 * @param {Number} targetSum 
 * @param {Array} numbers 
 * @returns boolean
 */

function canSum(targetSum, numbers, memo={}) {
    if(targetSum === 0) {
        return true;
    }

    if(targetSum < 0) {
        return false;
    }

    if(targetSum in memo) {
        return memo[targetSum];
    }

    for(let num of numbers) {
        const remainder = targetSum - num;
        memo[targetSum] = canSum(remainder, numbers, memo)
        if(memo[targetSum] === true) {
            return true;
        }
    }

    return memo[targetSum];
}


function howSum(targetSum, numbers, memo = {}) {
    if(targetSum === 0) {
        return [];
    }

    if(targetSum < 0) {
        return null;
    }

    if(targetSum in memo) {
        return memo[targetSum];
    }

    for(let num of numbers) {
        const remainder = targetSum - num;
        const res = howSum(remainder, numbers, memo);
        if(res !== null) {
            memo[targetSum] = [num, ...res];
            return memo[targetSum];
        }
    }

    memo[targetSum] = null;
    return memo[targetSum];
}


function bestSum(targetSum, numbers, memo = {}) {
    if(targetSum === 0) {
        return [];
    }

    if(targetSum < 0) {
        return null;
    }

    if(targetSum in memo) {
        return memo[targetSum];
    }

    let shortestCombination = null;

    for(let num of numbers) {
        const remainder = targetSum - num;
        const res = bestSum(remainder, numbers, memo);
        if(res !== null) {
            const comb = [num, ...res];
            if(shortestCombination === null || comb.length < shortestCombination.length) {
                shortestCombination = comb;
            }
            
        }
    }
    memo[targetSum] = shortestCombination
    return memo[targetSum];
}


function canConstruct(target, words, memo={}) {
    if(target === '') {
        return true;
    }
    if(target in memo) {
        return memo[target];
    }
    for(let word of words) {
        if(target.indexOf(word) === 0) {
            const suffix = target.slice(word.length);
            memo[target]= canConstruct(suffix, words, memo);
            if(memo[target] === true) {
                return true;
            }
        }
    }
    return false;
}

console.log(canConstruct('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeef', ['e', 'ee', 'eee' , 'eeee']));