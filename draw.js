// 初始化画布
const initCanvas = (root) => {
    const cvs = document.createElement('canvas');
    cvs.height = 200;
    cvs.width = 200;
    cvs.style.background = '#f1f1f1';
    root.appendChild(cvs);
    const ctx = cvs.getContext('2d');
    return {cvs, ctx}
};

// 绘制点位
function drawPoints(points, cvs, ctx, color, size) {
    clearCtx(cvs, ctx);
    points.forEach(point => {
        drawPoint(ctx, point[0], point[1], color, size)
    })
}

// 绘制点
const drawPoint = (ctx, x, y, color, size) => {
    ctx.fillStyle = color || 'green';
    ctx.beginPath();
    ctx.arc(x, y, size || 5, 0, 2 * Math.PI);
    ctx.fill();
};

// 交互监听
function listenCvs(cvs, ctx, points, stempCode) {
    let dragAble = [false, false, false];
    cvs.addEventListener('mousedown', (e) => {
        const touch = getPosRelaParent(e, cvs);
        dragAble = touchPoints(touch, points)
    });

    cvs.addEventListener('mousemove', (e) => {
        const touch = getPosRelaParent(e, cvs);
        if (touch && dragAble.includes(true)) {
            points = points.map((point, i) => {
                if (dragAble[i]) return [touch.x, touch.y];
                else return point
            });
            const scope = displayPoints(points, document.querySelector('.panel'), stempCode)
            drawPoints(points, cvs, ctx, scope > 92 ? 'green' : 'red');
        }
    });

    cvs.addEventListener('mouseup', () => dragAble = [false, false, false]);
    cvs.addEventListener('mouseleave', () => dragAble = [false, false, false]);

    // document.querySelector('.rotate').onclick = () => rotateCtx(cvs, ctx, points);

}

// 判断接触状态
function touchPoints(touch, points) {
    return points.map(point => {
        const xIn = touch.x >= point[0] - 10 && touch.x <= point[0] + 10;
        const yIn = touch.y >= point[1] - 10 && touch.y <= point[1] + 10;
        return xIn && yIn
    })
}

// 显示点组坐标
function displayPoints(points, root, stempCode) {
    const code = distanceMultiple(points);
    const scope = approximateMatchArray(code, stempCode);
    const status = document.querySelector('.status').firstChild;
    status.style.width = scope + '%';
    status.style.background = scope < 92 ? 'red' : 'green';
    root.innerHTML = `<p style="font-size: 12px;opacity: .7;">${scope}</p>`; // + points.map(point => `<p>${JSON.stringify(point)}</p>`).join('')
    return scope
}

// 清空画布
function clearCtx(cvs, ctx) {
    ctx.clearRect(0, 0, cvs.height, cvs.width);
}

// 获取点击位置相对于父级的坐标
function getPosRelaParent(event, parent) {
    const touchPos = {x: event.pageX, y: event.pageY};
    const parentPos = {x: parent.getBoundingClientRect().x, y: parent.getBoundingClientRect().y};
    const posReduce = {x: touchPos.x - parentPos.x, y: touchPos.y - parentPos.y};
    const xIn = posReduce.x > 0 && posReduce.x < parent.width;
    const yIn = posReduce.y > 0 && posReduce.y < parent.height;
    if (xIn && yIn) return {x: touchPos.x - parentPos.x, y: touchPos.y - parentPos.y}

}

// 绘制固定图章
function drawStamp(root, points) {
    const {cvs, ctx} = initCanvas(root);
    cvs.style.margin = '0 10px';
    drawPoints(points, cvs, ctx, 'green')
}

// 旋转画布
function rotateCtx(cvs, ctx, points) {
    clearCtx(cvs, ctx);
    ctx.rotate(20 * Math.PI / 180);
    drawPoints(points, cvs, ctx);
}

// 绘制运行
function draw(points) {
    const {cvs, ctx} = initCanvas(document.querySelector('.cvs'));
    points = points || [[126, 77], [79, 133], [61, 43]];
    const stempCode = distanceMultiple(points);
    drawPoints(points, cvs, ctx);
    listenCvs(cvs, ctx, points, stempCode);
    drawStamp(document.querySelector('.cvs'), points)
}

