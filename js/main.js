const STATUS = {
    STATUS_0 : '0',
    STATUS_2 : '2',
    STATUS_4 : '4',
    STATUS_8 : '8',
    STATUS_16 : '16',
    STATUS_32 : '32',
    STATUS_64 : '64',
    STATUS_128 : '128',
    STATUS_256 : '256',
    STATUS_512 : '512',
    STATUS_1024 : '1024',
    STATUS_2048 : '2048'
}
// 状态码

const ROW = 4; // 行
const COL = 4; // 列
const RandNumber = 2; // 初始rand个数
let GameTab = []; // 游戏对象列表
let SCORE = 0;

function Game(type) { // 游戏对象
    this.type = type;
    this.getType = function () {
        return this.type;
    }
    this.setType = function (type) {
        this.type = type;
        return this.type;
    }
}

(function init() { // 初始化游戏对象列表
    for (let i = 0; i<ROW; i++) {
        let ary = [];
        for (let j = 0; j<COL; j++) {
            ary.push(new Game(STATUS.STATUS_0));
        }
        GameTab.push(ary);
    }
    randomGame(RandNumber);
    refresh();
})()

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
