(() => {
    /**
     * 决策树
     *
     * 设D为训练集，A为属性集|y|为类别
     *
     * D = [
     *  {色泽: 墨绿, 纹理: 清晰, result: 0}
     * ]
     * A = {色泽: [墨绿, 乌黑], 纹理: [清晰, 模糊], attr: ['色泽', '纹理']}
     * y = [0, 1]
     *
     * 以下三种情况下会生成叶节点，从而使得递归终止
     *
     * 1.当分类后的类别相同，所以无需划分
     * 2.当属性集为空，即所有属性都是离散属性且祖先节点已经使用过所有属性集时，会导致无法划分属性
     * 3.类型不同，且属性集也不为空，但是训练集中所有的属性都对应于同一属性，其他划分都是空集
     */
    const DecisionTree = function (y) {
        this.root = null;
        this.y = y;
    };
    DecisionTree.prototype.generateTree = function(D, A, node) {
    };
    DecisionTree.prototype.infoEntropy = function() {

    };
    DecisionTree.prototype.fit = function (D, A) {

    };

    // 判断训练集是否全部是同一类别
    DecisionTree.isSameResult = function (D) {
        let same;
        D.some(x => {
            if (same) {
                if (x.result !== same) {
                    return true;
                }
            } else {
                same = x.result;
            }
        });
        return same === true;
    };
    // 判断属性集是否为空
    DecisionTree.isEmptyAttr = function (A) {
        return A.attr.length === 0;
    };
    DecisionTree.isSameAttr = function (D, A) {

    };
})();
