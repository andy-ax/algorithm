(()=>{
    const graph = new Graph();
    const nodeArr = ['A', 'B', 'C', 'D'];
    const nodeMatrix = [
        [null, 1, 15, 4],
        [1, null, 4, 8],
        [15, 4, null, 5],
        [4, 8, 5, null]
    ];
    nodeMatrix.forEach(item => {
        item.forEach((ite, i) => {
            const l = ite;
            if (l !== null) {
                const w = 1;
                item[i] = {
                    l, w
                }
            }
        })
    });
    graph.setNode(nodeArr, nodeMatrix);
})()
