# stampCode
> 一个触摸印章技术的实现方案

## [Demo](https://browniu.github.io/stampCode/)

目前建议在Pc Chrome测试，事件监听的是`mouse`类

[![demo](./static/stampCode.gif)](https://browniu.github.io/stampCode/) 

## 简述

### 需求分析
许多开发者大会/漫展/游戏展，都会有集印章的线下推广活动。就是在入口处给你发张DM单，上面会有一些空格位置，需要你到指定的展摊集印。到摊位前完
成一些简单任务（加个微信或关注个公众号什么的）就会有小姐姐给你拿钢印盖个章或者签个名，集满或达到一定数量就可以兑换礼品。

### 落后的传统方案

在我看来这种传统的印章签到方式本身存在很多问题。

* 制作成本高。首先需要印刷纸质的DM传单来接受盖印，又要给每个摊位制作专用章，还要有一个工作人员值班负责这件事（无法离开摊位）
* 效率很低，盖印要很用力的压在一个平整的桌面上，盖印盖多了要沾印泥，这一系列动作耗时耗力，在火爆的情况下，很容易大排长龙，造成用户流失
* 用户体验不佳。作为吃瓜群众的我要随身携带这张纸。还要不停掏出来折回去，保存麻烦还很容易弄丢。而且刚盖完上面没干的墨水还会弄脏我新买的衣服

### 相关的前端技术

身为一个前端工程师，我就想能否通过前端领域的技术去优化这个流程。没有什么需求是一个H5不能解决的，如果有那就上两个。

这个需求点分析透彻就是一个 **线下签到** 问题。这不是一个新问题，有很多的现成的技术方案都在解决。使用最多的解决方案应该就是扫码了吧。工作人
员扫你的身份识别二维码就搞定了，简单轻松。既可以杜绝虚假签到，用户需要做的事也不多。但似乎少了点什么？那就是仪式感。采集是人类的原始爱好，原
印章方式虽然麻烦但是很有仪式感，收集完也很有成就感。扫码是简单，简单到没什么参与感就结束了这个流程。

能不能更好玩一点？想象一下，我拿个印章在你的手机上盖了一下，就像在纸上那么做一样，H5上浮现出了一个动态的盖印，甚至跳出一个彩蛋，我觉得这种体
验既满足收集的仪式感，又省略那一连串的麻烦，H5上更多的互动方式让用户的参与度也会更高。

### 逻辑分析

这个盖印识别的技术类似于屏下指纹识别，但是又不需要那么高的精度。所以完全可以通过多点触控的方式实现。

#### 模拟多点触控
触摸印章大概就是有一些圆点凸起的方块，每个凸起的地方使用导电橡胶材料制作（类似电容笔），这样平整放置在屏幕上时就能在屏幕上形成多个触控点，模拟
手指多点触控的交互方式。

#### 获取点位信息

通过BOM对象的`touch`事件就能够同时获取到屏幕上的多个触控点的坐标信息，拿到一个如 `[[x1,y1],[x2,y2],[x3,y3]]` 这样的二维数组，拿这个刚
采集到的数据更数据库保存的一个固定的同格式数据进行比对，得出他们的相似程度。问题就变成了求两个二维数组相似度了。

#### 采集时的不确定性
在采集新的点位信息时（给用户盖印），会存在以下几个不确定性

* 首先因为实在手机屏幕上进行采点，而不同型号的手机屏幕尺寸/分辨率存在较大差异，拿到的坐标数值肯定不同，而且点与点之间的绝对距离也会不同
* 想象一下盖章的过程，用户举起手机给摊主盖印，用户递过来的手机方向肯定也个不一样，当然你可以强行正过来，而且把印章也做成容易辨别方向的，但是
这样就太死板了，不好玩

基于以上几点，我们计算相似性的算法就要忽略几个点，一个是点位整体的方向和绝对尺寸

#### 相似多边形

> 如果两个边数相同的多边形的对应角相等，对应边成比例，这两个或多个多边形叫做相似多边形

我们采集到的点位虽然不一定能够形成凸多边形，但是可以参考这个思路，对比边的比例。距离可以不固定，就是各点间距离（即多边形的边）的比例是固定的。

#### 实例分析

先假设简单的三点位情形，通过`touch`时间采集三个触摸点形成的三角形边长为 P1、P2、P3。通过计算两点间的距离获取到多边形的三个边长D1、D2、D3

```JavaScript
// 两点间距离
const distance = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);
```

如果完全按照相似多边形定理去证明，除了要比较各个对应边的比例，还要计算出两条边之间的夹角，这太麻烦了。我想换一个思路，先找到最小边，然后求出
其他边与最小边的比例，然后升序重排一下。（我不知道这符合什么鬼定理）

```JavaScript
// 数组中的最小值
const minInArray = (array) => array.sort((a, b) => a - b)[0];
```

```JavaScript
// 假设D1最小 求其余边与最小边的比例
const R1 = D2/D1
const R2 = D3/D1
const resultFromTouch = [R1,R2].sort()
```

到此为止由三个点位最终获取到一个数组 `resultFromTouch=[R1,R2]`，同样的我们可以从固定的印章点位信息中也获取到相同结构的`resultFromStamp=[Ra,Rb]`

理想情况下，在用户手机上采集点位时都刚好拿到的是触摸点最中心点像素的坐标信息，那么`resultFromTouch`与`resultFromStamp`对应位置的值应该
能全等。然而实物印章的点位并不是一像素的针点，而是一个面，并且这个面不能过小。所以要设置容差，这个容差根实物印章的点尺寸有关，但是也不是绝对
线性相关。

#### 余弦相似性

那现在就变成了比较两个一维数组（向量）的相似性的问题。为什么要比较相似性。因为我想要最终的结果是`0-100`的分数，`0`表示完全不同，`100`表示
完全相同。这样我就可以通过分数区间来设置容差，超过90分就判定通过验证。

> 余弦相似度是用向量空间中两个向量夹角的余弦值作为衡量两个个体间差异的大小。余弦值越接近1，就表明夹角越接近0度，也就是两个向量越相似。

这里引入余弦像素的的公式及其`JavaScript`的实现
![余弦相似度公式](./static/yxxsd.png)

```JavaScript
async function compute(x, y) {
    x = tf.tensor1d(x);
    y = tf.tensor1d(y);
    const p1 = tf.sqrt(x.mul(x).sum());
    const p2 = tf.sqrt(y.mul(y).sum());
    let p12 = x.mul(y).sum();
    let score = p12.div(p1.mul(p2));
    score = ((await score.data())[0] - 0.9) * 10;
    logEle.innerText = score;
    logBar.style.transform = 'scaleX(' + score + ')';
    if (score > 0.85) {
        stop();
        logBar.style.background = 'green';
    } else logBar.style.background = 'brown';
}
```

#### 差异相关性（原创）

除了直接使用余弦相似度，其实还可以尝试其他途径计算向量的相关性。比如我原创的一个算法 **差值相关性**
如果总分为100，这个数组的每一位对总分的影响程度就是`总分/数组长度`，也就是`R1`与`Ra`之间的差异对总分的影响在`0-50`分之间。`abs.(R1-Ra)`
与这个分数负相关。

```JavaScript
const gap = abs.(R1-Ra)
```

考虑一下极限情况，`gap=0`时，没有差异得50分,`gap=gamMax`时完全不同得0分，所以当前位分数

```JavaScript
const partScope = 50 * (1 - gap / gapMax);
```

那么问题来了`gapMax`即这个点位比例值的最大值怎么求？我不知道啊哈哈。不过据我手动观察这个值大部分情况90%情况下介于`0-10`之间，所以暂时假设`gapMax=10`
最后对各个位的得分求和。

```JavaScript
scope = scope + partScope
```

得到的`scope`就是能用`0-100`的数值表示两个向量相似度的值(其中一个重要系数是目测的/捂脸)，整体思路就是如此。

网上搜搜其实可以看得到类似的企业级解决方案，价格高的离谱就算了，而且搞得相当神秘。它可能有用更精妙的算法来提高精度，但我觉得基本原理是不过尔尔。

整个思路就是如此，凭直觉大概从有想打到Demo验证不过12个小时，也许有更高明的算法去解决整个问题，或者是优化其中的一部分计算，非常希望能够有同学能一起讨论。

## 相关算法

```JavaScript
// 计算两点间距离
const distance = (x0, y0, x1, y1) => Math.hypot(x1 - x0, y1 - y0);

// 生成指定范围的二维点位
const randomPosInRange = (min, max) => Array.from({length: 2}, () => Math.floor(Math.random() * (max - min + 1)) + min);

// 生成指定位数和范围的二维点位组合
const RPIRInCount = (min, max, n) => Array.from({length: n}, () => randomPosInRange(min, max));

// 绘制点位组合
const drawPoints = (points) => console.log('draw');

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
    const code = distances.map(distance => round(distance / minDistance, 0));
    code.shift();
    return code

};

// 四舍五入到指定位数
const round = (n, decimals = 0) => Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`);

// 近似匹配
const approximateMatch = (a, b, range) => Math.abs(a - b) >= range;
```

## 运行
```bash
cd src && serve
```
