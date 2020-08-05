const STATUS = {
    STATUS_0 : 0,
    STATUS_2 : 2,
    STATUS_4 : 4,
    STATUS_8 : 8,
    STATUS_16 : 16,
    STATUS_32 : 32,
    STATUS_64 : 64,
    STATUS_128 : 128,
    STATUS_256 : 256,
    STATUS_512 : 512,
    STATUS_1024 : 1024,
    STATUS_2048 : 2048
}
// 状态码

const ADMIN = 'Admin'; // 测试用
const BEST = 'BEST'; // 最高分

const KEY_UP = 'ArrowUp';
const KEY_DOWN = 'ArrowDown';
const KEY_LEFT = 'ArrowLeft';
const KEY_RIGHT = 'ArrowRight';
// 事件对应code

const ROW = 4; // 行
const COL = 4; // 列
const RandNumber = 2; // 初始rand个数
const KEYDOWN_RADOM = 1; // 每轮随机出现个数
let GameTab = []; // 游戏对象列表
let SCORE = 0; // 得分

function Game(type = 0, flag= true) { // 游戏对象
    this.type = type;
    this.flag = flag; // 控制每次keydown后合并限制
}

function FUNC() { // 封装方法
    Game.prototype.getType = function () {
        return this.type;
    }
    Game.prototype.setType = function (type) {
        this.type = type;
        return this.type;
    }
    Game.prototype.getFlag = function () {
        return this.flag;
    }
    Game.prototype.setFlag = function (flag){
        this.flag = flag;
        return this.flag;
    }
}

(function init() { // 初始化
    FUNC();
    for (let i = 0; i<ROW; i++) {
        let ary = [];
        for (let j = 0; j<COL; j++) {
            ary.push(new Game(STATUS.STATUS_0));
        }
        GameTab.push(ary);
    }
    sessionStorage.setItem(BEST, 0);
    BestScore();
    BtnClick();
    randomGame(RandNumber);
    refresh();
    keyDown();
    touch();
})()

function BestScore(num=0) { // 初始化最高分
    try {
        if(num > sessionStorage.getItem(BEST)){
            sessionStorage.setItem(BEST, num);
        }
    }
    catch (e) {
        sessionStorage.setItem(BEST, 0);
    }
}

function BtnClick() { // 刷新按钮事件
    let btn = document.querySelector('.refresh');
    btn.addEventListener('click',() => {
        Clear();
        if(SCORE > sessionStorage.getItem(BEST)){
            BestScore(SCORE);
        }
        SCORE = 0;
        randomGame(RandNumber);
        refresh();
    })
}

function AddPoints(type) { // 加分
    SCORE += type / 2;
}

function Clear() { // 清空所有的状态
    GameTab.forEach((val) => {
        val.forEach((v) => {
            v.setType(STATUS.STATUS_0);
        })
    })
}

function touch() { // 移动端屏幕触动监听
    let main = document.querySelector('main');
    let startX,startY,moveX,moveY; // 开始坐标和移动坐标
    let X,Y; // 移动后的差值
    let temp;
    main.addEventListener('touchstart',(e) => {
        e.preventDefault();
        // console.log(e.changedTouches[0].pageX);
        startX = e.changedTouches[0].pageX;
        startY = e.changedTouches[0].pageY;
    })
    main.addEventListener('touchend', (e) => {
        e.preventDefault();
        moveX = e.changedTouches[0].pageX;
        moveY = e.changedTouches[0].pageY;
        X = moveX - startX;
        Y = moveY - startY;
        temp = initFlag();
        // console.log(X,Y);
        if(Math.abs(X) > Math.abs(Y) && X < 0) {
            // console.log('left');
            move(KEY_LEFT);
        }
        else if(Math.abs(X) > Math.abs(Y) && X > 0) {
            // console.log('right');
            move(KEY_RIGHT);
        }
        else if(Math.abs(X) < Math.abs(Y)&& Y > 0) {
            // console.log('down');
            move(KEY_DOWN);
        }
        else if(Math.abs(X) < Math.abs(Y) && Y < 0) {
            // console.log('up');
            move(KEY_UP);
        }
        else {
            return;
        }
        if(comp(temp,GameTab)) {
            if(Empty() && GameOver()) {
                alert("Game Over");
                Clear();
                randomGame(RandNumber);
                refresh();
            }
            return;
        }
        randomGame(KEYDOWN_RADOM);
        refresh();
    })
}

