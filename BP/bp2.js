(()=>{
    function BP2(inputs, outputs, typeNumber, hideNumber) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.inputNum = inputs[0].length;
        this.outputNum = typeNumber;
        this.hideNum = hideNumber;
    }
    // 激励函数
    BP2.prototype.fn = function(x) {
        // return x/10000;
        return (1/(1+Math.pow(Math.E, -x)));
    };
    // 激励函数的导数
    BP2.prototype.dfn = function(result) {
        return result * (1 - result);
    };
    /**
     *  [v11, vi1, vd1, γ1]
     *  [v1h, vih, vdh, γh]
     *  [v1q, viq, vdq, γq]
     */
    BP2.prototype.init = function () {
        // 分别为输入层、隐层、输出层的元素数量
        this.d = this.inputNum;
        this.q = this.hideNum;
        this.l = this.outputNum;

        // 初始化权重矩阵与阈值向量(0,1)
        // 输入层到隐层的权重矩阵 大小为w=d h=q
        let V = [];
        for (let h = 0; h < this.q; h++) {
            let arr = [];
            for (let i = 0; i < this.d + 1; i++) {
                arr.push(1);
            }
            V.push(arr);
        }
        this.V = new Matrix(V);

        let W = [];
        for (let j = 0; j < this.l; j++) {
            let arr = [];
            for (let h = 0; h < this.q + 1; h++) {
                arr.push(1);
            }
            W.push(arr);
        }
        this.W = new Matrix(W);
    };
    BP2.prototype.math = function (input) {
        input.forEach((x, i) => {
            input[i] /= 25226.16;
        });
        // 添加阈值
        input.push(-1);
        let inputM = new Matrix(input);
        // 隐层的计算值
        let netb = Matrix.times(this.V, inputM);
        // 隐层的输出
        let outb = netb.mat.map((x, h) => {
            let value = this.fn(x[0]);
            return value;
        });
        // 添加阈值
        outb.push(-1);
        outb = new Matrix(outb);
        // 输出层的计算值
        let nety = Matrix.times(this.W, outb);
        // 输出层的输出
        let outy = nety.mat.map((x, j) => {
            return this.fn(x[0]);
        });

        this.netb = netb;
        this.outb = outb;
        this.nety = nety;
        this.outy = outy;
    };
    BP2.prototype.update = function (input, output, eta) {
        let target = [];
        for (let j = 0; j < this.l; j++) {
            if (output === j) {
                target.push(0.99);
            } else {
                target.push(0.01);
            }
        }
        const d = this.d;
        const q = this.q;
        const l = this.l;
        const netb = this.netb.mat;
        const outb = this.outb.mat;
        const nety = this.nety.mat;
        const outy = this.outy;
        const V = this.V;
        const W = this.W;
        const WM = W.mat;
        const x = input;
        const g = (j) => {
            return -1 * (target[j] - outy[j]) * this.dfn(outy[j]);
        };
        const changeW = (h, j) => {
            return g(j) * outb[h];
        };
        const changeV = (i, h) => {
            let total = 0;
            for (let j = 0; j < l; j++) {
                total += g(j) * WM[j][h];
            }
            return total * this.dfn(outb[h]) * x[i];
        };
        W.mat.forEach((arr, j) => {
            for (let h = 0; h < q; h++) {
                const item = arr[h];
                arr[h] = item - eta * changeW(h, j);
            }
        });
        V.mat.forEach((arr, h) => {
            for (let i = 0; i < d; i++) {
                const item = arr[i];
                arr[i] = item - eta * changeV(i, h);
            }
        });
    };
    BP2.prototype.fit = function (minMSE, eta) {
        return this.inputs.some((item, index) => {
            const input = item;
            const output = this.outputs[index];
            this.math(input);
            const mse = this.MSE(this.outy, output);
            // 当均方误差小于设定的值时停止并表示训练完成
            console.log(mse);
            if (mse <= minMSE) {
                return true;
            } else {
                this.update(input, output, eta);
                console.log(this);
            }
            // this.updateWeight2(this.y, input, output);
        })
    };
    /**
     * @return {number}
     */
    BP2.prototype.MSE = function (y, output) {
        let MSE = 0;
        let outputArr = [];
        for (let i = 0; i < this.outputNum; i++) {
            if (i === output) {
                outputArr.push(0.99);
            } else {
                outputArr.push(0.01);
            }
        }
        y.forEach((item, j) => {
            MSE += Math.pow(item - outputArr[j], 2);
        });
        return MSE;
    };
    window.BP2 = BP2;
})();
