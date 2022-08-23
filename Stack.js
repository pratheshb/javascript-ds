class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class Stack {
    constructor() {
        this.top = null;
        this.bottom = null;
        this.length = 0;
    }

    push(value) {
        const newNode = new Node(value);
        if (!this.top) {
            this.top = newNode;
            this.bottom = this.top;
        } else {
            newNode.next = this.top;
            this.top = newNode;
        }
        this.length++;

        return this._printList();
    }

    _printList() {
        const list = [];
        let node = this.top;
        while (node) {
            list.push(node.value);
            node = node.next;
        }
        return list;
    }

    pop() {
        if (!this.length) {
            return this._printList();
        }
        this.top = this.top.next;
        if (!this.top) {
            this.bottom = this.top;
        }
        this.length--;

        return this._printList();
    }

    peak() {
        return this.top ? this.top.value : null;
    }

    isEmpty() {
        return !this.top;
    }
}


class Stack {
    constructor() {
        this.top = null;
        this.bottom = null;
        this.length = 0;
    }

    push(value) {
        if(this.length === 0) {
            this.top = []
            this.bottom = [value];
        }

        this.top.push(value);
        this.length++;
    }

    pop() {
        if(!this.length) {
            return;
        }

        if(this.length === 1) {
            this.bottom.pop();
        }
        this.top.pop();
        this.length--;
    }
}