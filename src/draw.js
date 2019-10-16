// 暴露全局变量
var cvs, ctx;
var p1, p2, p3;

// 初始化画布
const initCanvas = (root) => {
    cvs = document.createElement('canvas');
    cvs.height = 200;
    cvs.width = 200;
    cvs.style.background = '#f1f1f1';
    root.appendChild(cvs);
    ctx = cvs.getContext('2d')
};

// 绘制矩形
const drawPoint = (x, y, color, correction) => {
    clearCvs();
    if (!correction) {
        x = x - 5;
        y = y - 5;
    }
    ctx.fillStyle = color || 'red';
    ctx.fillRect(x, y, 10, 10);
    ctx.fill();
    return {x1: x, x2: x + 10, y1: y, y2: y + 10}
};

// 监听拖拽
function listenCvs(cvs) {
    cvs.addEventListener('touchstart', (e) => {
        const touch = getPosRelaParent(e.touches[0], cvs);
        if (touch && touchPoint(touch, p1)) {
            feelTouch(touch)
        }
    });
    cvs.addEventListener('touchmove', (e) => {
        const touch = getPosRelaParent(e.changedTouches[0], cvs);
        if (touch && p1.enable) {
            drawPoint(touch.x, touch.y, 'green')
            displayPointPos(touch, document.querySelector('#pps1'))
        }
    });
    cvs.addEventListener('touchend', (e) => {
        const touch = getPosRelaParent(e.changedTouches[0], cvs);
        if (touch && p1.enable) {
            p1 = drawPoint(touch.x, touch.y)
        }

    })

}

// 显示点的坐标
function displayPointPos(point, root) {
    const xDom = root.firstChild;
    const yDom = root.lastChild;
    xDom.innerText = point.x;
    yDom.innerText = point.y;
}

// 感知点触摸
function feelTouch(touch) {
    clearCvs();
    p1 = drawPoint(touch.x, touch.y, 'green');
    p1.enable = true
}

// 清空画布
function clearCvs() {
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

// 检测是否接触到某个点位
function touchPoint(touch, point) {
    const xIn = touch.x >= point.x1 && touch.x <= point.x2;
    const yIn = touch.y >= point.y1 && touch.y <= point.y2;
    return xIn && yIn
}

// 初始化面板
function initPanel() {
    const panel = document.createElement()
}

// 绘制运行
const drawRun = () => {
    initCanvas(document.querySelector('.cvs'));
    p1 = drawPoint(10, 10);
    listenCvs(cvs)
};
window.onload = () => drawRun();

