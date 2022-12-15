class Node {
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
    }
}


class BinarySearchTree {
    constructor() {
        this.root = null;
    }

    insert(value) {
        if (!this.root) {
            this.root = new Node(value);
            return;
        }

        let currentNode = this.root;

        while (currentNode) {
            if (value < currentNode.value) {
                if (!currentNode.left) {
                    currentNode.left = new Node(value);
                    return;
                }
                currentNode = currentNode.left;
            } else if (value > currentNode.value) {
                if (!currentNode.right) {
                    currentNode.right = new Node(value);
                    return;
                }
                currentNode = currentNode.right;
            } else {
                return;
            }
        }
    }

    lookup(value) {
        let currentNode = this.root;

        while (currentNode) {
            if (value < currentNode.value) {
                currentNode = currentNode.left;
            } else if (value > currentNode.value) {
                currentNode = currentNode.right;
            } else if (value === currentNode.value) {
                return currentNode;
            }
        }

        return null;
    }


    _getParentAndCurrentNode(value) {
        let parentNode;
        let currentNode = this.root;

        while (currentNode) {
            if (value < currentNode.value) {
                parentNode = currentNode;
                currentNode = currentNode.left;
            } else if (value > currentNode.value) {
                parentNode = currentNode;
                currentNode = currentNode.right;
            } else if (value === currentNode.value) {
                return { parentNode: parentNode || currentNode, currentNode };
            }
        }

        return { parentNode: null, currentNode: null };
    }

    _findSuccessor(node) {
        let parentNode = node;
        node = node.right;
        while (node) {
            if (!node.left) {
                return { successor: node, successorParent: parentNode };
            }
            parentNode = node;
            node = node.left;
        }
    }

    remove(value) {
        const { parentNode, currentNode } = this._getParentAndCurrentNode(value);

        if (currentNode) {
            let nextNode = currentNode.left || currentNode.right;
            if (currentNode.left && currentNode.right) {
                const { successor, successorParent } = this._findSuccessor(currentNode);
                if (successorParent.value === value) {
                    successor.left = successorParent.left;
                } else {
                    if (successor.right) {
                        if (successorParent.value < successor.right.value) {
                            successorParent.left = successor.right;
                            successorParent.right = null;
                        } else if (successorParent.value > successor.right.value) {
                            successorParent.right = successor.right;
                            successorParent.left = null;
                        }
                    } else {
                        successorParent.left = null;
                    }
                    successor.right = currentNode.right;
                    successor.left = currentNode.left;
                }
                nextNode = successor;
            }

            if (value < parentNode.value) {
                parentNode.left = nextNode;
            } else if (value > parentNode.value) {
                parentNode.right = nextNode;
            } else {
                this.root = nextNode;
            }
        }
    }

    breadthFirstSearch() {
        let list = [];
        let current = this.root;
        let queue = [current];

        while (queue.length) {
            current = queue.shift();
            list.push(current.value);
            if (current.left) {
                queue.push(current.left);
            }
            if (current.right) {
                queue.push(current.right);
            }
        }

        return list;
    }

    breadthFirstSearchR(queue, list) {
        if (!queue.length) {
            return list;
        }

        let current = queue.shift();
        list.push(current.value);
        if (current.left) {
            queue.push(current.left);
        }
        if (current.right) {
            queue.push(current.right);
        }

        return this.breadthFirstSearchR(queue, list);
    }

    DFSinOrder() {
        return this.__traverseInOrder(this.root, []);
    }

    DFSpreOrder() {
        return this.__traversePreOrder(this.root, []);
    }

    DFSpostOrder() {
        return this.__traversePostOrder(this.root, []);
    }

    __traverseInOrder(current, list) {
        if (current.left) {
            this.__traverseInOrder(current.left, list);
        }
        list.push(current.value);
        if (current.right) {
            this.__traverseInOrder(current.right, list);
        }
        return list;
    }

    __traversePreOrder(current, list) {
        list.push(current.value);

        if (current.left) {
            this.__traversePreOrder(current.left, list);
        }
        if (current.right) {
            this.__traversePreOrder(current.right, list);
        }
        return list;
    }

    __traversePostOrder(current, list) {
        if (current.left) {
            this.__traversePostOrder(current.left, list);
        }
        if (current.right) {
            this.__traversePostOrder(current.right, list);
        }

        list.push(current.value);
        return list;
    }

    isSubTreeLesser(node, value) {
        if (node === null) {
            return true;
        }

        if (
            node.value <= value &&
            this.isSubTreeLesser(node.left, value) &&
            this.isSubTreeLesser(node.right, value)
        ) {
            return true;
        }

        return false;
    }

    isSubTreeGreater(node, value) {
        if (node === null) {
            return true;
        }

        if (
            node.value > value &&
            this.isSubTreeGreater(node.left, value) &&
            this.isSubTreeGreater(node.right, value)
        ) {
            return true;
        }

        return false;
    }

    isValidBST_1(root) {
        if (root === null) {
            return true;
        }

        if (
            this.isSubTreeLesser(root.left, root.value) && 
            this.isSubTreeGreater(root.right, root.value) && 
            this.isValidBST_1(root.left) && 
            this.isValidBST_1(root.right)
        ) {
            return true;
        }

        return false;
    }

    isValisBSTUtil(current, min, max) {
        if (current === null) {
            return true;
        }

        if (
            current.value > min
            && current.value < max
            && this.isValisBSTUtil(current.left, min, current.value)
            && this.isValisBSTUtil(current.right, current.value, max)
        ) {
            return true;
        }
    }

    isValidBST_2(root) {
        return _this.isValisBSTUtil(root, -Infinity, Infinity)
    }

    isValidBST_3(root) {
        let prev = null;
        if(root === null) {
            return true;
        }

        if(!_isValidBST_3(root.left)) {
            return false;
        }

        if(prev !== null && root.value < prev.value) {
            return false;
        }

        prev = root;

         if(this.isValidBST_3(root.right)) {
            return true;
         }
    }
}