(() => {
    const priority = [['^'],['*','/'],['log','ln','sin','cos'],['+','-']];
    const priorityNum = [[2],[2,2],[2,1,1,1],[2,2]];
    const priorityMath = [
        [
            function (a,b) {
                return Math.pow(a,b);
            },
        ],
        [
            function (a,b) {
                return a * b;
            },
            function (a,b) {
                return a / b;
            },
        ],
        [
            function (a,b) {
                return Math.log10(b)/Math.log10(a);
            },
            function (a) {
                return Math.log(a);
            },
            function (a) {
                return Math.sin(a);
            },
            function (a) {
                return Math.cos(a);
            }
        ],
        [
            function (a,b) {
                return a + b;
            },
            function (a,b) {
                return a - b;
            }
        ]
    ];
    const priorityMathFunc = [
        [
            function (a,b) {
                let aV = a.value(), bV = b.value();
                return Math.pow(aV,bV);
            },
        ],
        [
            function (a,b) {
                let aV = a.value(), bV = b.value();
                return aV * bV;
            },
            function (a,b) {
                let aV = a.value(), bV = b.value();
                return aV / bV;
            },
        ],
        [
            function (a,b) {
                let aV = a.value(), bV = b.value();
                return Math.log(bV)/Math.log(aV);
            },
            function (a) {
                let aV = a.value();
                return Math.log(aV);
            },
            function (a) {
                let aV = a.value();
                return Math.sin(aV);
            },
            function (a) {
                let aV = a.value();
                return Math.cos(aV);
            }
        ],
        [
            function (a,b) {
                let aV = a.value(), bV = b.value();
                return aV + bV;
            },
            function (a,b) {
                let aV = a.value(), bV = b.value();
                return aV - bV;
            }
        ]
    ];
    // valueFn, isVariable, diff
    const diffMath = [
        [
            function (a, b) {
                if (a.isVariable && !b.isVariable) {
                    return a.diff(...a.children) *
                        b.valueFn(...b.children) *
                        Math.pow(a.valueFn(...a.children), b.valueFn(...b.children) - 1);
                } else if (!a.isVariable && b.isVariable) {
                    return b.diff(...b.children) *
                        Math.log(a.valueFn(...a.children)) *
                        Math.pow(a.valueFn(...a.children), b.valueFn(...b.children));
                } else if (!a.isVariable && !b.isVariable) {
                    return 0;
                } else {
                    throw new Error('错误的表达式')
                }
            }
        ],
        [
            function (a, b) {
                return a.diff(...a.children) *
                    b.valueFn(...b.children) +
                    a.valueFn(...a.children) *
                    b.diff(...b.children);
            },
            function (a, b) {
                return (
                    a.diff(...a.children) *
                    b.valueFn(...b.children) -
                    a.valueFn(...a.children) *
                    b.diff(...b.children)) /
                    Math.pow(b.valueFn(...b.children), 2);
            }
        ],
        [
            function (a, b) {
                if (!a.isVariable && b.isVariable) {
                    return b.diff(...b.children) * Math.pow(b.valueFn(...b.children), -1) * Math.pow(Math.log(a.valueFn(...a.children)) ,-1);
                } else if (!a.isVariable && !b.isVariable) {
                    return 0;
                } else {
                    throw new Error('错误的表达式');
                }
            },
            function (a) {
                if (a.isVariable) {
                    return a.diff(...a.children) * Math.pow(a.valueFn(...a.children), -1);
                } else {
                    return 0;
                }
            },
            function (a) {
                if (a.isVariable) {
                    return a.diff(...a.children) * Math.cos(a.valueFn(...a.children));
                } else {
                    return 0;
                }
            },
            function (a) {
                if (a.isVariable) {
                    return -1* a.diff(...a.children) * Math.sin(a.valueFn(...a.children))
                } else {
                    return 0;
                }
            }
        ],
        [
            function (a, b) {
                return a.diff(...a.children) + b.diff(...b.children);
            },
            function (a, b) {
                return a.diff(...a.children) - b.diff(...b.children);
            }
        ]
    ];

    const reverseMath = [
        [
            // ^
            [
                function (a, b) {
                    let aV = a.value();
                    let bV = b.value();
                    return bV * Math.pow(aV, bV -1);
                },
                function (a, b) {
                    let aV = a.value();
                    let bV = b.value();
                    return Math.pow(aV, bV) * Math.log(aV);
                }
            ]
        ],
        [
            // *
            [
                function (a, b) {
                    return b.value();
                },
                function (a, b) {
                    return a.value();
                }
            ],
            // /
            [
                function (a, b) {
                    let bV = b.value();
                    return 1 / bV;
                },
                function (a, b) {
                    let aV = a.value();
                    let bV = b.value();
                    return -1 * aV * Math.pow(bV, -2);
                }
            ]
        ],
        [
            // log
            [
                function (a, b) {
                    let aV = a.value();
                    let bV = b.value();
                    return -1 * Math.log(bV) * aV;
                },
                function (a, b) {
                    let aV = a.value();
                    let bV = b.value();
                    return Math.pow(Math.log(aV), -1) * Math.pow(bV, -1);
                }
            ],
            // ln
            [
                function (a) {
                    let aV = a.value();
                    return Math.pow(aV, -1);
                },
            ],
            // sin
            [
                function (a) {
                    let aV = a.value();
                    return Math.cos(aV);
                }
            ],
            // cos
            [
                function (a) {
                    let aV = a.value();
                    return -1 * Math.sin(aV);
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

    const ForwardMode = function () {

    };
    window.ForwardMode = ForwardMode;
    ForwardMode.prototype.setVariable = function (variables) {
        this.variables = variables;
    };
    ForwardMode.prototype.setExpression = function (exp) {
        this.exp = exp;
    };
    // 将表达式转化为后缀表达式栈
    ForwardMode.prototype.generateMathStack = function () {

        let str = this.exp;
        let stack = [];
        let postfix = [];
        let num;
        let variable;
        let prevIsPrio = true;
        let prioritys;

        while (str) {
            // 匹配数字
            if (num = helper.matchingNum(str, prevIsPrio)) {
                postfix.push(num);
                str = helper.clipString(str,num);
                prevIsPrio = false;
            } else
            // 匹配变量
            if (variable = helper.matchingVariable(str, prevIsPrio, this.variables)) {
                postfix.push(variable);
                str = helper.clipString(str,variable.str);
                prevIsPrio = false;
            } else
            //匹配左括号 将左括号压入栈 切割字符串
            if (str[0] === '(') {
                stack.push('(');
                str = helper.leftPop(str);
                prevIsPrio = false;
            } else
            //匹配右括号 将栈中括号右边的全部运算符弹出并压入后缀表达式 切割字符串
            if (str[0] === ')') {
                postfix = postfix.concat(helper.popBrackets(stack));
                str = helper.leftPop(str);
                prevIsPrio = false;
            } else
            //匹配运算符 将栈中所有运算符弹出并压入后缀表达式直到遇到左括号或比当前运算符优先级高时停止
            //将自身压入栈 切割字符串
            if (prioritys = helper.getPriority(str)) {
                helper.popOperator(prioritys[0],stack,postfix);

                num = str.slice(0,priority[prioritys[0]][prioritys[1]].length);
                stack.push(prioritys);
                str = helper.clipString(str, num);
                prevIsPrio = true;
            } else {
                throw new Error('错误的运算符: ' + str[0]);
            }
        }
        helper.popAll(stack,postfix);
        this.postfix = postfix;
    };
    // 将后缀表达式栈转化为计算图
    ForwardMode.prototype.generateGraph = function () {
        let postfix = this.postfix;
        let tree = new Tree();

        helper.mathEach(null, tree, postfix, this);
        this.tree = tree;
    };
    // 遍历树，然后依次从根节点进行求导
    ForwardMode.prototype.mathDiff = function () {
        let self = this;
        this.tree.postOrderTraversal(this.tree.root, function (node) {
            if (node.type === 'C') {
                node.diff = function () {
                    return 0;
                };
                node.valueFn = function () {
                    return node.value;
                }
            } else if (node.type === 'variable') {
                if (node.index === 0) {
                    node.diff = function () {
                        return 1;
                    }
                } else {
                    node.diff = function () {
                        return 0;
                    }
                }
                node.valueFn = function () {
                    return self.variableValue[node.str];
                }
            } else {
                let isVariable = node.children.find(node => node.isVariable);
                isVariable = !!isVariable;
                node.isVariable = isVariable;
                if (node.isVariable) {
                    node.diff = node.diffFunc;
                } else {
                    node.diff = function () {
                        return 0;
                    }
                }
            }
        })
    };

    ForwardMode.prototype.reverse = function () {
        this.tree.postOrderTraversal(this.tree.root, node => {
            if (node.type === 'math') {
                node.value = function() {
                    node.func(...node.children);
                };
            }
        });
        this.tree.breadthFirstSearch(this.tree.root, node => {
            if (this.tree.isRoot(node)) {
                node.diff = 1;
            }
            if (node.children && node.children.length > 1) {
                node.children.forEach((child, i, arr) => {
                    let diffFunc = node.diffArr[i];
                    child.diff = diffFunc(...arr);
                })
            }
        });
        return this.tree;
    };

    const helper = {
        //去除空白符
        removerEmpty (src) {
            return src.replace(/\s+/g,'');
        },
        clipString (father, child) {
            return father.slice(child.length);
        },
        //字符串左移
        leftPop (str) {
            return str.slice(1);
        },
        //推出括号内的内容
        popBrackets (arr) {
            let str = [];

            while (arr[arr.length - 1] !== '(') {
                str.unshift(arr.pop());
                if (arr.length === 0) {
                    throw new Error('错误的表达式!!!');
                }
            }
            arr.pop();
            return str;
        },
        //获取优先级
        getPriority (str) {
            if (!str) return false;
            for (let i = 0; i < priority.length; i++) {
                const opers = priority[i];
                for (let j = 0; j < opers.length; j++) {
                    if (this.checkOperator(str,opers[j])) {
                        return [i,j];
                    }
                }
            }
            return false;
        },
        //检查字符串的开头是否为oper
        checkOperator (str, oper) {
            return str.indexOf(oper) === 0;
        },
        //切割数字
        matchingNum (str, prev) {
            let reg = prev ?
                /^((\+|\-){0,1}[0-9]+(\.[0-9]+){0,1}|(π|e))/g :
                /^([0-9]+(\.[0-9]+){0,1}|(π|e))/g;
            let num;

            if (num = reg.exec(str)) {
                return num[0];
            }
            return false;
        },
        // 匹配变量
        matchingVariable(str, prev, variables) {
            let index;
            if (!prev || str[0] !== '-') {
                index = variables.findIndex(x => str.indexOf(x) === 0);
                if (index !== -1) {
                    return {
                        index,
                        str: variables[index],
                        negative: false
                    };
                } else {
                    return false;
                }
            } else {
                if (str[0] === '-') {
                    throw new Error('错误的表达式');
                    // index = variables.findIndex(x => str.indexOf(x) === 1);
                    // if (index !== -1) {
                    //     return {
                    //         index,
                    //         str: '-' + variables[index],
                    //         negative: true
                    //     };
                    // } else {
                    //     return false;
                    // }
                }
            }
        },
        //运算符出栈
        popOperator (priority, stack, postfix) {
            while (stack[stack.length - 1] !== '(' &&
            stack[stack.length - 1] &&
            priority >= stack[stack.length - 1][0]) {
                postfix.push(stack.pop());
            }
        },
        //推出栈中所有的操作符
        popAll (stack, postfix) {
            while (stack.length) {
                postfix.push(stack.pop());
            }
        },
        //计算
        mathResult (args, fn) {
            return fn.apply(null,args);
        },
        // 将栈转化为树
        mathEach (father, tree, arr, self) {
            let item = arr.pop();
            if (item instanceof Array) {
                // 如果是函数则向左查询，直到参数用完
                let str = priority[item[0]][item[1]];
                let argNum = priorityNum[item[0]][item[1]];
                let func = priorityMathFunc[item[0]][item[1]];
                let diffArr = reverseMath[item[0]][item[1]];
                let node = {
                    str,
                    argNum,
                    func,
                    type: 'math',
                    diffArr,
                };
                let len = 0;
                tree.addNode(node, father);
                while (len < argNum) {
                    helper.mathEach(node, tree, arr);
                    len += 1;
                }
            } else if (item instanceof  Object) {
                // 如果是变量则转化为节点并加入树中
                // index: [index],
                // str: variables[index],
                // negative: false
                let node = {
                    value: function() {
                        return function () {
                            return self.variableValues[item.str];
                        };
                    },
                    key: item.str,
                    index: item.index,
                    type: 'variable',
                    isVariable: true,
                };
                tree.addNode(node, father);
            } else {
                // 如果是数字则转化为节点并加入树中
                let node = {
                    value: function () {
                        return parseFloat(item);
                    },
                    type: 'C',
                    isVariable: false,
                };
                tree.addNode(node, father);
            }
        },
    };
})();
