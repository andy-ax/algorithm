(()=>{
    const priority = [['^'],['*','/'],['log','ln','sin','cos'],['+','-']];
    const priorityNum = [[2],[2,2],[2,1,1,1],[2,2]];
    const diffMath = [
        [
            // ^
            [
                function (a, b) {
                    if (a.value && b.value) {
                        let aV = a.value();
                        let bV = b.value();
                        if (typeof aV === 'number' && typeof bV === 'number') {
                            return bV * Math.pow(aV, bV -1);
                        } else {
                            return `(${bV}*${aV}^(${bV}-1))`
                        }
                    } else {
                        return `(${b.str}*${a.str}^(${b.str}-1))`
                    }
                },
                function (a, b) {
                    if (a.value && b.value) {
                        let aV = a.value();
                        let bV = b.value();
                        if (typeof aV === 'number' && typeof bV === 'number') {
                            return Math.pow(aV, bV) * Math.log(aV);
                        } else {
                            return `(ln(${aV})*${aV}^${bV})`;
                        }
                    } else {
                        return `(ln(${a.str})*${a.str}^${b.str})`;
                    }
                }
            ]
        ],
        [
            // *
            [
                function (a, b) {
                    if (b.value) {
                        return b.value();
                    } else {
                        return b.str;
                    }
                },
                function (a, b) {
                    if (a.value) {
                        return a.value();
                    } else {
                        return a.str;
                    }
                }
            ],
            // /
            [
                function (a, b) {
                    if (b.value) {
                        let bV = b.value();
                        return 1 / bV;
                    } else {
                        return `(1/${b.str})`
                    }
                },
                function (a, b) {
                    if (a.value && b.value) {
                        let aV = a.value();
                        let bV = b.value();
                        if (typeof aV === 'number' && typeof bV === 'number') {
                            return -1 * aV * Math.pow(bV, -2);
                        } else {
                            return `(-1*${aV}*${bV}^-2)`;
                        }
                    } else {
                        return `(-1*${a.str}*${b.str}^-2)`;
                    }
                }
            ],
        ],
        [
            // log
            [
                function (a, b) {
                    if (a.value && b.value) {
                        let aV = a.value();
                        let bV = b.value();
                        if (typeof aV === 'number' && typeof bV === 'number') {
                            return -1 * Math.log(bV) * aV;
                        } else {
                            return `(-1*ln${bV}*${aV})`
                        }
                    } else {
                        return `(-1*ln${b.str}*${a.str})`;
                    }
                },
                function (a, b) {
                    if (a.value && b.value) {
                        let aV = a.value();
                        let bV = b.value();
                        if (typeof aV === 'number' && typeof bV === 'number') {
                            return Math.pow(Math.log(aV), -1) * Math.pow(bV, -1);
                        } else {
                            return `((1/(ln${aV}))*(1/${bV}))`;
                        }
                    } else {
                        return `((1/(ln${a.str}))*(1/${b.str}))`;
                    }
                }
            ],
            // ln
            [
                function (a) {
                    if (a.value) {
                        let aV = a.value();
                        if (typeof aV === 'number') {
                            return Math.pow(aV, -1);
                        } else {
                            return `(1/(ln${aV}))`;
                        }
                    } else {
                        return `(1/(ln${a.str}))`;
                    }
                },
            ],
            // sin
            [
                function (a) {
                    if (a.value) {
                        let aV = a.value();
                        if (typeof aV === 'number') {
                            return Math.cos(aV);
                        } else {
                            return `(cos(${aV}))`;
                        }
                    } else {
                        return `(cos(${a.str}))`;
                    }
                }
            ],
            // cos
            [
                function (a) {
                    if (a.value) {
                        let aV = a.value();
                        if (typeof aV === 'number') {
                            return -1 * Math.sin(aV);
                        } else {
                            return `(-1*sin(${aV}))`;
                        }
                    } else {
                        return `(-1*sin(${a.str}))`;
                    }
                }
            ]
        ],
        [
            // +
            [
                function () {
                    return 1;
                },
                function () {
                    return 1;
                }
            ],
            // -
            [
                function () {
                    return 1;
                },
                function () {
                    return -1;
                }
            ]
        ]
    ];
    const valueMath = [
        [
            // ^
            function (a, b, node) {
                if (a.isVar && b.isVar) {
                    node.isVar = true;
                    const str = `(${a.str}^${b.str})`;
                    node.str = str;
                    return str;
                } else {
                    let aV = a.str || a.value(), bV = b.str || b.value();
                    if (a.isVar || b.isVar) {
                        node.isVar = true;
                        const str = `(${aV}^${bV})`;
                        node.str = str;
                        return str;
                    } else {
                        return Math.pow(aV,bV);
                    }
                }
            },
        ],
        [
            // *
            function (a, b, node) {
                if (a.isVar && b.isVar) {
                    node.isVar = true;
                    const str = `(${a.str}*${b.str})`;
                    node.str = str;
                    return str;
                } else {
                    let aV = a.str || a.value(), bV = b.str || b.value();
                    if (a.isVar || b.isVar) {
                        node.isVar = true;
                        const str =  `(${aV}*${bV})`;
                        node.str = str;
                        return str;
                    } else {
                        return aV * bV;
                    }
                }
            },
            // /
            function (a, b, node) {
                if (a.isVar && b.isVar) {
                    node.isVar = true;
                    const str = `(${a.str}/${b.str})`;
                    node.str = str;
                    return str;
                } else {
                    let aV = a.str || a.value(), bV = b.str || b.value();
                    if (a.isVar || b.isVar) {
                        node.isVar = true;
                        const str = `(${aV}/${bV})`;
                        node.str = str;
                        return str;
                    } else {
                        return aV / bV;
                    }
                }
            },
        ],
        [
            // log
            function (a, b, node) {
                if (a.isVar && b.isVar) {
                    node.isVar = true;
                    const str = `(ln(${a.str})/ln(${b.str}))`;
                    node.str = str;
                    return str;
                } else {
                    let aV = a.str || a.value(), bV = b.str || b.value();
                    if (a.isVar || b.isVar) {
                        node.isVar = true;
                        const str = `(ln(${aV})/ln(${bV}))`;
                        node.str = str;
                        return str;
                    } else {
                        return Math.log(bV)/Math.log(aV);
                    }
                }
            },
            // ln
            function (a, node) {
                if (a.isVar) {
                    node.isVar = true;
                    const str = `(ln(${a.str}))`;
                    node.str = str;
                    return str;
                } else {
                    let aV = a.value();
                    if (a.isVar) {
                        node.isVar = true;
                        const str = `(ln(${aV}))`;
                        node.str = str;
                        return str;
                    } else {
                        return Math.log(aV);
                    }
                }
            },
            // sin
            function (a, node) {
                if (a.isVar) {
                    node.isVar = true;
                    const str = `(sin(${a.str}))`;
                    node.str = str;
                    return str;
                } else {
                    let aV = a.value();
                    if (a.isVar) {
                        node.isVar = true;
                        const str = `(sin(${aV}))`;
                        node.str = str;
                        return str;
                    } else {
                        return Math.sin(aV);
                    }
                }
            },
            // cos
            function (a, node) {
                if (a.isVar) {
                    node.isVar = true;
                    const str = `(cos(${a.str}))`;
                    node.str = str;
                    return str;
                } else {
                    let aV = a.value();
                    if (a.isVar) {
                        node.isVar = true;
                        const str = `(cos(${aV}))`;
                        node.str = str;
                        return str;
                    } else {
                        return Math.cos(aV);
                    }
                }
            },
        ],
        [
            // +
            function (a, b, node) {
                if (a.isVar && b.isVar) {
                    node.isVar = true;
                    const str = `(${a.str}+${b.str})`;
                    node.str = str;
                    return str;
                } else {
                    let aV = a.str || a.value(), bV = b.str || b.value();
                    if (a.isVar || b.isVar) {
                        node.isVar = true;
                        const str = `(${aV}+${bV})`;
                        node.str = str;
                        return str;
                    } else {
                        return aV+bV;
                    }
                }
            },
            // -
            function (a, b, node) {
                if (a.isVar && b.isVar) {
                    node.isVar = true;
                    const str = `(${a.str}-${b.str})`;
                    node.str = str;
                    return str;
                } else {
                    let aV = a.str || a.value(), bV = b.str || b.value();
                    if (a.isVar || b.isVar) {
                        node.isVar = true;
                        const str = `(${aV}-${bV})`;
                        node.str = str;
                        return str;
                    } else {
                        return aV-bV;
                    }
                }
            },
        ]
    ];

    function AutoDiff(str, variables) {
        this.variables = variables;
        this.postfix = postfixExpress(str, variables);
    }
    // 生成树
    AutoDiff.prototype.generateTree = function () {
        let postfix = this.postfix;
        let tree = new Tree();

        mathEach(null, tree, postfix, this);
        tree.rotateTree();
        this.tree = tree;
    };
    AutoDiff.prototype.diff = function () {
        let tree = this.tree;
        // 深度优先搜索，对node的value函数进行包装
        tree.postOrderTraversal(tree.root, node => {
            if (node.type === 'math') {
                node.value = function() {
                    return node.func(...node.children, node);
                };
            }
        });
        // 广度优先搜索，对node的diff值进行计算
        tree.breadthFirstSearch(tree.root, node => {
            if (tree.isRoot(node)) {
                node.diff = 1;
                node.diffType = 'C';
            } else {
                let parent = node.parent;
                let diffFunc = parent.diffArr[node.index];
                let diff = diffFunc(...parent.children);
                if (typeof diff === 'string' || typeof parent.diff === 'string') {
                    node.diff = `${parent.diff}*${diff}`
                } else {
                    node.diff = parent.diff*diff;
                }
            }
        });
        // 根据广度优先搜索出来的值 进行字符串叠加
        let variableObj = {};
        this.variables.forEach(x => {
            variableObj[x] = '';
        });
        tree.postOrderTraversal(tree.root, node => {
            if (node.type === 'var') {
                let variable = variableObj[node.str];
                if (variable) {
                    variableObj[node.str] += ('+'+node.diff);
                } else {
                    variableObj[node.str] = node.diff;
                }
            }
        });
        this.variablesObj = variableObj;
    };
    AutoDiff.prototype.math = function (values) {
        let valueObj = {};
        this.variables.forEach(x => {
            let str = this.variablesObj[x];
            let value = postfixExpressByValue(str, this.variables, values);
            valueObj[x] = value;
        });
        return valueObj;
    };

    window.AutoDiff = AutoDiff;

    function mathEach (father, tree, arr, self) {
        let item = arr.pop();
        if (item instanceof Array) {
            // 如果是函数则向左查询，直到参数用完
            let str = priority[item[0]][item[1]];
            let argNum = priorityNum[item[0]][item[1]];
            let func = valueMath[item[0]][item[1]];
            let diffArr = diffMath[item[0]][item[1]];
            let node = {
                argNum,
                func,
                mathStr: str,
                type: 'math',
                diffArr,
            };

            let len = 0;
            tree.addNode(node, father);
            while (len < argNum) {
                mathEach(node, tree, arr);
                len += 1;
            }
        } else if (item instanceof  Object) {
            // 如果是变量则转化为节点并加入树中
            let node = {
                str: item.str,
                index: item.index,
                type: 'var',
                isVar: true,
            };
            tree.addNode(node, father);
        } else {
            // 如果是数字则转化为节点并加入树中
            let node = {
                value: function () {
                    if (item === 'π') {
                        return 'π';
                    } else if (item === 'e') {
                        return 'e';
                    } else {
                        return parseFloat(item);
                    }
                },
                str: item,
                type: 'C',
            };
            tree.addNode(node, father);
        }
    }
})();
