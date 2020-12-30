(()=>{
    function LeastSquares() {

    }
    LeastSquares.prototype.setMathFunc = function (mathFuncArray) {
        this.mathFuncArray = mathFuncArray;
    };
    LeastSquares.prototype.setDots = function (xArr, yArr, zArr) {
        this.xArr = xArr.map(x=>[x]);
        this.yArr = yArr.map(y=>[y]);
        if (zArr) {
            this.zArr = zArr.map(z=>[z]);
        }
    };
    LeastSquares.prototype.math = function () {
        let A = this.mathAMatrix();
        A = new Matrix(A);
        const AT = new Matrix(A.transpose());

        let yVector = this.zArr || this.yArr;
        yVector = new Matrix(yVector);

        let R1Matrix = Matrix.times(AT,A);
        let r2Vector = Matrix.times(AT,yVector);
        let Result = Matrix.merge(new Matrix(R1Matrix),new Matrix(r2Vector));
        Result = (new Matrix(Result)).lineSim();
        const ResultT = (new Matrix(Result)).transpose();
        return ResultT[ResultT.length - 1];
    };
    LeastSquares.prototype.mathAMatrix = function() {
        let A = [];
        const yArr = this.yArr;
        this.xArr.forEach(([x], i)=>{
            const y = yArr[i][0];
            let arr = [];
            this.mathFuncArray.forEach(fn => {
                arr.push(fn(x, y));
            });
            A.push(arr);
        });
        return A;
    };

    window.LeastSquares = LeastSquares;
})();
