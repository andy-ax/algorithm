(() => {
    let width,height;

    function canvasInit() {
        const canvas = document.getElementById('canvas');
        width = canvas.width = document.documentElement.clientWidth;
        height = canvas.height = document.documentElement.clientHeight;
    }

    function initRandomDot() {
        let dotNum = 50;
        let dotMinWidth = 10;
        let dotArr = [];
        for (let i = 0; i < dotNum; i++) {
            dotArr.push(randomDot(dotArr, width, height, dotMinWidth));
        }
        return dotArr;
    }

    function initBoard(dotArr) {
        const dotMatrix = [];
        const indexArr = dotArr.map((item, i) => i);
        dotArr.forEach((item, x) => {
            dotMatrix[x] = [];
            indexArr.forEach(y => {
                if (x === y) {
                    dotMatrix[x][y] = null;
                } else {
                    if (dotMatrix[y] && dotMatrix[y][x]) {
                        dotMatrix[x][y] = {
                            l: dotMatrix[y][x].l,

                        }
                    }
                }
            })
        });
    }

    function randomDot(dotArr, w, h, minWidth) {
        const newDot = [randomDot(w), randomDot(h)];
        let index = -1
        while (index !== -1) {
            index = dotArr.findIndex(item => {
                if (mathDotSpace(item, newDot) < minWidth) return true;
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
})()
