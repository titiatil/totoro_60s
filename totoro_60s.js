const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width;
let height = canvas.height;
let masume = 10; // 10*10のマス目

// 各記号
const symbol_bracket = ["(", ")"];
const symbol_variable = ["p", "q"]; // とりあえず命題変数は二つにしている。いずれ三つ以上に拡張するならこの書き方は良くないが。
const symbol_connective1 = ["￢"];
const symbol_connective2 = ["→", "∧", "∨"];


// console.log(width, height);

const game = {
    status: 0, // 0:タイトル画面, 1:ゲーム画面, 2:ゲーム開始待ち, 3:ゲームオーバー
    time: 60, // 60からカウント
    timecount: null,
    timewait: 3,
    timewaitcount: null,
    score:0,
    y: -1,
    x: -1,
    choice: 0,
    Used : [],
    now_y : -1,
    now_x : -1,
    choices_list : []
}

function title_screen() {
    masume_color("whitesmoke");
}

// マス内の文字を表示
function formulas_color_update(color_name) {
    for (let y = 0; y < masume; y++) {
        for (let x = 0; x < masume; x++) {
            ctx.fillStyle = color_name;
            ctx.font = "bold 32px serif";
            ctx.fillText(Board[y][x], width / masume * y + width / masume / 2 - 15, height / masume * x + height / masume / 2 + 10);
        }
    }
}

function initial_board_make() {
    // 盤面を初期化
    const Board = []; //10*10の空の盤面
    for (let y = 0; y < masume; y++) {
        let Board2 = []
        for (let x = 0; x < masume; x++) {
            Board2.push("");
        }
        Board.push(Board2);
    }
    return Board;
}


function initial_used_make() {
    // 盤面を初期化
    const Used = []; //10*10の空の盤面
    for (let y = 0; y < masume; y++) {
        let Used2 = []
        for (let x = 0; x < masume; x++) {
            Used2.push(0);
        }
        Used.push(Used2);
    }
    return Used;
}


function random_board(Board) {
    for (let y = 0; y < masume; y++) {
        for (let x = 0; x < masume; x++) {

            // 入れる文字種類の調整。
            // カッコ・命題変数・￢・∧∨→が1:4:1:2になるようにしているが、その比率が良いのかは謎。
            var symbol_choice = Math.floor(Math.random() * 8)

            if (symbol_choice == 0) {
                board_randchoice = symbol_bracket[Math.floor(Math.random() * symbol_bracket.length)];
            }
            else if (symbol_choice <= 4) {
                board_randchoice = symbol_variable[Math.floor(Math.random() * symbol_variable.length)];
            }
            else if (symbol_choice <= 5) {
                board_randchoice = symbol_connective1[Math.floor(Math.random() * symbol_connective1.length)];
            }
            else if (symbol_choice <= 7) {
                board_randchoice = symbol_connective2[Math.floor(Math.random() * symbol_connective2.length)];
            }

            if (Board[y][x]==""){
                Board[y][x] = board_randchoice;
            }
        }
    }
    return Board;
}

function timer_plus() {
    game.time -= 1;
    time_div.textContent =  "time: " + game.time;

    if (game.time == 0) {
        clearInterval(game.timecount);
    }
}

function gametimer_wait(){
    game.timewait -= 1;
    whitecanvas();
    masume_color("whitesmoke");
    formulas_color_update("#CCCCCC");

    ctx.fillStyle = "#111111";
    ctx.font = "bold 320px serif";
    ctx.fillText(game.timewait,width/2 - 100 ,height/2 + 120);

    if (game.timewait == 0){
        clearInterval(game.timewaitcount);
        game.status = 1;
        whitecanvas();
        masume_color("whitesmoke");
        formulas_color_update("#CCCCCC");
        gamestart();
    }
}

addEventListener('mousedown', mousedownfunc);
function mousedownfunc(event) {
    if (game.status == 0) {
        whitecanvas();
        masume_color("whitesmoke");
        formulas_color_update("#CCCCCC");

        ctx.fillStyle = "#111111";
        ctx.font = "bold 320px serif";
        ctx.fillText(game.timewait,width/2 - 100 ,height/2 + 120);


        game.timewaitcount = setInterval(gametimer_wait, 1000);
        game.status = 2;
    }

    if (game.status == 1 && game.choice==0) {
        game.choice = 1;

        let y = Math.floor(game.y / (width / masume));
        let x = Math.floor(game.x / (height / masume));
        ctx.strokeRect(width / masume * x, height / masume * y, width / masume - 5, height / masume - 5);

        game.Used[y][x] = 1;

        game.choices_list.push([x, y]);

        game.now_y = y;
        game.now_x = x;
    }
}

