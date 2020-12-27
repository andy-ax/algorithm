(() => {
    let width,height;

    function TSP(canvasId) {
        const canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = document.documentElement.clientWidth;
        this.height = canvas.height = document.documentElement.clientHeight;
    }

    TSP.prototype.initRandomDot = function(dotNum) {
        let dotMinWidth = 20;
        let dotMaxWidth = 200;
        let dotArr = [];
        for (let i = 0; i < dotNum; i++) {
            dotArr.push(randomDot(dotArr, this.width, this.height, dotMinWidth, dotMaxWidth));
        }
        this.dotArr = dotArr;
        return dotArr;
    };

    TSP.prototype.initBoard = function() {
        const dotArr = this.dotArr;
        const dotMatrix = [];
        const indexArr = dotArr.map((item, i) => i);
        dotArr.forEach((item, x) => {
            dotMatrix[x] = [];
            indexArr.forEach(y => {
                if (x === y) {
                    dotMatrix[x][y] = null;
                } else {
                    if (dotMatrix[y] && dotMatrix[y][x]) {
                        dotMatrix[x][y] = dotMatrix[y][x]
                    } else {
                        dotMatrix[x][y] = mathDotSpace(dotArr[x], dotArr[y]);
                    }
                }
            })
        });
        this.dotMatrix = dotMatrix;
        return dotMatrix;
    };

    TSP.prototype.drawTspResult = function(resultList) {
        const dotArr = this.dotArr;
        const ctx = this.ctx;
        const radius = 5;
        dotArr.forEach(([x, y]) => {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
        });
        const beginIndex = 0;
        const beginPosition = dotArr[beginIndex];
        ctx.beginPath();
        ctx.moveTo(...beginPosition);
        resultList.forEach(endIndex => {
            ctx.lineTo(...dotArr[endIndex]);
        });
        ctx.closePath();
        ctx.stroke();
    };

    function randomDot(dotArr, w, h, minWidth, maxWidth) {
        const newDot = [randomNum(w), randomNum(h)];
        let index = -1;
        while (index !== -1) {
            index = dotArr.findIndex(item => {
                const width = mathDotSpace(item, newDot);
                if (width < minWidth) return true;
            })
        }
        return newDot;
    }
    function randomNum(num) {
        return Math.round(Math.random() * num);
    }
    function mathDotSpace(dot1, dot2) {
        return Math.pow(
            Math.pow(
                (dot1[0] - dot2[0])
            , 2)
            +
            Math.pow(
                (dot1[1] - dot2[1])
            , 2)
        , 0.5)
    }

    window.TSP = TSP;
})();