function keyDown() { // 监听键盘事件
    document.body.addEventListener('keydown', (e) => {
        let temp = initFlag();
        if(e.code === KEY_UP) {
            // console.log('上');
            move(KEY_UP);
        }
        else if(e.code === KEY_DOWN) {
            // console.log('下');
            move(KEY_DOWN);
        }
        else if(e.code === KEY_LEFT) {
            // console.log('左');
            move(KEY_LEFT);
        }
        else if(e.code === KEY_RIGHT) {
            // console.log('右');
            move(KEY_RIGHT);
        }
        else {
            return;
        }
        if(comp(temp,GameTab)) {
            if(Empty() && GameOver()) {
                alert("Game Over");
                Clear();
                randomGame(RandNumber);
                refresh();
            }
            return;
        }
        randomGame(KEYDOWN_RADOM);
        refresh();
    })
}

function Empty() { // 判断GameTab是否已经被占满
    for (let i = 0; i<ROW; i++) {
        for (let j = 0; j<COL; j++) {
            if(GameTab[i][j].getType() === STATUS.STATUS_0) {
                return false;
            }
        }
    }
    return true;
}

function GameOver() {
    for (let i = 0; i<ROW; i++) {
        for (let j = 1; j<COL; j++) {
            if(GameTab[i][j].getType() === GameTab[i][j-1].getType() ||
                GameTab[j][i].getType() === GameTab[j-1][i].getType()){
                return false;
            }
        }
    }
    return true;
}

function comp(ary1, ary2) { // 判断两个ary是否相等
    for(let i = 0; i<ROW; i++) {
        for (let j = 0; j<COL; j++) {
            if(ary1[i][j].getFlag() !== ary2[i][j].getFlag() ||
                ary1[i][j].getType() !== ary2[i][j].getType()) {
                return false;
            }
        }
    }
    return true;
}

function initFlag() {
    let ary = [];
    GameTab.forEach((val) => {
        let ary2 = [];
        val.forEach((v) => {
            v.setFlag(true);
            ary2.push(new Game(v.getType(), v.getFlag())); // 复制游戏列表
        })
        ary.push(ary2);
    })
    return ary;
}