function whitecanvas(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);
}

function masume_color(color_name){
    for (let y = 0; y < masume; y++) {
        for (let x = 0; x < masume; x++) {
            ctx.fillStyle = color_name;
            ctx.fillRect(width / masume * y, height / masume * x, width / masume - 5, height / masume - 5);
        }
    }
}

addEventListener('mouseup', mouseupfunc);
function mouseupfunc(event) {
    if (game.choice == 1) {
        game.choice = 0;

        //console.log(game.choices_list);

        let made_formula = formula_make(game.choices_list);
        let tautjudge = taut_judge_formula(made_formula);

        // トートロジーならスコアを増やす
        if (tautjudge == 1) {
            game.score += 10

            // Erased_formulae.push(made_formula);

            for (c of game.choices_list) {
                Board[c[0]][c[1]] = "";
            }
            Board = random_board(Board);
        }

        game.Used = initial_used_make();
        game.choices_list = [];
        whitecanvas();
        masume_color("azure");
        formulas_color_update("#000000");
        score_div.textContent = "score: " + game.score;

    }
}

addEventListener('mousemove', mousemovefunc);
function mousemovefunc(event) {
    game.y = event.clientY;
    game.x = event.clientX;

    if (game.choice == 1) {
        let y = Math.floor(game.y / (width / masume));
        let x = Math.floor(game.x / (height / masume));

        if ((game.now_y == -1 && game.now_x == -1)||(y == game.now_y && Math.abs(game.now_x - x) == 1 && game.Used[y][x] == 0 ) || (x == game.now_x && Math.abs(game.now_y - y) == 1 && game.Used[y][x] == 0)){
            ctx.strokeRect(width / masume * x, height / masume * y, width / masume - 5, height / masume - 5);

            game.Used[y][x] = 1;

            game.choices_list.push([x, y]);

            game.now_y = y;
            game.now_x = x;
        }
    }
}

// タイトル画面
title_screen();
let Board = initial_board_make();
Board = random_board(Board);
formulas_color_update("#CCCCCC");

function gamestart() {
    masume_color("azure");

    const time_div = document.createElement("div");

    // div要素に必要なプロパティを設定
    time_div.id = "time_div";
    time_div.className = "time";
    time_div.textContent = "time: " + game.time;

    time_div.style.position = 'absolute';
    time_div.style.left = '850px';
    time_div.style.top = '50px';

    time_div.style.fontSize = '24px';

    // div要素をHTMLドキュメントに追加
    document.body.appendChild(time_div);
    formulas_color_update("#000000");
    game.timecount = setInterval(timer_plus, 1000);

    const score_div = document.createElement("div");

    score_div.id = "score_div";
    score_div.className = "score: ";
    score_div.textContent = "score: " + game.score;

    score_div.style.position = 'absolute';
    score_div.style.left = '850px';
    score_div.style.top = '100px';

    score_div.style.fontSize = '24px';

    // div要素をHTMLドキュメントに追加
    document.body.appendChild(score_div);
    game.Used = initial_used_make();
}

// choices_listに入っている座標から論理式を再現
function formula_make(choices_list) {
    let made_formula = "";
    for (let c of choices_list) {
        made_formula += Board[c[0]][c[1]];
    }
    return made_formula;
}

