(() => {
    function KMeansCanvas(canvasId) {
        const canvas = document.getElementById(canvasId);
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width = 400;
        this.height = canvas.height = 400;
    }
    KMeansCanvas.prototype.initKMeans = function () {
        // 初始化数据
        const baseDots = [
            [0.9, 0.85],
            [1.74, 2.3],
            [3.5, 1.45],
            [2.35, 2.2],
            [2.1, 3.61],
            [7.1, 0.65],
            [6.2, 2.21],
            [6.6, 3.12],
            [4.8, 2.31],
            [4.61, 1.4],
            [5.2, 5.6],
            [3.2, 4.4],
            [3.4, 3.6],
            [5.3, 6.6],
            [2.4, 4.6],
            [5.6, 3.2],
            [2.4, 6.5],
            [4.5, 6.7]
        ];

        const k = 3;
        this.k_means = new KMeans(baseDots, k);
        this.result = this.k_means.math(10000, 10, 0.001);
        console.log(this.result);
    };
    KMeansCanvas.prototype.drawDots = function () {
        // 根据簇 绘制点
        const colors = ['#e61f18','#16de55','#2c25ec','#cc3','#cc33c3','#3cc'];
        let clusterVector = this.result.clusterVector;
        let clusters = this.result.clusters;
        let size = 8;
        let base = 50;
        clusterVector.forEach((item, i) => {
            drawRectDot(colors[i], item[0]*base, item[1]*base, size, this.ctx);
        });
        clusters.forEach((item, i) => {
            let color = colors[i];
            item.forEach(ite => {
                drawArcDot(color, ite[0]*base, ite[1]*base, size/2, this.ctx);
            })
        })
    };
    function drawRectDot(color, x, y, size, ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(x - (size / 2), y - (size / 2), size, size);
    }
    function drawArcDot(color, x, y, radius, ctx) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    window.KMeansCanvas = KMeansCanvas;
})();