function move(code) {
    for(let k = 0; k<ROW; k++) {
        let type = STATUS.STATUS_0;
        if(code === KEY_UP) {
            let key = 0;
            for(let i = 0; i<ROW; i++) {
                if(GameTab[i][k].getType() !== STATUS.STATUS_0) {
                    if(type === STATUS.STATUS_0) {
                        type = GameTab[i][k].getType();
                        GameTab[i][k].setType(STATUS.STATUS_0);
                        GameTab[key++][k].setType(type);
                    }
                    else {
                        if(type !== GameTab[i][k].getType()) {
                            type = GameTab[i][k].getType();
                            GameTab[i][k].setType(STATUS.STATUS_0);
                            GameTab[key++][k].setType(type);
                        }
                        else {
                            if(GameTab[key-1][k].getFlag()){
                                GameTab[key-1][k].setFlag(false);
                                type = type * 2;
                                AddPoints(type);
                                if(type > STATUS.STATUS_2048) {
                                    type = STATUS.STATUS_0;
                                }
                                GameTab[key-1][k].setType(type);
                                GameTab[i][k].setType(STATUS.STATUS_0);
                            }
                            else {
                                type = GameTab[i][k].getType();
                                GameTab[i][k].setType(STATUS.STATUS_0);
                                GameTab[key++][k].setType(type);
                            }
                        }
                    }
                }
            }
        }
        else if(code === KEY_DOWN) {
            let key = ROW-1;
            for(let i = ROW-1; i>=0; i--) {
                if(GameTab[i][k].getType() !== STATUS.STATUS_0) {
                    if(type === STATUS.STATUS_0) {
                        type = GameTab[i][k].getType();
                        GameTab[i][k].setType(STATUS.STATUS_0);
                        GameTab[key--][k].setType(type);
                    }
                    else {
                        if(type !== GameTab[i][k].getType()) {
                            type = GameTab[i][k].getType();
                            GameTab[i][k].setType(STATUS.STATUS_0);
                            GameTab[key--][k].setType(type);
                        }
                        else {
                            if(GameTab[key+1][k].getFlag()){
                                GameTab[key+1][k].setFlag(false);
                                type = type * 2;
                                AddPoints(type);
                                if(type > STATUS.STATUS_2048) {
                                    type = STATUS.STATUS_0;
                                }
                                GameTab[key+1][k].setType(type);
                                GameTab[i][k].setType(STATUS.STATUS_0);
                            }
                            else {
                                type = GameTab[i][k].getType();
                                GameTab[i][k].setType(STATUS.STATUS_0);
                                GameTab[key--][k].setType(type);
                            }
                        }
                    }
                }
            }
        }
        else if(code === KEY_LEFT) {
            let key = 0;
            for(let i = 0; i<COL; i++) {
                if(GameTab[k][i].getType() !== STATUS.STATUS_0) {
                    if(type === STATUS.STATUS_0) {
                        type = GameTab[k][i].getType();
                        GameTab[k][i].setType(STATUS.STATUS_0);
                        GameTab[k][key++].setType(type);
                    }
                    else {
                        if(type !== GameTab[k][i].getType()) {
                            type = GameTab[k][i].getType();
                            GameTab[k][i].setType(STATUS.STATUS_0);
                            GameTab[k][key++].setType(type);
                        }
                        else {
                            if(GameTab[k][key-1].getFlag()) {
                                GameTab[k][key-1].setFlag(false);
                                type = type * 2;
                                AddPoints(type);
                                if(type > STATUS.STATUS_2048) {
                                    type = STATUS.STATUS_0;
                                }
                                GameTab[k][key - 1].setType(type);
                                GameTab[k][i].setType(STATUS.STATUS_0);
                            }
                            else {
                                type = GameTab[k][i].getType();
                                GameTab[k][i].setType(STATUS.STATUS_0);
                                GameTab[k][key++].setType(type);
                            }
                        }
                    }
                }
            }
        }
        else if(code === KEY_RIGHT) {
            let key = COL-1;
            for(let i = COL-1; i>=0; i--) {
                if(GameTab[k][i].getType() !== STATUS.STATUS_0) {
                    if(type === STATUS.STATUS_0) {
                        type = GameTab[k][i].getType();
                        GameTab[k][i].setType(STATUS.STATUS_0);
                        GameTab[k][key--].setType(type);
                    }
                    else {
                        if(type !== GameTab[k][i].getType()) {
                            type = GameTab[k][i].getType();
                            GameTab[k][i].setType(STATUS.STATUS_0);
                            GameTab[k][key--].setType(type);
                        }
                        else {
                            if(GameTab[k][key+1].getFlag()) {
                                GameTab[k][key+1].setFlag(false);
                                type = type * 2;
                                AddPoints(type);
                                if(type > STATUS.STATUS_2048) {
                                    type = STATUS.STATUS_0;
                                }
                                GameTab[k][key+1].setType(type);
                                GameTab[k][i].setType(STATUS.STATUS_0);
                            }
                            else {
                                type = GameTab[k][i].getType();
                                GameTab[k][i].setType(STATUS.STATUS_0);
                                GameTab[k][key--].setType(type);
                            }
                        }
                    }
                }
            }
        }
    }
}

function refresh() { // 刷新html
    let bestScore = sessionStorage.getItem(BEST);
    if(bestScore < SCORE) {
        bestScore = SCORE;
        BestScore(bestScore);
    }
    let score = document.querySelectorAll('.score')[1];
    score.innerHTML = SCORE;
    let best = document.querySelectorAll('.score')[3];
    best.innerHTML = bestScore;
    // 刷新分数

    let gameList = document.querySelectorAll('.game-tab');
    let i = 0;
    GameTab.forEach((game) => {
        game.forEach((item) => {
            let remove = gameList[i].classList[1];
            gameList[i].classList.remove(remove);
            let add = 'active-'+item.getType();
            gameList[i].classList.add(add);
            if(item.getType() !== STATUS.STATUS_0){
                gameList[i].innerHTML = item.getType();
            }
            else {
                gameList[i].innerHTML = "";
            }
            i++;
        })
    })
    // 刷新界面
}

function randomGame(n, char='user') { // 随机产生n格
    for (let i = 0; i<n; i++) {
        let x = Math.round(Math.random() * (COL - 1));
        let y = Math.round(Math.random() * (ROW - 1));
        if(GameTab[x][y].getType() === STATUS.STATUS_0) {
            if(char === ADMIN){
                let ary = [0,2,4,8,16,32,64,128,256,512,1024,2048];
                GameTab[x][y].setType(ary[Math.round(Math.random() * (ary.length-1))]);
            }
            else {
                GameTab[x][y].setType(STATUS.STATUS_2);
            }
        }
        else {
            i--;
        }
    }
}

// console.log(GameTab)
