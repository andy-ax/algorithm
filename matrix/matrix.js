/**
 * Created by andy on 2017/8/23.
 */
(function (windows) {
    /**
     * @return {boolean}
     */
    windows.Matrix = function (mat) {
        var w,h,i,j;
        if (mat[0] && mat[0].length !== undefined) {
            w = mat[0].length;
            h = mat.length;
            for (i = 0; i < h; i++) {
                if (!mat[i] || !(mat[i] instanceof Array)) {
                    return false
                } else {
                    for (j = 0; j < w; j++) {
                        if (mat[i][j] === undefined || typeof mat[i][j] !== 'number') {
                            return false;
                        }
                    }
                }
            }

            this.w = w;
            this.h = h;
            this.mat = mat;
        } else if (mat.length !== undefined) {
            w = 1;
            h = mat.length;
            var matrix = [];

            for (i = 0; i < h; i++) {
                if (mat[i] === undefined || typeof mat[i] !== 'number') {
                    return false;
                } else {
                    matrix[i] = [mat[i]];
                }
            }

            this.w = w;
            this.h = h;
            this.mat = matrix;
        } else {
            return false;
        }
    };
    //行化简
    (function () {
        Matrix.prototype.lineSim = function () {
            //在列数≤1的情况下直接返回原矩阵
            const matrix = this.copy();
            let mat = matrix.mat;
            if (!mat[0].length || mat[0].length <= 1) {
                return mat;
            } else {
                //主元
                const RowLen = mat.length;
                let RowIndex = 0,
                    i,
                    arr;
                for (i = 0; i < RowLen; i++) {
                    arr = reSimStep1(RowIndex,i,mat);
                    RowIndex = arr[0];
                    mat = arr[1]
                }
                reSimStep2(mat);
                return new Matrix(mat);
            }
        };
        //主元行化简&行置换
        const reSimStep1 = function (RowIndex, ColIndex, mat) {
            var RowLen = mat.length;
            var pivot;
            var lineMove = false;
            for (var i = RowIndex; i < RowLen; i++) {
                var arr = mat[i];
                if (arr[ColIndex] === 0) {
                    //将主元为0的行抽离到最底下
                    moveElement(mat,i);
                    i--;
                    RowLen--;
                } else {
                    lineMove = true;

                    //行化简并设置主元
                    mat[i] = pivotSim(arr,ColIndex);
                    if (pivot) {
                        mat[i] = minusPivot(pivot,arr);
                    } else {
                        pivot = mat[i];
                    }
                }
            }
            //终结判断 & index位移
            if (lineMove) RowIndex++;
            return [RowIndex,mat];
        };
        //非主元消去
        const reSimStep2 = function (mat) {
            var RowLen = mat.length;
            var i,j;
            for (i = 1; i < RowLen; i++) {
                for (j = i-1; j >= 0; j--) {
                    minusPivot(mat[i],mat[j]);
                }
            }
        };
    })();
    //求行列式
    (function () {
        let n;
        Matrix.prototype.determinant = function () {
            if (this.w !== this.h) return false;
            const matrix = this.copy();
            let mat = matrix.mat;
            n = this.w;
            //指示物,作为最终行列式的乘积
            let indicator = 1;
            let i;

            for (i = 0; i < n; i++) {
                indicator = reSim(mat,i,indicator);
                if (indicator === false) {
                    return 0;
                }

            }
            return indicator;
        };
        const reSim = function (mat, index, indicator) {
            let lineMove = false;
            let rowLen = n;
            let pivot;
            let i,arr;
            for (i = index; i < rowLen; i++) {
                arr = mat[i];
                if (arr[index] === 0) {
                    if (i !== (n-1)) {
                        moveElement(mat,i);
                        i--;
                        rowLen--;
                        indicator*=-1
                    }
                } else {
                    lineMove = true;

                    indicator*=arr[index];

                    mat[i] = pivotSim(arr,index);
                    if(pivot) {
                        mat[i] = minusPivot(pivot,arr);
                    } else {
                        pivot = mat[i];
                    }
                }
            }
            if (!lineMove){
                return false;
            } else {
                return indicator;
            }
        }
    })();
    //矩阵乘积
    (function () {
        Matrix.times = function () {
            //参数设定
            if (!arguments[0]) {
                return false
            }
            let i,len,mat;
            if (arguments.length > 1) {
                len = arguments.length;

                for (i = 0; i < len; i++) {
                    if (arguments[i] instanceof  Matrix === false) {
                        return false;
                    }
                }

                //判定
                for (i = 1; i < len; i++) {
                    if (arguments[i-1].w !== arguments[i].h) {
                        return false;
                    }
                }

                //计算
                mat = arguments[0].mat;
                for (i = 1; i < len; i++) {
                    mat = times(mat,arguments[i].mat);
                }

                return new Matrix(mat);
            }

            return false;
        };
        function times(mat1, mat2) {
            const len = mat2[0].length;
            let arr = [];
            let i;
            for (i = 0; i < len; i++) {
                arr[i] = matrixTimesVector(mat1,getMatrix2VectorByIndex(mat2,i));
            }
            return transpose(arr);
        }
        // 矩阵乘向量
        function matrixTimesVector(matrix, vector) {
            let len = vector.length,
                h = matrix.length,
                arr = [],
                i,j;

            for (i = 0; i < h; i++) {
                arr[i] = 0;
                for (j = 0; j < len; j++) {
                    arr[i] += vector[j]*matrix[i][j];
                }
            }
            return arr;
        }
        // 根据index,从矩阵中的指定index提取向量
        function getMatrix2VectorByIndex(matrix, index) {
            return matrix.map(arr=>arr[index]);
        }
    })();
    //矩阵对象的复制
    Matrix.prototype.copy = function () {
        let mat = this.mat,
            arr = [],
            i,j;

        for (i = 0; i < this.h; i++) {
            arr[i] = [];
            for (j = 0; j < this.w; j++) {
                arr[i][j] = mat[i][j];
            }
        }

        return new Matrix(arr);
    };
    //矩阵转置
    Matrix.prototype.transpose = function () {
        return new Matrix(transpose(this.mat));
    };
    //求逆矩阵 由于js的特性，故而无法精准计算出是否为可逆矩阵
    Matrix.prototype.inverse = function () {
        if (this.w !== this.h) return false;
        const result = Matrix.split(
            Matrix.merge(
                this,
                Matrix.generateIdentityMatrix(this.w)
            ).lineSim()
            ,0,this.w);

        const split = new Matrix(result.split);
        const other = new Matrix(result.other);

        if (!Matrix.isIdentityMatrix(split)) return false;
        const timeResult = Matrix.times(this, other).mat;

        let identTotal = 0;
        let otherTotal = 0;
        timeResult.forEach((arr, i) => {
            arr.forEach((item, j) => {
                if (i === j) {
                    identTotal += item;
                } else {
                    otherTotal += item;
                }
            })
        });
        identTotal = Math.round(identTotal*1000)/1000;
        otherTotal = Math.round(otherTotal*1000)/1000;
        if (identTotal === this.w && otherTotal === 0) {
            return other;
        } else {
            return false;
        }
    };

    //将数组内指定位置的元素移动到另一位置
    function moveElement(arr,start,end) {
        end = end || arr.length-1;
        var item = arr[start];
        if (start === end) return arr;

        var a = end > start ? start : end;
        var b = a === end ? start : end;
        var type = end >= start ? 'left' : 'right';
        var i;

        if (type === 'left') {
            for (i = a; i < b; i++) {
                arr[i] = arr[i+1];
            }
            arr[b] = item;
        } else {
            for (i = b; i > a; i--) {
                arr[i] = arr[i-1];
            }
            arr[a] = item;
        }

        return arr;
    }
    //倍加
    function minusPivot(pivot, arr) {
        var index = false;
        var i;
        for (i = 0; i < pivot.length; i++){
            if (pivot[i] !== 0){
                index = i;
                break;
            }
        }
        if (index !== false) {
            var  item = arr[index];
            for (i = index; i < arr.length; i++){
                arr[i] = arr[i] - item*pivot[i];
            }
        }

        return arr;
    }
    //主元化简
    function pivotSim(arr,index) {
        var item = arr[index];
        var i;
        for (i = index; i < arr.length; i++){
            arr[i] = arr[i]/item;
        }
        return arr;
    }
    //转置
    function transpose(mat) {
        let matrix = [],
            h = mat.length,
            w = mat[0].length,
            i,j;
        for (i = 0; i < w; i++) {
            matrix[i] = [];
            for (j = 0; j < h; j++) {
                matrix[i][j] = mat[j][i];
            }
        }

        return matrix;
    }


    // 判断是否为单位矩阵
    Matrix.isIdentityMatrix = function(matrix) {
        if (matrix.w !== matrix.h) return false;
        const mat = matrix.mat;
        const result = mat.findIndex((arr, i) => {
            const result = arr.findIndex((item, j) => {
                if (i === j) {
                    if (item !== 1) {
                        return true;
                    }
                } else {
                    if (item !== 0) {
                        return true;
                    }
                }
            });
            return result !== -1;
        });
        return result === -1;
    };
    //矩阵水平合并
    Matrix.merge = function (matrix1, matrix2) {
        if (matrix1.h !== matrix2.h) {
            return false;
        }
        let len = matrix1.h,
            mat1 = matrix1.mat,
            mat2 = matrix2.mat;

        let arr = [],
            i;
        for (i = 0; i < len; i++) {
            arr[i] = mat1[i].concat(mat2[i]);
        }
        return new Matrix(arr);
    };
    //矩阵垂直合并
    Matrix.mergeV = function (matrix1, matrix2) {
        let mat1 = matrix1.mat;
        let mat2 = matrix2.mat;
        if (mat1.w !== mat2.w) {
            return false;
        }
        return new Matrix(mat1.concat(mat2));
    };
    Matrix.alert = function (matrix) {
        var str = '';
        var h = matrix.h,
            w = matrix.w,
            mat = matrix.mat,
            i,j;
        for (i = 0; i < h; i++) {
            for (j = 0; j < w; j++) {
                str += mat[i][j];
                str += ' ';
            }
            str += '\n';
        }
        console.log(str);
    };
    //生成单位矩阵
    Matrix.generateIdentityMatrix = function (n) {
        let matrix = [],
            i,j;
        for (i = 0; i < n; i++) {
            matrix[i] = [];
            for (j = 0; j < n; j++) {
                if (j === i) {
                    matrix[i][j] = 1;
                } else {
                    matrix[i][j] = 0;
                }
            }
        }
        return new Matrix(matrix);
    };
    //矩阵水平分解
    Matrix.split = function (matrix, start, end) {
        if (end < start || start < 0 || typeof start !== 'number' || typeof end !== 'number') return false;
        var w = matrix.w,h = matrix.h;
        var mat1 = [],
            mat2 = [],
            i,j,
            item,
            arr1, arr2;
        for (i = 0; i < h; i++) {
            arr1 = [];
            arr2 = [];
            for (j = 0; j < w; j++) {
                item = matrix.mat[i][j];
                if (j >= start && j < end) {
                    arr1.push(item);
                } else {
                    arr2.push(item);
                }
            }
            mat1[i] = arr1;
            mat2[i] = arr2;
        }

        return {
            split: mat1,
            other: mat2
        }
    };
    //生成数组 例子: '0:1:3' => [0,1,2,3]
    Matrix.generateArr = function (gen) {
        const args = gen.split(':');
        let start,end,space;
        if (args.length === 2) {
            [start, end] = args;
            space = end > start ? 1 : -1;
        } else if (args.length === 3) {
            [start, space, end] = args;
        } else {
            return;
        }
        start = parseFloat(start);
        end = parseFloat(end);
        switch (space) {
            case 'pi':
                space = Math.PI;
                break;

            case 'e':
                space = Math.E;
                break;

            default:
                space = parseFloat(space);
                break;
        }
        let arr = [];
        if (space === 0) {
            return;
        } else if (space > 0) {
            if (start > end) return;
            let num = start;
            while (num < end) {
                arr.push(num);
                num+=space;
            }
            arr.push(end);
        } else {
            if (start < end) return;
            let num = start;
            while (num > end) {
                arr.push(num);
                num+=space;
            }
            arr.push(end);
        }
        return arr;
    };

})(typeof window === 'undefined' ? global : window);
