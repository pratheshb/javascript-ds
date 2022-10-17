class LinkedList {
  constructor(value) {
    const newNode = {
      value,
      next: null,
    };
    this.head = newNode;
    this.tail = this.head;
    this.length = 1;
  }

  append(value) {
    const newNode = {
      value,
      next: null,
    };
    this.tail.next = newNode;
    this.tail = newNode;
    this.length++;
    return this.__printList();
  }

  prepend(value) {
    this.head = {
      value,
      next: this.head,
    };
    this.length++;
    return this.__printList();
  }

  insert(index, value) {
    if (index === 0) {
      return this.prepend(value);
    }
    if (index >= this.length) {
      return this.append(value);
    }
    let pre = this.head;
    for (let i = 0; i < index - 1; i++) {
      pre = pre.next;
    }
    let Aft = pre.next;
    pre.next = {
      value,
      next: Aft,
    };
    this.length++;
    return this.__printList();
  }

  __printList() {
    const list = [];
    let temp = this.head;
    while (temp !== null) {
      list.push(temp.value);
      temp = temp.next;
    }
    return list;
  }

  remove(index) {
    if (index === 0) {
      return this.__removeFirstElm();
    }
    if (index === this.length - 1) {
      return this.__removeLastElm();
    }
    if (index >= this.length) {
      throw new Error('out of range');
    }
    let pre = this.head;
    for (let i = 0; i < index - 1; i++) {
      pre = pre.next;
    }
    const del = pre.next;
    const Aft = del.next;
    pre.next = Aft;
    this.length--;
    return this.__printList();
  }

  __removeFirstElm() {
    if (!this.head) {
      throw new Error('List Empty');
    }
    this.head = this.head.next;
    this.length--;
    return this.__printList();
  }
  __removeLastElm() {
    let pre = this.head;
    let temp = pre.next;
    while (temp.next !== null) {
      pre = pre.next;
      temp = temp.next;
    }
    pre.next = null;
    this.tail = pre;
    this.length--;
    return this.__printList();
  }

  reverse() {

    let next = null;
    let current = this.head;
    let prev = null;

    while(current) {
      next = current.next;
      current.next = prev;
      prev = current;
      current = next;
    }
    this.tail = this.head;
    this.head = prev;
    return this.__printList();
  }
}
