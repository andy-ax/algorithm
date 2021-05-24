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
     * 3.类别不同，且属性集也不为空，但是训练集中所有的属性都是同一类属性，其他划分都是空集
     * 例: D = [{色泽: 墨绿, 纹理: 清晰, result: 0},{色泽: 墨绿, 纹理: 清晰, result: 1}]
     * A = {色泽: [墨绿, 乌黑], 纹理: [清晰, 模糊], attr: ['色泽', '纹理']}
     * 4.样本集合为空，无法划分
     *
     * 结构
     * root: {
     *     type: null       上一个内部节点划分时的结果
     *     attr: 色泽,       当前节点的划分
     *     parent: null,    父节点
     *     D: D,            当前节点划分时的训练集
     *     A: A,            当前节点划分时的属性集
     *     children: [      子节点列表
     *         {
     *             type: 墨绿
     *             attr: 纹理,
     *             D: D,
     *             A: A
     *             children: [],
     *             parent: --> root,
     *         },
     *         {
     *             type: 乌黑
     *             result: 0,
     *             parent: --> root,
     *         }
     *     ]
     * }
     */
    const DecisionTree = function (y) {
        this.y = y;
    };
    DecisionTree.prototype.generateTree = function(D, A, node, parent) {
    };
    DecisionTree.prototype.infoEntropy = function() {

    };
    DecisionTree.prototype.fit = function (D, A) {
        this.root = {};
        this.generateTree(D, A, this.root, null);
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
    // 同一类别时的处理
    DecisionTree.sameResultHandle = function(D) {
        return D[0].result;
    };
    // 判断属性集是否为空
    DecisionTree.isEmptyAttr = function (A) {
        return A.attr.length === 0;
    };
    // 判断所有训练集是否都是同一属性
    DecisionTree.isSameAttr = function (D, A) {
        const attrList = A.attr;
        let attrs = {};
        return D.some(d => {
            return attrList.some(attr => {
                if (attrs[attr]) {
                    if (attrs[attr] === d[attr]) {
                        return false
                    } else {
                        return true;
                    }
                } else {
                    attrs[attr] = d[attr];
                    return false;
                }
            })
        })
    };
    // 属性集为空时以及所有训练集都是同一属性时的处理
    DecisionTree.attrHandle = function(D, y) {
        // 将当前节点类别最多的类别定为该叶节点的结果
        let yTotal = y.map(() => 0);
        D.forEach(d => {
            yTotal[d.result] += 1;
        });
        let maxIndex = 0;
        let max = 0;
        yTotal.forEach((x, i) => {
            if (x > max) {
                max = x;
                maxIndex = i;
            }
        });
        return maxIndex;
    };
    // 样本集合为空时的处理
    DecisionTree.emptyDHandle = function (node, y) {
        const parent = node.parent;
        // 将父节点类别最多的类别定为该叶节点的结果
        return DecisionTree.attrHandle(parent.D, y);
    }
})();
