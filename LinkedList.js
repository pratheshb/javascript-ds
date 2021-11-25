class LinkedList {
  constructor(value) {
    debugger;
    this.head = {
      value,
      next: null,
    };
    this.tail = this.head;
    this.length = 1;
  }

  append(value) {
    const newNode = new Node(value);
    this.tail.next = newNode;
    this.tail = newNode;
    this.length++;
    return this;
  }

  prepend(value) {
    this.head = {
      value,
      next: this.head,
    };
    this.length++;
    return this;
  }

  insert(index, value) {
    if (index > this.length) {
      throw new Error(
        `Please enter valid index ranging from 0 to ${this.length}`
      );
    }
    if (index === this.length) {
      this.append(value);
    } else if (index === 0) {
      this.prepend(value);
    } else {
      let pre = this.head;
      for (let i = 0; i < index - 1; i++) {
        pre = pre.next;
      }
      const Aft = pre.next;
      const newNode = {
        value,
        next: Aft,
      };
      pre.next = newNode;
      this.length++;
    }
    return this.__printList();
  }

  __printList() {
    const res = [];
    let currentNode = this.head;
    while (currentNode !== null) {
      res.push(currentNode.value);
      currentNode = currentNode.next;
    }
    return res;
  }

  __findLastNode(node) {
    if (node.next === null) {
      return node;
    } else {
      return this.__findLastNode(node.next);
    }
  }

  __findSpecificNode(node, count, index) {
    if (index - 1 === count) {
      return node;
    } else {
      return this.__findSpecificNode(node.next, ++count, index);
    }
  }
}

class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

const myLinkedList = new LinkedList(3);

console.log(myLinkedList);
