(() => {
    /**
     * 1. 传入 input 与 output
     * 2. 设置隐层数量与每个隐层元素数
     * 3. 初始化权重矩阵与阈值向量，设置学习速率
     * 4. 根据input计算输出
     * 5. 根据输出与阈值的差以及激活函数计算结果
     * 6. 设置逆传播算法，根据逆传播算法更新权重
     * 7. 为了防止过拟合，逆传播算法需要使用正则化来更新
     * 8. 选择累积BP误差更新或标准BP误差更新
     */
    function BPHide1(inputs, outputs, outputNum) {
        this.inputs = inputs;
        this.outputs = outputs;
        this.outputNum = outputNum;
    }

    /**
     * 输入数据  权重 输入层到隐层的输入 隐层的阈值 隐层的输出 隐层到输出层的权重 隐层到输出层的输入 输出层的阈值 输出层的输出
     * x        v    α               γ          b        w                β                θ          y
     * x1       v1   α1              γ1         b1       w1               β1               θ1         y1
     * xi       vi   αh              γh         bh       wh               βj               θj         yj
     * xd       vd   αq              γq         bq       wq               βl               θl         yl
     */
    BPHide1.prototype.init = function (hideNumber, eta) {
        // 分别为输入层、隐层、输出层的元素数量
        this.d = this.inputs[0].length;
        this.q = hideNumber;
        this.l = this.outputNum;

        // 学习速率
        this.eta = eta;

        // 初始化权重矩阵与阈值向量(0,1)
        // 输入层到隐层的权重矩阵 大小为w=d h=q
        let VMat = [];
        for (let i = 0; i < this.q; i++) {
            let arr = [];
            for (let j = 0; j < this.d; j++) {
                arr.push(Math.random());
            }
            VMat.push(arr);
        }
        this.V = new Matrix(VMat);
        // 隐层的阈值
        let gammaMat = [];
        for (let i = 0; i < this.q; i++) {
            gammaMat.push([Math.random()]);
        }
        this.gamma = new Matrix(gammaMat);
        // 隐层到输出层的权重矩阵 大小为w=q h=l
        let WMat = [];
        for (let i = 0; i < this.l; i++) {
            let arr = [];
            for (let j = 0; j < this.q; j++) {
                arr.push(Math.random());
            }
            WMat.push(arr);
        }
        this.W = new Matrix(WMat);
        // 输出层的阈值
        let thetaMat = [];
        for (let i = 0; i < this.l; i++) {
            thetaMat.push([Math.random()]);
        }
        this.theta = new Matrix(thetaMat);
    };
    // 设定激活函数
    BPHide1.prototype.setActivationFunction = function (fn) {
        this.fn = fn;
    };
    // 根据输入计算输出 input为一维数组
    BPHide1.prototype.mathOutput = function (input) {
        let inputMatrix = (new Matrix(input)).transpose();
        let alpha = Matrix.times(this.V, inputMatrix);
        // 隐层的输出
        let b = alpha.mat.map((x, i) => this.fn(x - this.gamma[i][0]));
        b = (new Matrix(b)).transpose();
        let beta = Matrix.times(this.W, b);
        // 输出层的输出
        let y = beta.mat.map((x, i) => this.fn(x - this.theta[i][0]));
        return y;
    };

})();
