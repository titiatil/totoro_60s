




const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const startTime = performance.now(); // 開始時間

//グローバルなgameオブジェクト
const game = {
    counter: 0,//gameの経過時間
    enemys : [],
    image : {},
    isGameOver: true,
    score : 0,
    timer: null
}

// title画面を作る
function title_screen(){
    //ctx.fillStyle = "black"
    //ctx.fillRect(0+50, 0, 100+50, 100);
    //ctx.lineWidth = 2;
    ctx.font = '100px serif';

    //テキスト
    ctx.fillStyle = "black";
    ctx.fillText("Game Start", 150, 600);
    //枠
    // ctx.lineWidth = 1.5;
    // ctx.strokeStyle = "#333";
    // ctx.strokeText("Hello World!!", 15, 65);
}
// // タイトル画面
// // クリックされたらゲーム画面に遷移。
// function square_update(){
//     ctx.fillStyle = "black"
//     let x=Math.random() * 750
//     let y=Math.random() * 750
//     ctx.fillRect(x, y, 50, 50);

//     const endTime = performance.now(); // 終了時間

//     if (endTime-startTime>5000){
//         clearInterval(intervalId);
//     }
// }
// const intervalId = setInterval(square_update, 1000);

let click_code=0;
title_screen()


addEventListener('mousedown', mousedownfunc);
function mousedownfunc() {
    click_code=1;
    console.log(click_code);
}

addEventListener('mouseup', mouseupfunc);
function mouseupfunc() {
    click_code=0;
    console.log(click_code);
}