// ∧が二つ続いたり、変数が二つ続いたりしていないかを判定
// カッコ判定はしていないので、well-formed-formulaかを判定しているわけではない
function pp_judge(formula) {
    var LEN = formula.length;

    // 一文字目が")"ではダメ
    if (formula[0] == ")") {
        return 0;
    }
    //　一文字目が2-ary connectiveではダメ
    if (symbol_connective2.includes(formula[0])) {
        return 0;
    }
    //　最後の文字が2-ary connectiveではダメ
    if (symbol_connective2.includes(formula[LEN - 1])) {
        return 0;
    }
    // 最後の文字が"￢", "("ではダメ
    if (formula[LEN - 1] == "(" || formula[LEN - 1] == "￢") {
        return 0;
    }
    for (var i = 0; i < LEN - 1; i += 1) {
        // "()"と、カッコの間に何も入らないのはダメ。
        if (formula[i] == "(" && formula[i + 1] == ")") {
            return 0;
        }

        // "("の直後に2-ary connectiveが来てはダメ
        if (formula[i] == "(" && symbol_connective2.includes(formula[i + 1])) {
            return 0;
        }
        // ")"の直後は2-ary connectiveでないとダメ
        if (formula[i] == ")" && !(symbol_connective2.includes(formula[i + 1]))) {
            return 0;
        }
        // 変数が二つ連続してはダメ
        if (symbol_variable.includes(formula[i]) && symbol_variable.includes(formula[i + 1])) {
            return 0;
        }
        // 変数の直後に￢が来てはダメ
        if (symbol_variable.includes(formula[i]) && formula[i + 1] == "￢") {
            return 0;
        }
        // 変数の直後に"("が来てはダメ
        if (symbol_variable.includes(formula[i]) && formula[i + 1] == "(") {
            return 0;
        }
        // "￢"の直後に")"が来てはダメ
        if (formula[i] == "￢" && formula[i + 1] == ")") {
            return 0;
        }
        // "￢"の直後に2-ary connectiveが来てはダメ
        if (formula[i] == "￢" && symbol_connective2.includes(formula[i + 1])) {
            return 0;
        }
        // 2-ary connectiveの直後に")"が来てはダメ
        if (symbol_connective2.includes(formula[i]) && formula[i + 1] == ")") {
            return 0;
        }
        // 2-ary connectiveの直後に2-ary connectiveが来てはダメ
        if (symbol_connective2.includes(formula[i]) && symbol_connective2.includes(formula[i + 1])) {
            return 0;
        }
    }
    return 1;
}

// 付値{0, 1}を代入した古典論理式のトートロジー判定
function classical_tautology_judge(formula) {
    var LEN = formula.length;

    // 一文字のときを判定
    if (LEN == 1) {
        if (formula[0] == "1") {
            return 1;
        }
        else {
            return 0;
        }
    }

    // 全体が()に挟まれているときは、その間の論理式を判定
    if (formula[0] == "(" && formula[LEN - 1] == ")") {
        return classical_tautology_judge(formula.substring(1, LEN - 1));
    }

    var br = 0; // 何個のカッコに入っているか
    var arind = -1; // →がある一番始めのindex
    var juncind = -1 // ∧や∨がある一番後ろのindex
    for (var i = 0; i < LEN; i += 1) {
        if (formula[i] == "(") {
            br += 1;
        }
        else if (formula[i] == ")") {
            br -= 1;
        }
        // 途中でbrが-1になったらダメ
        if (br < 0) {
            return 0;
        }
        else if (br == 0 && formula[i] == "→") {
            if (arind == -1) {
                arind = i;
            }
        }
        else if (br == 0 && (formula[i] == "∧" || formula[i] == "∨")) {
            juncind = i;
        }
    }

    // br=0でないとダメ
    if (br != 0) {
        return 0;
    }

    // カッコに入っていない→があったなら、一番最初の→で二つに分けて、￢f∨g
    if (arind != -1) {
        var f = formula.substring(0, arind);
        var g = formula.substring(arind + 1);

        return (1 ^ classical_tautology_judge(f)) | classical_tautology_judge(g);
    }
    // 一番最後の∧か∨で二つに分けて再帰
    else if (juncind != -1) {
        var f = formula.substring(0, juncind);
        var g = formula.substring(juncind + 1);

        if (formula[juncind] == "∧") {
            return classical_tautology_judge(f) & classical_tautology_judge(g);
        }
        else {
            return classical_tautology_judge(f) | classical_tautology_judge(g);
        }
    }
    // 一文字が￢なら再帰
    else if (formula[0] == "￢") {
        return 1 ^ classical_tautology_judge(formula.substring(1, LEN));
    }
    return 0;
}

function taut_judge_formula(formula) {
    var tautjudge = 1;
    if (pp_judge(formula) == 0) {
        tautjudge = 0;
    }

    for (var p of ['0', '1']) {
        if (tautjudge == 0) {
            break;
        }
        for (var q of ['0', '1']) {
            var formula_p = formula.replace(/p/g, p);
            var formula_pq = formula_p.replace(/q/g, q);

            if (classical_tautology_judge(formula_pq) == 0) {
                tautjudge = 0;
                break;
            }
        }
    }
    return tautjudge;
}
