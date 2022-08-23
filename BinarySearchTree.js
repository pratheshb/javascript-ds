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
}