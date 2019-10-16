// 暴露全局变量
var cvs, ctx;

// 初始化画布
const initCanvas = () => {
    cvs = document.createElement('canvas');
    cvs.height = 200;
    cvs.width = 200;
    cvs.style.background = '#f1f1f1';
    document.body.appendChild(cvs);
    ctx = cvs.getContext('2d')
};

// 绘制矩形
const drawRect = () => {
    ctx.fillRect(10, 10, 10, 10);
    ctx.fillStyle = "green";
    ctx.fill();
};

// 绘制运行
const drawRun = () => {
    initCanvas();
    drawRect()
};
window.onload = () => drawRun();

