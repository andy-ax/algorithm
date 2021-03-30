(()=>{
    /**
     * 感知器
     *    step1 输入向量x1乘以权重向量w得到结果
     *    step2 判断结果是否大于阀值v,是则返回1否则返回-1
     *    step3 设w0等于-v,设x0等于1 则判断公式为 w0*x0+w1*x1+...+wn*xn > 0 ? 1 : -1
     *    step4 根据计算出的结果y来更新权重，
     *      更新方程为 wj = wj+Δwj， Δwj = η(y-Δy)xj
     *      其中 y是实际值 Δy是计算后的预测值 η为学习速率,介于0到1之间
     *    step5 如果计算后的Δwj = 0则感知器可不做更新 也可设置最大迭代次数防止无法收敛
     *    step6 感知器收敛点前提是类别必须为线性可分段，且学习速率足够小
     */
    function Perceptron(dotArray, resultArray) {
        this.dots = dotArray;
        this.y = resultArray;
    }

    // 设置阈值
    Perceptron.prototype.setThreshold = function (threshold) {
        this.threshold = threshold;
    };
    // 设置学习速率，介于0-1之间
    Perceptron.prototype.setRate = function(rate) {
        this.theta = rate;
    };
    Perceptron.prototype.fit = function () {
        let len = this.dots[0].length;
        let weight = generateBaseWeight(len);
        const eachTwice = 50;
        let lastResult;
        for (let i = 0; i < eachTwice; i++) {
            let resultArr = [];
            this.dots.forEach((input, i) => {
                let result = mathResult(input, weight, this.threshold);
                weight = updateWeight(input, weight, result, this.y[i], this.theta);
                resultArr.push(result);
            });
            if (!lastResult) {
                lastResult = resultArr;
            } else {
                if (arrayIsSame(lastResult, resultArr)) {
                    this.weight = weight;
                    this.eachTwice = i + 1;
                    return;
                }
            }
        }
        this.weight = weight;
        this.eachTwice = eachTwice;
    };
    Perceptron.prototype.math = function (mathDots, results) {
        let mathResultArr = [];
        mathDots.forEach((input, i) => {
            const r = mathResult(input, this.weight, this.threshold);
            mathResultArr.push(r);
        });
        let same = 0;
        mathResultArr.forEach((x, i) => {
            if (x === results[i]) {
                same += 1;
            }
        });
        return {
            result: mathResultArr,
            accuracy: same/results.length,
        }
    };
    function generateBaseWeight(len) {
        let arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(1);
        }
        return arr;
    }
    function mathResult(input, weight, threshold) {
        let result = 0;
        input.forEach((x, i) => {
            result += x*weight[i];
        });
        if (result > threshold) {
            return 1;
        } else {
            return -1
        }
    }
    function updateWeight(input, weight, result, real, theta) {
        let delta = theta * (real - result);
        return weight.map((x, i) => {
            return x + delta * input[i]
        });
    }
    function arrayIsSame(arr1, arr2) {
        let result = arr1.findIndex((x, i) => {
            return x !== arr2[i];
        });
        return result === -1;
    }
    window.Perceptron = Perceptron;
})();
