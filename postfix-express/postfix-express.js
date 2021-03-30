(()=>{
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
            function (a,b) {
                return a % b;
            }
        ],
        [
            function (a,b) {
                return Math.log10(b)/Math.log10(a);
            },
            function (a) {
                return Math.log(a);
            },
            function (a,b) {
                return Math.pow(b,(1/a));
            },
            function (a) {
                return Math.sin(a);
            },
            function (a) {
                return Math.cos(a);
            },
            function (a) {
                return Math.tan(a);
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
    };
    function postfixExpress(str, variables) {
        let stack = [];
        let postfix = [];
        let num;
        let variable;
        let prevIsPrio = true;
        let prioritys;

        str = helper.removerEmpty(str);

        while (str) {
            // 匹配数字
            if (num = helper.matchingNum(str, prevIsPrio)) {
                postfix.push(num);
                str = helper.clipString(str,num);
                prevIsPrio = false;
            } else
            // 匹配变量
            if (variable = helper.matchingVariable(str, prevIsPrio, variables)) {
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
        return postfix;
    }
    function compute (postfix) {
        let numArr = [];
        let result;

        let element;
        let args;
        let prio;
        let argLen;

        while (postfix.length) {
            if (typeof(postfix[0]) === 'string') {
                element = postfix.shift();
                if (element === 'π') {
                    element = Math.PI;
                } else if (element === 'e') {
                    element = Math.E;
                } else {
                    element = parseFloat(element);
                }
                numArr.push(element);
            } else {
                prio = postfix[0];
                argLen = priorityNum[prio[0]][prio[1]];

                if (numArr.length < argLen) throw new Error('错误的表达式!!!');

                args = numArr.splice(numArr.length - argLen);
                result = helper.mathResult(args,priorityMath[prio[0]][prio[1]]);
                numArr.push(result);

                postfix.shift();
            }
        }
        if (numArr.length !== 1) throw new Error('错误的表达式!!!');
        return numArr[0];
    }
    function postfixExpressByValue(str, variables, value) {
        variables.forEach((x, i) => {
            str = str.replaceAll(x, value[i]);
        });
        let postfix = postfixExpress(str,[]);
        return compute(postfix);
    }
    window.postfixExpress = postfixExpress;
    window.postfixExpressByValue = postfixExpressByValue;
})();
