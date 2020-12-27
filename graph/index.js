(()=>{
    function Graph() {

    }
    Graph.prototype.setNode = (nodeArr, nodeMatrix) => {
        this.nodeArr = nodeArr;
        // 邻接矩阵
        // 矩阵中为null则代表该方向没有边
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
        if (startNodeIndex === -1 || endNodeIndex === -1) return;
        this.nodeMatrix[startNodeIndex][endNodeIndex] = value;
    };
    Graph.prototype.getValue = (start, end) => {
        const startNodeIndex = getNodeIndex(start, this.nodeArr);
        const endNodeIndex = getNodeIndex(end, this.nodeArr);
        if (startNodeIndex === -1 || endNodeIndex === -1) {
            debugger
            return;
        }
        return this.nodeMatrix[startNodeIndex][endNodeIndex];
    };
    Graph.prototype.addValue = (start, end, value) => {
        const startNodeIndex = getNodeIndex(start, this.nodeArr);
        const endNodeIndex = getNodeIndex(end, this.nodeArr);
        if (startNodeIndex === -1 || endNodeIndex === -1) return;
        this.nodeMatrix[startNodeIndex][endNodeIndex] += value;
    };
    Graph.prototype.each = cb => {
        this.nodeMatrix.forEach((item, x) => {
            item.forEach((ite, y) => {
                if (ite !== null) {
                    cb && cb(ite, x, y);
                }
            })
        })
    };
    Graph.prototype.xEach = cb => {
        this.nodeMatrix.forEach(cb);
    };
    Graph.prototype.yEach = cb => {
        // TODO
    };
    Graph.prototype.getXArr = index => {
        if (index < 0) throw new Error('index不可小于0');
        return this.nodeMatrix[index];
    };
    Graph.prototype.getYArr = index => {
        // TODO
    };
    const getNodeIndex = (node, nodeArr) => {
        return nodeArr.findIndex(x => x === node);
    };

    window.Graph = Graph;
})();
