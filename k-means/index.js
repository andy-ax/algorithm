(() => {
    /**
     * TODO 1.样本集D中随机选取k个样本作为均值向量
     * TODO 2.计算每个样本距离均值向量的距离，根据距离最近的均值向量，来划分该样本属于哪个簇
     * TODO 3.根据划分出的簇，对每个簇中的样本点做计算，算出其中心点作为新的均值向量
     * TODO 4.当均值向量变化较小时或超出最大迭代次数时终止
     * TODO 5.K-means++
     * TODO 6.Elbow Method
     */
    function KMeans(samples, k) {
        this.samples = samples;
        this.k = k;
    }
    KMeans.prototype.fit = function (max, minDistance) {
        let clusterVector = random(this.samples, this.k);
        let convergence = false;
        let i = 0;
        while (!convergence) {
            let clusters = [];
            this.samples.forEach(vector => {
                let min = Infinity;
                let minIndex = -1;
                clusterVector.forEach((cluster, i) => {
                    const distance = mathVectorDistance(vector, cluster);
                    if (distance < min) {
                        min = distance;
                        minIndex = i;
                    }
                });
                if (clusters[minIndex]) {
                    clusters[minIndex].push(vector);
                } else {
                    clusters[minIndex] = [vector];
                }
            });
            /**
             * clusters=>[cluster=>[vector, vector]]
             */
            let newClustersVector = [];
            clusters.forEach((matrix, index) => {
                let newCluster = [];
                matrix.forEach(vector => {
                    vector.forEach((x, i) => {
                        if (newCluster[i]) {
                            newCluster[i] += x;
                        } else {
                            newCluster[i] = x;
                        }
                    })
                });
                let len = matrix.length;
                newCluster = newCluster.map(x => x/len);
                newClustersVector[index] = newCluster;
            });
            i += 1;
            const con = isConvergence(newClustersVector, clusterVector, minDistance);
            if (i >= max || con) {
                convergence = true;
            }
            clusterVector = newClustersVector;
        }
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
        if (position1.length !== position2.length) return;
        let result = 0;
        for (let i = 0; i < position1.length; i++) {
            result += Math.pow(position2[i] - position1[i], 2);
        }
        return Math.pow(result, 0.5);
    };
    // 判断收敛
    const isConvergence = function(beforeVecArr, afterVecArr, minDistance) {
        let totalDistance = 0;
        beforeVecArr.forEach((beforeVec, i) => {
            const afterVec = afterVecArr[i];
            totalDistance += mathVectorDistance(beforeVec, afterVec);
        });
        return minDistance > totalDistance;
    }
})();
