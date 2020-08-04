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

const KEY_UP = 'ArrowUp';
const KEY_DOWN = 'ArrowDown';
const KEY_LEFT = 'ArrowLeft';
const KEY_RIGHT = 'ArrowRight';
// 键盘事件对应code

const ROW = 4; // 行
const COL = 4; // 列
const RandNumber = 2; // 初始rand个数
const KEYDOWN_RADOM = 1; // 每轮随机出现个数
let GameTab = []; // 游戏对象列表
let SCORE = 0; // 得分

function Game(type = 0, flag= true) { // 游戏对象
    this.type = type;
    this.flag = flag; // 控制每次keydown后合并限制

    this.getType = function () {
        return this.type;
    }
    this.setType = function (type) {
        this.type = type;
        return this.type;
    }
    this.getFlag = function () {
        return this.flag;
    }
    this.setFlag = function (flag) {
        this.flag = flag;
        return this.flag;
    }
}

(function init() { // 初始化
    for (let i = 0; i<ROW; i++) {
        let ary = [];
        for (let j = 0; j<COL; j++) {
            ary.push(new Game(STATUS.STATUS_0));
        }
        GameTab.push(ary);
    }
    let btn = document.querySelector('.refresh');
    btn.addEventListener('click',() => {
        Clear();
        randomGame(RandNumber);
        refresh();
    })
    randomGame(RandNumber);
    refresh();
    keyDown();
})()

function AddPoints(type) { // 加分
    SCORE += type * type;
}

function Clear() { // 清空所有的状态
    GameTab.forEach((val) => {
        val.forEach((v) => {
            v.setType(STATUS.STATUS_0);
        })
    })
}

function keyDown() { // 监听键盘事件
    document.body.addEventListener('keydown', (e) => {
        initFlag();
        if(e.code === KEY_UP) {
            // console.log('上');
            for(let i =0; i<COL; i++) {
                ForEach(i, KEY_UP);
            }
        }
        else if(e.code === KEY_DOWN) {
            // console.log('下');
            for(let i =0; i<COL; i++) {
                ForEach(i, KEY_DOWN);
            }
        }
        else if(e.code === KEY_LEFT) {
            // console.log('左');
            for(let i =0; i<COL; i++) {
                ForEach(i, KEY_LEFT);
            }
        }
        else if(e.code === KEY_RIGHT) {
            // console.log('右');
            for(let i =0; i<COL; i++) {
                ForEach(i, KEY_RIGHT);
            }
        }
        else {
            return;
        }
        randomGame(KEYDOWN_RADOM);
        refresh();
    })
}

function initFlag() {
    GameTab.forEach((val) => {
        val.forEach((v) => {
            v.setFlag(true);
        })
    })
}

function ForEach(k, code) {
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
                            GameTab[key-1][k].setType(type);
                            GameTab[i][k].setType(STATUS.STATUS_0);
                            AddPoints(type);
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
                            GameTab[key+1][k].setType(type);
                            GameTab[i][k].setType(STATUS.STATUS_0);
                            AddPoints(type);
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
                            GameTab[k][key - 1].setType(type);
                            GameTab[k][i].setType(STATUS.STATUS_0);
                            AddPoints(type);
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
                            GameTab[k][key+1].setType(type);
                            GameTab[k][i].setType(STATUS.STATUS_0);
                            AddPoints(type);
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

function refresh() { // 刷新html
    let score = document.querySelectorAll('.score')[1];
    score.innerHTML = SCORE;
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

function randomGame(n) { // 随机产生n格
    for (let i = 0; i<n; i++) {
        let x = Math.round(Math.random() * (COL - 1));
        let y = Math.round(Math.random() * (ROW - 1));
        if(GameTab[x][y].getType() === STATUS.STATUS_0) {
            GameTab[x][y].setType(STATUS.STATUS_2);
        }
        else {
            i--;
        }
    }
}

console.log(GameTab)
