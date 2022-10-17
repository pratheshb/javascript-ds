class Graph {
    constructor() {
        this.nodes = 0;
        this.adjacentList = {};
    }

    addVertext(node) {
        this.adjacentList[node] = [];
        this.nodes++;
    }

    addEdge(node1, node2) {
        this.adjacentList[node1].push(node2);
        this.adjacentList[node2].push(node1);
    }

    showConnections() {
        for(let key in this.adjacentList) {
            console.log(key, ' : ', this.adjacentList[key])
        }
    }
}