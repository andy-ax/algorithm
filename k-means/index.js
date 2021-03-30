(() => {
    /**
     * 1.样本集D中随机选取k个样本作为均值向量
     * 2.计算每个样本距离均值向量的距离，根据距离最近的均值向量，来划分该样本属于哪个簇
     * 3.根据划分出的簇，对每个簇中的样本点做计算，算出其中心点作为新的均值向量
     * 4.当均值向量变化较小时或超出最大迭代次数时终止
     * 5.由于k-means并不能保证收敛于最优解，所以往往需要运行多次来找到sse最低的来划分
     * TODO 6.K-means优化
     * TODO 7.K-means++
     * 8.Elbow Method 肘部原则 根据k值从1到设定的值的sse来绘制折线图，找出折线图的拐点作为最优k值划分依据
     */
    /**
     *
     * @param samples {number[][]} 训练集
     * @param k {number} 簇数
     * @constructor
     */
    function KMeans(samples, k) {
        this.samples = samples;
        this.k = k;
    }

    /**
     *
     * @param max {number} 训练次数限制
     * @param minDistance {number} 可容许的均值向量差值
     */
    KMeans.prototype.fit = function (max, minDistance) {
        let clusterVector = random(this.samples, this.k);
        let convergence = false;
        let clusters;
        let i = 0;
        while (!convergence) {
            clusters = [];
            // 计算每个样本距离均值向量的距离，根据距离最近的均值向量，来划分该样本属于哪个簇
            this.samples.forEach((vector, i) => {
                let min = Infinity;
                let minIndex = -1;
                clusterVector.forEach((cluster, j) => {
                    const distance = mathVectorDistance(vector, cluster);
                    if (distance < min) {
                        min = distance;
                        minIndex = j;
                    }
                });
                if (clusters[minIndex]) {
                    clusters[minIndex].push({
                        vector,
                        index: i,
                    });
                } else {
                    clusters[minIndex] = [{
                        vector,
                        index: i,
                    }];
                }
            });
            /**
             * clusters=>[cluster=>[vector, vector]]
             */
            // 根据划分出的簇，对每个簇中的样本点做计算，算出其中心点作为新的均值向量
            let newClustersVector = [];
            clusters.forEach((matrix, index) => {
                let newCluster = [];
                matrix.forEach(data => {
                    const vector = data.vector;
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
            // 当均值向量变化较小时或超出最大迭代次数时终止
            const con = isConvergence(newClustersVector, clusterVector, minDistance);
            if (i >= max || con) {
                convergence = true;
            }
            clusterVector = newClustersVector;
        }
        let sse = this.sse(clusterVector, clusters);
        return {
            clusterVector,
            clusters,
            sse,
            index: i,
        };
    };
    // 由于k-means并不能保证收敛于最优解，所以往往需要运行多次来找到sse最低的来划分
    KMeans.prototype.math = function (max, eachTwice, minDistance) {
        let min = Infinity;
        let minIndex = -1;
        let minResult;
        for (let i = 0; i < eachTwice; i++) {
            let result = this.fit(max, minDistance);
            if (result.sse < min) {
                min = result.sse;
                minIndex = i;
                minResult = result;
            }
        }
        return minResult;
    };
    KMeans.prototype.sse = function (clusterVectors, clusters) {
        // 每个点到所属均值向量的误差平方和
        let total = 0;
        clusters.forEach((matrix, i) => {
            let clusterVector = clusterVectors[i];
            matrix.forEach(cluster => {
                const vector = cluster.vector;
                let space = mathVectorDistance(clusterVector, vector);
                total += Math.pow(space, 2);
            })
        });
        return total;
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
    };

    window.KMeans = KMeans;
})();
