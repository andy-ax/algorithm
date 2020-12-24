(()=>{
    const nodeArr = ['A', 'B', 'C', 'D'];
    const nodeMatrix = [
        [null, 1, 15, 4],
        [1, null, 4, 8],
        [15, 4, null, 5],
        [4, 8, 5, null]
    ];
    function AntSystem(nodeArr, nodeMatrix) {
        this.nodeArr = nodeArr;
        this.nodeMatrix = nodeMatrix;
    }
    AntSystem.prototype.init = function() {
        this.graph = new Graph();
        this.nodeMatrix.forEach(item => {
            item.forEach((ite, i) => {
                // l: 距离
                // w: 信息素
                const l = ite;
                if (l !== null) {
                    const w = 1;
                    item[i] = {
                        l, w
                    }
                }
            })
        });
        this.graph.setNode(this.nodeArr, this.nodeMatrix);

        const ant = [];
        this.nodeArr.forEach(x => {
            ant.push({
                road: [x],
            });
        });
        this.ant = ant;
    };

    AntSystem.prototype.math = function() {
        // 计算最大迭代次数
        const antLen = this.ant.length;
        const nodeLen = this.nodeArr.length;
        const n = nodeLen - 1;
        const lineNum = (n*n + n) / 2; // 路径的数量
        const maxNum = lineNum*lineNum; // 最大迭代次数
        let i = 0;

        let result;

        for (; i < maxNum; i++) {
            for (let j = 0; j < n; j++) {
                for (let k = 0; k < antLen; k++) {
                    const nowAnt = this.ant[k];
                    this.antChoice(nowAnt);
                }
            }
            this.systemUpdate();
            // 收敛判断
            result = this.isConvergence();
            if (result.success){
                break;
            }
        }
        return result;
    };

    AntSystem.prototype.antChoice = function(ant) {
        const antRoad = ant.road;
        const antNowNode = antRoad[antRoad.length - 1];
        // 获取接下来可选的行走路径
        let roadList = this.nodeArr.filter(x=>antRoad.indexOf(x) === -1);
        if (roadList.length === 1) {
            antRoad.push(roadList[0]);
            return;
        }
        if (roadList.length === 0) {
            throw new Error('获取路径列表错误')
        }
        // 获取可行走路径的权重
        let weightList = [];
        roadList.forEach(x => {
            const obj = this.graph.getValue(antNowNode, x);
            weightList.push(obj.w);
        });
        // 获取权重总和，以及根据根据修改后的权重以及随机数来判断走哪条路
        let total = 0;
        weightList.forEach((x, i) => {
            total += x;
            weightList[i] = total;
        });
        const random = Math.random() * total;
        // 根据随机数计算下一步走哪
        const weightIndex = weightList.findIndex(x => random < x);
        if (weightIndex === -1) {
            throw new Error('权重计算错误');
        } else {
            antRoad.push(roadList[weightIndex]);
        }

    };
    AntSystem.prototype.systemUpdate = function() {

        // 信息发挥率
        const theta = 0.5;

        // 根据每个蚂蚁的行走路径计算总行走距离 l
        const totalWalkList = this.ant.map(x => {
            let road = x.road;
            road.push(road[0]);
            let len = 0;
            for (let i = 1; i < road.length; i++) {
                const obj = this.graph.getValue(road[i-1], road[i]);
                len += obj.l;
            }
            return len;
        });

        // 根据距离为每条路径重新计算权重
        this.ant.forEach((x, i) => {
            const road = x.road;
            // 计算当前蚂蚁产生的信息素
            const thisAntWalkLen = totalWalkList[i];
            const pheromone = 1/thisAntWalkLen;
            for (let i = 1; i < road.length; i++) {
                const obj = this.graph.getValue(road[i-1], road[i]);
                obj.w += pheromone;
            }
        });

        // 根据挥发率重新计算权重
        this.graph.each(item => {
            item.w *= theta;
        });

        // 重置当前蚁群的路径
        this.ant.forEach(item => {
            item.road.length = 1;
        })

    };
    AntSystem.prototype.isConvergence = function() {
        // 如果某条路径的信息素占比信息素总和一定概率则判断收敛
        let pheromoneTotal = 0;
        // 计算信息素总和
        this.graph.each(item => {
            const weight = item.w;
            pheromoneTotal += weight;
        });

        // 从第一个点开始选择，走信息素最高的道路然后计算该道路的信息素总和
        let roadPheromone = 0;
        let road = [];
        let arr = this.graph.getXArr(0);
        while (road.length < this.nodeArr.length) {
            let max = 0;
            let maxIndex = -1;
            arr.forEach((item,i) => {
                if (item === null) return;
                if (road.indexOf(i) === -1) {
                    if (item.w > max) {
                        max = item.w;
                        maxIndex = i;
                    }
                }
            });
            road.push(maxIndex);
            arr = this.graph.getXArr(maxIndex);
            roadPheromone += max;
        }

        // 当选择的路径信息素占比超过一定值时就算收敛
        const proportion = 0.7;
        const result = roadPheromone / pheromoneTotal;
        return {
            result,
            road,
            success: result > proportion
        }
    };

    let antSystem = new AntSystem(nodeArr, nodeMatrix);
    antSystem.init();
    const result = antSystem.math();

})();
