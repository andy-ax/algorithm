(() => {
    let ctx;
    function init() {
        const canvas = document.getElementById('canvas');
        ctx = canvas.getContext('2d');
        canvas.width = document.documentElement.clientWidth;
        canvas.height = document.documentElement.clientHeight;

        const image = new Image();
        image.src = './image/a.png';

        image.onload = onImageLoad;
    }

    function onImageLoad(event) {
        const image = event.path[0];
        const width = image.width;
        const height = image.height;
        ctx.drawImage(image, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixelArr = formatterImageData(imageData.data, width, height);
        const result = kMeansMath(pixelArr);
        const imageDataArr = resetImageArr(result, width, height);
        putImageData(imageDataArr, imageData)
    }

    function formatterImageData(imageData) {
        // 先不考虑alpha的数值
        let pixelArr = [];
        const len = imageData.length/4;
        for(let i = 0; i < len; i++) {
            const r = imageData[i];
            const g = imageData[i+1];
            const b = imageData[i+2];
            const a = imageData[i+3];
            pixelArr.push([r, g, b, a]);
        }
        return pixelArr;
    }
    function kMeansMath(pixelArr) {
        const k = 2;
        const k_means = new KMeans(pixelArr, k);
        return k_means.math(10000, 100, 0.00001);
    }

    function resetImageArr({clusterVector, clusters}, width, height) {
        const imageDataArr = [];
        clusters.forEach((matrix, i) => {
            let [r,g,b,a] = clusterVector[i];
            r = Math.round(r);
            g = Math.round(g);
            b = Math.round(b);
            a = Math.round(a);
            matrix.forEach(x => {
                const index = x.index;
                imageDataArr[index*4] = r;
                imageDataArr[(index*4)+1] = g;
                imageDataArr[(index*4)+2] = b;
                imageDataArr[(index*4)+3] = a;
            });
        });
        return imageDataArr;
    }

    function putImageData(imageDataArr, imageData) {
        let imageDatas = imageData.data;
        imageDataArr.forEach((item, i)=>{
            imageDatas[i] = item;
        });
        ctx.putImageData(imageData, 0, 0);

    }

    window.onload = function () {
        init();
    }
})();
