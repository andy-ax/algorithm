/**
 * Created by andy on 2017/8/23.
 */
(function (windows) {
    //matrix
    //[b_1
    // b_2
    // b_3]
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
            var mat = this.copy();
            if (!mat[0].length || mat[0].length <= 1) {
                return mat;
            } else {
                //主元
                var RowLen = mat.length;
                var RowIndex = 0,
                    i,
                    arr;
                for (i = 0; i < RowLen; i++) {
                    arr = reSimStep1(RowIndex,i,mat);
                    RowIndex = arr[0];
                    mat = arr[1]
                }
                reSimStep2(mat);
                return mat;
            }
        };
        //主元行化简&行置换
        var reSimStep1 = function (RowIndex, ColIndex, mat) {
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
        var reSimStep2 = function (mat) {
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
        var n;
        Matrix.prototype.determinant = function () {
            if (this.w !== this.h) return false;
            var mat = this.copy();
            n = this.w;
            //指示物,作为最终行列式的乘积
            var indicator = 1;
            var i;

            for (i = 0; i < n; i++) {
                indicator = reSim(mat,i,indicator);
                if (indicator === false) {
                    return 0;
                }

            }
            return indicator;
        };
        var reSim = function (mat, index, indicator) {
            var lineMove = false;
            var rowLen = n;
            var pivot;
            var i,arr;
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
            var i,len,mat;
            if (arguments.length === 1 && arguments[0] instanceof Array === true && arguments[0].length >= 2) {
                var matArr = arguments[0];
                len = matArr.length;

                for (i = 0; i < len; i++) {
                    if (matArr[i] instanceof Matrix === false) {
                        return false;
                    }
                }

                //判定
                for (i = 1; i < len; i++) {
                    if (matArr[i-1].w !== matArr[i].h) {
                        return false;
                    }
                }

                //计算
                mat = matArr[0].mat;
                for (i = 1; i < len; i++) {
                    mat = times(mat,matArr[i].mat);
                }

                return mat;
            }
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

                return mat;
            }

            return false;
        };
        function times(mat1, mat2) {
            var len = mat2[0].length;
            var arr = [];
            var i;
            for (i = 0; i < len; i++) {
                arr[i] = vectorTimes(mat1,matrix2verctor(mat2,i));
            }
            return transpose(arr);
        }
        function vectorTimes(matrix, vector) {
            var len = vector.length,
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
        function matrix2verctor(matrix, index) {
            var arr = [],
                len = matrix.length,
                i;

            for (i = 0; i < len; i++) {
                arr[i] = matrix[i][index];
            }

            return arr;
        }
    })();
    //矩阵对象的复制
    Matrix.prototype.copy = function () {
        var mat = this.mat,
            arr = [],
            i,j;

        for (i = 0; i < this.h; i++) {
            arr[i] = [];
            for (j = 0; j < this.w; j++) {
                arr[i][j] = mat[i][j];
            }
        }

        return arr;
    };
    //矩阵转置
    Matrix.prototype.transpose = function () {
        return transpose(this.mat);
    };
    //求逆矩阵
    Matrix.prototype.inverse = function () {
        if (this.w !== this.h) return false;
        return Matrix.split(
            new Matrix(
                new Matrix(
                    Matrix.merge(
                        this,
                        Matrix.generateIdentityMatrix(this.w)
                    )
                ).lineSim()
            )
            ,0,this.w);
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
        var matrix = [],
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

    //矩阵水平合并
    Matrix.merge = function (matrix1, matrix2) {
        if (matrix1.h !== matrix2.h) {
            return false;
        }
        var len = matrix1.h,
            mat1 = matrix1.mat,
            mat2 = matrix2.mat;

        var arr = [],
            i;
        for (i = 0; i < len; i++) {
            arr[i] = mat1[i].concat(mat2[i]);
        }
        return arr;
    };
    //矩阵垂直合并
    Matrix.mergeV = function (mat1, mat2) {
        if (mat1[0].length !== mat2[0].length) {
            return false;
        }
        return mat1.concat(mat2);
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
        var matrix = [],
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
    }
})(typeof window === 'undefined' ? global : window);
