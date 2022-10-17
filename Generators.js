const cardDeck = {
    [Symbol.iterator]: function () {
        const shapes = ['♥', '♦', '♠', '♣'];
        const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        let shapeIndex = 0;
        let numberIndex = 0;
        let cardCount = 0;
        return {
            next: function () {
                let value = shapes[shapeIndex];
                if (numberIndex < 13) {
                    value += numbers[numberIndex++];
                    if (numberIndex === 13) {
                        numberIndex = 0;
                        shapeIndex++;
                    }
                }
                cardCount++;
                return { value, done: cardCount > 52 }
            }
        }
    }
}

const cardDeckWithGen = {
    [Symbol.iterator]: function* () {
        const shapes = ['♥', '♦', '♠', '♣'];
        const numbers = [2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K', 'A'];
        for (const shape of shapes) {
            for (const number of numbers) {
                yield shape + number;
            }
        }
    }
}

let a = [...cardDeck]
let b = [...cardDeckWithGen]

function* InfinityAndBeyond() {
    let i = 1;
    while(true){
        yield i++;
    }
}

function* taken(n , iterable) {
    for(const val of iterable) {
        if(n <=0) {
            return;
        }
        yield val;
        n--;
    }
}

function* map(iterable, mapFn) {
    for(const val of iterable) {
        yield mapFn(val);
    }
}

const squares = [...taken(5, map(InfinityAndBeyond(), x => x*x))]




function binaryTree(value) {
    const node = { value };
    node[Symbol.iterator] = function* () {
        yield this.value;
        if (this.leftChild) { yield* this.leftChild };
        if (this.rightChild) yield* this.rightChild;
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
    while (nextUrl) {
        const response = await fetch(nextUrl);
        const data = await response.json();
        nextUrl = data.next;
        yield* data.results;
    }

};

const asyncGen = generateStarWarsData('people');

(async () => { for await (let char of asyncGen()) { console.log(char.name) } })();