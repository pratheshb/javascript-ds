class HashTable {
    constructor(size) {
        this.data = new Array(size);
    }

    _hash(key) {
        let hash = 0;
        for (let i = 0; i < key.length; i++) {
            hash = (hash + (key.charCodeAt(i) * i)) % this.data.length;
        }
        return hash;
    }

    set(key, value) {
        let address = this._hash(key);
        if (this.data[address]) {
            this.data[address].append([key, value]);
        } else {
            this.data[address] = new LinkedList([key, value]);
        }

    }

    get(key) {
        let address = this._hash(key);
        const container = this.data[address];
        if (!container) {
            return undefined;
        }
        let head = container.head;
        while (head) {
            if (head.value[0] === key) {
                return head.value[1];
            }
            head = head.next;
        }
    }

    delete(key) {
        let address = this._hash(key);
        const container = this.data[address];
        if (!container) {
            return false;
        }

        let head = container.head;
        let index = 0;
        while (head) {
            if (head.value[0] === key) {
                container.remove(index);
                return true;
            }
            head = head.next;
            index++;
        }
        return false;
    }
}