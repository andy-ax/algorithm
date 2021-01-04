(() => {
    /**
     * TODO 1.样本集D中随机选取k个样本作为均值向量
     * TODO 2.计算每个样本距离均值向量的距离，根据距离最近的均值向量，来划分该样本属于哪个簇
     * TODO 3.根据划分出的簇，对每个簇中的样本点做计算，算出其中心点作为新的均值向量
     * TODO 4.当均值向量变化较小时或超出最大迭代次数时终止
     */
    function KMeans(samples, k) {
        this.samples = samples;
        this.k = k;
    }
    KMeans.prototype.fit = function () {
        let clusterVector = random(this.samples, this.k);

    };
    KMeans.prototype.math = function () {

    };
    // 从样本集中随机选取k个样本作为均值向量
    const random = function (samples, k) {
        let arr = [];
        let arrIndex = [];
        const len = samples.length;
        for (let i = 0; i < k; i++) {
            let index = -1;
            let end = false;
            while (!end) {
                index = Math.round(Math.random()*(len-1));
                if (arrIndex.indexOf(index) === -1) end = true;
            }
            arr.push(samples[index]);
            arrIndex.push(index);
        }
        return arr;
    };
    // 计算2个多维向量间的距离
    const mathVectorDistance = function (position1, position2) {

    }
})();
