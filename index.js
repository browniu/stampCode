// 计算两点间距离
const distance = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);

// 生成指定范围的二维点位
const randomPosInRange = (min, max) => Array.from({length: 2}, () => Math.floor(Math.random() * (max - min + 1)) + min);

// 生成指定位数和范围的二维点位组合
const RPIRInCount = (min, max, n) => Array.from({length: n}, () => randomPosInRange(min, max));

// 计算各点的相互距离
const pointsDistance = (points) => {
    let array = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            const p1 = points[i];
            const p2 = points[j];
            array.push(distance(p1[0], p1[1], p2[0], p2[1]));
        }
    }
    return array
};
// 计算数组中的最小值
const minInArray = (array) => array.sort((a, b) => a - b)[0];

// 计算各点距离与最小距离的倍数
const distanceMultiple = (points) => {
    const distances = pointsDistance(points);
    const minDistance = minInArray(distances);
    const code = distances.map(distance => round(distance / minDistance, 5));
    code.shift();
    return code

};

// 四舍五入到指定位数
const round = (n, decimals = 0) => Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`);

// 近似匹配
const approximateMatchArray = (arr1, arr2) => {
    let scope = 0;
    arr1 = arr1.sort();
    arr2 = arr2.sort();
    const part = 100 / arr1.length;
    for (let i = 0; i < arr1.length; i++) {
        const reduce = Math.abs(arr1[i] - arr2[i]);
        const partScope = part * (1 - reduce / 10);
        scope = scope + partScope
    }
    let damping = 105;
    if (scope < 90) damping = 125;
    scope = scope * (scope / damping);
    return scope
};

// 主程序
const run = () => {
    const points = false ? [[126, 77], [79, 133], [61, 43]] : RPIRInCount(20, 180, 4)
    const code = distanceMultiple(points);
    console.log(code);
    window.onload = () => draw(points);
};

// 运行
run();

