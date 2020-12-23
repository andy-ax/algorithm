(()=>{
    function Graph() {

    }
    Graph.prototype.setNode = (nodeArr, nodeMatrix) => {
        this.nodeArr = nodeArr;
        /**
         *   a b c d 终点
         * a 1 1 1 1
         * b 1 1 1 1
         * c 1 1 1 1
         * d 1 1 1 1
         *起点
         */
        this.nodeMatrix = nodeMatrix;
    };

    Graph.prototype.setValue = (start, end, value) => {
        const startNodeIndex = getNodeIndex(start, this.nodeArr);
        const endNodeIndex = getNodeIndex(end, this.nodeArr);
        if (!startNodeIndex || !endNodeIndex || startNodeIndex !== 0 || endNodeIndex !== 0) return;
        this.nodeMatrix[startNodeIndex][endNodeIndex] = value;
    }
    Graph.prototype.getValue = (start, end) => {
        const startNodeIndex = getNodeIndex(start, this.nodeArr);
        const endNodeIndex = getNodeIndex(end, this.nodeArr);
        if (!startNodeIndex || !endNodeIndex || startNodeIndex !== 0 || endNodeIndex !== 0) return;
        return this.nodeMatrix[startNodeIndex][endNodeIndex];
    }
    const getNodeIndex = (node, nodeArr) => {
        return nodeArr.find(x => x === node);
    }

    window.Graph = Graph;
})()
