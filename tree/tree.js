(() => {
    const Tree = function () {
        this.root = null;
    };
    Tree.prototype.addNode = function (node, parent) {
        // 没有父元素则设置该元素为根节点
        if (!parent) {
            this.root = node;
        } else {
            parent.children.push(node);
        }
        node.parent = parent || null;
        node.children = [];
    };
    Tree.prototype.addChild = function (parentNode, childNode) {
        parentNode.children.push(childNode);
        childNode.parent = parentNode;
    };
    Tree.prototype.isRoot = function(node) {
        return node.parent === null;
    };
    // 深度优先搜索之后序遍历
    Tree.prototype.postOrderTraversal = function(root, cb) {
        postOrderTraversal(root, cb);
    };
    function postOrderTraversal(node, cb) {
        if (node.children && node.children.length > 0) {
            node.children.forEach(child => {
                postOrderTraversal(child, cb);
            });
        }
        cb(node);
    }
    Tree.prototype.rotateTree = function() {
        rotateTree(this.root);
    };
    function rotateTree(node) {
        if (node.children && node.children.length > 0) {
            let newChildrenArr = [];
            let childrenLen = node.children.length;
            for (let i = childrenLen - 1; i >= 0; i--) {
                const child = node.children[i];
                child.index = newChildrenArr.length;
                rotateTree(child);
                newChildrenArr.push(child);
            }
            node.children = newChildrenArr;
        }
    }

    // 广度优先搜索
    Tree.prototype.breadthFirstSearch = function(root, cb) {
        breadthFirstSearch([root], cb);
    };
    function breadthFirstSearch(stack, cb) {
        if (stack.length > 0) {
            let node = stack.pop();
            cb(node);
            if (node.children && node.children.length > 0) {
                stack = stack.concat(node.children);
            }
            breadthFirstSearch(stack, cb);
        }
    }
    window.Tree = Tree;
})();
