var a = new sound("audio/a3.mp3", false);
var b = new sound("audio/b3.mp3", false);
var c = new sound("audio/c3.mp3", false);
var d = new sound("audio/d3.mp3", false);
var e = new sound("audio/e3.mp3", false);
var f = new sound("audio/f3.mp3", false);
var g = new sound("audio/g3.mp3", false);
var music1 = new sound("audio/NeoSoulJam.mp3", true);
var music2 = new sound("audio/Run.mp3", true);
var music3 = new sound("audio/SoulfulJam.mp3", true);
var muted = false;
var Timer;
var array = [];
var target = 0;
var inter;
var ctx;
var SelectedLength = 1,
    SelectedDifficulty = 1,
    SelectedMusic = 0;
var SelectedBeforeLength, SelectedBeforeDifficulty, SelectedBeforeMusic;
var SelectedLengthB, SelectedDifficultyB, SelectedMusicB;
SelectedLengthB = document.getElementById("SelectLengthB1");
SelectedDifficultyB = document.getElementById("SelectDifficultyB1");
SelectedMusicB = document.getElementById("SelectMusicB0");
var SettingsDiv = document.getElementById("PlayArea");
var mazeTimer = document.getElementById("maze_timer");
var Points = document.getElementById("points");
var ReadyText = document.getElementById("ReadyText");
var up = true,
    right = true;
var WIDTH;
var HEIGHT;
var dx = 6;
var dy = -10;
var music;
var bricksArray = [
    [
        [0, 0, 0, 6, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 3, 0, 3, 0, 0],
        [0, 0, 0, 6, 0, 0, 0],
        [0, 0, 0, 4, 0, 0, 0],
        [0, 3, 3, 3, 3, 3, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 3, 3, 5, 3, 3, 0],
        [0, 2, 2, 5, 2, 2, 0],
        [0, 2, 2, 2, 2, 2, 0],
        [0, 0, 1, 1, 1, 0, 0]
    ],
    [
        [3, 0, 0, 6, 0, 0, 3],
        [0, 0, 5, 3, 5, 0, 0],
        [0, 5, 3, 1, 3, 5, 0],
        [0, 2, 3, 3, 3, 2, 0],
        [0, 2, 1, 4, 1, 2, 0],
        [0, 3, 3, 4, 3, 3, 0]
    ]
];
var bricks;

function muteMe(elem, mute) {
    elem.muted = mute;
}

function mute() {
    if (muted) {
        muted = false
        document.getElementsByTagName("audio").muted = false;
        var elems = document.querySelectorAll("audio");
        [].forEach.call(elems, function(elem) {
            muteMe(elem, false);
        });
        document.getElementById("soundB").style.backgroundImage = "url('img/soundOK.png')";
    } else {
        muted = true
        document.getElementsByTagName("audio").muted = true;
        var elems = document.querySelectorAll("audio");
        [].forEach.call(elems, function(elem) {
            muteMe(elem, true);
        });
        document.getElementById("soundB").style.backgroundImage = "url('img/soundNO.png')";
    }
}

function startGame() {
    switch (SelectedDifficulty) {
        case 0:
            dx = 4 * (right ? 1 : -1);
            dy = 7 * (up ? -1 : 1);
            break;
        case 1:
            dx = 6 * (right ? 1 : -1);
            dy = 10 * (up ? -1 : 1);
            break;
        case 2:
            dx = 8 * (right ? 1 : -1);
            dy = 12 * (up ? -1 : 1);
            break;
    }
    if (SelectedBeforeLength != null) {
        if (SelectedMusic != SelectedBeforeMusic)
            music.stop();
        if (SelectedBeforeLength != SelectedLength) {
            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            init();
        } else {
            setTimeout(() => {
                Timer = setInterval(timer1, 1000);
                inter = setInterval(draw, 15);
            }, 1000);
        }
    } else {
        init();
    }
    switch (SelectedMusic) {
        case 0:
            music = music1;
            break;
        case 1:
            music = music2;
            break;
        case 2:
            music = music3;
            break;
    }
    music.play();
    music.setVolume(0.1);
    SelectedBeforeLength = null;
}

function closeSettings() {
    SettingsDiv.style = "margin-top:-450px;";
}

function showSettings() {
    SettingsDiv.style = "margin-top:-145px;";
    ReadyText.style = "display:none;";
    right = dx > 0;
    up = dy < 0;
    SelectedBeforeLength = SelectedLength;
    SelectedBeforeMusic = SelectedMusic;
    SelectedBeforeDifficulty = SelectedDifficulty;
    clearInterval(inter);
    clearInterval(Timer);
    console.log("pause");
}

function ShowHello() {
    Swal.fire({
        title: "<h5>WELCOME TO THE NOTE BLOCKS</h5>",
        text: "What you need to do is simple. Destroy all blocks, for every block you destroy, it will play a different sound. Once you destroy all blocks, a melody will play based on the blocks you destroyed. I hope you are talented in music. Are you ready?",
        confirmButtonText: "Let's play!",
        confirmButtonColor: 'yellow',
    }).then((result) => {
        startGame();
    })
}

function selectLength(length) {
    SelectedLength = length;
    SelectedLengthB.style = "background-color: black;"
    SelectedLengthB = document.getElementById("SelectLengthB" + length);
    SelectedLengthB.style = "background-color: grey;"
}

function selectDifficulty(difficulty) {
    SelectedDifficulty = difficulty;
    SelectedDifficultyB.style = "background-color: black;"
    SelectedDifficultyB = document.getElementById("SelectDifficultyB" + difficulty);
    SelectedDifficultyB.style = "background-color: grey;"
}

function selectMusic(Music) {
    SelectedMusic = Music;
    SelectedMusicB.style = "background-color: black;"
    SelectedMusicB = document.getElementById("SelectMusicB" + Music);
    SelectedMusicB.style = "background-color: grey;"
}

function failed() {
    Swal.fire({
        title: "<h5>FAILED</h5>",
        text: "You failed to catch the ball. Are you ready to try it again?",
        confirmButtonText: "Yes",
        confirmButtonColor: 'yellow',
    }).then((result) => {
        regenerate();
    })
    $(".swal2-modal").css('background', 'transparent');
    $(".swal2-html-container").css('font-family', 'cursive');
    $(".swal2-title").css('color', 'white');
    $(".swal2-content").css('color', 'white');
    $(".swal2-confirm").css('background', 'transparent');
    $(".swal2-confirm").css('border', 'white 1px solid');
    $(".swal2-confirm").css('font-weight', '600');
}

function endGame() {
    clearInterval(inter);
    clearInterval(Timer);
    music.stop();
    console.log("finish");
}

function playSound() {
    switch (array[soundThrough]) {
        case 0:
            a.stop();
            a.play();
            break;
        case 1:
            b.stop();
            b.play();
            array.push(1);
            break;
        case 2:
            c.stop();
            c.play();
            array.push(2);
            break;
        case 3:
            d.stop();
            d.play();
            array.push(3);
            break;
        case 4:
            e.stop();
            e.play();
            array.push(4);
            break;
        case 5:
            f.stop();
            f.play();
            array.push(5);
            break;
        case 6:
            g.stop();
            g.play();
            array.push(6);
            break;
        default:
            break;
    }
    soundThrough++;
    if (soundThrough == target)
        clearInterval(ThrouhInterval);
}
var ThrouhInterval;

function completed() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    soundThrough = 0;
    ThrouhInterval = setInterval(playSound, 400);
    Swal.fire({
        title: "<h5>CONGRATULATIONS!</h5>",
        text: "You made it through. Let's hear the song again, shall we? If you want, you can also start it again",
        confirmButtonText: "Yes",
        confirmButtonColor: 'yellow',
    }).then((result) => {
        regenerate();
        clearInterval(ThrouhInterval);
    })
    $(".swal2-modal").css('background', 'transparent');
    $(".swal2-html-container").css('font-family', 'cursive');
    $(".swal2-title").css('color', 'white');
    $(".swal2-content").css('color', 'white');
    $(".swal2-confirm").css('background', 'transparent');
    $(".swal2-confirm").css('border', 'white 1px solid');
    $(".swal2-confirm").css('font-weight', '600');
}

function regenerate() {
    endGame();
    now = 0;
    target = 0;
    tocke = 0;
    array = [];
    Points.innerHTML = "Points: 0";
    mazeTimer.innerHTML = "Time: 0m 0s";
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    bricks = bricksArray[SelectedLength].slice();
    startGame();
}
$(".swal2-modal").css('background', 'transparent');
$(".swal2-html-container").css('font-family', 'cursive');
$(".swal2-title").css('color', 'white');
$(".swal2-content").css('color', 'white');
$(".swal2-confirm").css('background', 'transparent');
$(".swal2-confirm").css('border', 'white 1px solid');
$(".swal2-confirm").css('font-weight', '600');

function sound(src, loop) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.setAttribute("allow", "autoplay");
    if (loop)
        this.sound.setAttribute("loop", "loop");
    document.body.appendChild(this.sound);
    this.play = function() {
        this.sound.play();
    }
    this.stop = function() {
        this.sound.pause();
        this.sound.currentTime = 0;
    }
    this.setVolume = function(volume) {
        this.sound.volume = volume;
    }
    this.pause = function() {
        this.sound.pause();
    }
}

var x;
var y;
var r = 10;
var NROWS;
var NCOLS;
var BRICKWIDTH;
var BRICKHEIGHT;
var PADDING;
var tocke;
var now;
var paddlex;
var paddleh;
var paddlew;
var canvasMinX;
var canvasMaxX;
var colors = ["", "white", "orange", "yellow", "dodgerblue", "violet", "lightgreen"];

function initbricks() {
    NROWS = 6;
    NCOLS = 7;
    BRICKWIDTH = (WIDTH / NCOLS) - 5;
    BRICKHEIGHT = 25;
    PADDING = 5;
}

function init() {
    now = 0;
    x = 300;
    y = 630;
    dx = Math.abs(dx);
    dy = -Math.abs(dy);
    ctx = $('#canvas')[0].getContext("2d");
    WIDTH = $("#canvas").width();
    HEIGHT = $("#canvas").height();
    var len = bricksArray[SelectedLength].length;
    bricks = new Array(len); // boost in Safari
    for (var i = 0; i < len; ++i)
        bricks[i] = bricksArray[SelectedLength][i].slice(0);
    initbricks();
    tocke = 0;
    $("#tocke").html(tocke);
    Timer = setInterval(timer1, 1000);
    inter = setInterval(draw, 15);
    target = 0;
    for (i = 0; i < NROWS; i++) {
        for (j = 0; j < NCOLS; j++) {
            target += bricks[i][j];
        }
    }

    init_mouse();
    $(document).mousemove(onMouseMove);
    init_paddle();
}

function timer1() {
    now++;
    var minutes = Math.floor(now / 60);
    var seconds = Math.floor(now % 60);
    mazeTimer.innerHTML = "Time: " + minutes + "m " + seconds + "s";
}

function circle(x, y, r) {
    ctx.beginPath();
    ctx.fillStyle = "rgb(255, 255, 0)"
    ctx.arc(x, y, r, 0, Math.PI * 2, true);
    ctx.shadowBlur = 15;
    ctx.shadowColor = "rgb(255, 255, 0)";
    ctx.closePath();
    ctx.fill();
}

function rect(x, y, w, h, color) {
    ctx.beginPath();
    ctx.fillStyle = colors[color];
    ctx.rect(x, y, w, h);
    ctx.shadowBlur = 5;
    ctx.shadowColor = colors[color];
    ctx.closePath();
    ctx.fill();
}

function clear() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
}

function init_mouse() {
    //canvasMinX = $("#canvas").offset().left;
    canvasMinX = $("canvas").offset().left;
    canvasMaxX = canvasMinX + WIDTH;
}

function onMouseMove(evt) {
    if (evt.pageX > canvasMinX && evt.pageX < canvasMaxX - paddlew) {
        paddlex = evt.pageX - canvasMinX - paddlew / 2;
    }
}

function init_paddle() {
    paddlex = WIDTH / 2;
    paddleh = 10;
    paddlew = 100;
}
var rightDown = false;
var leftDown = false;

//nastavljanje leve in desne tipke
function onKeyDown(evt) {
    if (evt.keyCode == 39)
        rightDown = true;
    else if (evt.keyCode == 37) leftDown = true;
}

function onKeyUp(evt) {
    if (evt.keyCode == 39)
        rightDown = false;
    else if (evt.keyCode == 37) leftDown = false;
}
$(document).keydown(onKeyDown);
$(document).keyup(onKeyUp);

function draw() {
    clear();
    circle(x, y, 10);
    if (rightDown) {
        if ((paddlex + paddlew) < WIDTH) {
            paddlex += 10;
        } else {
            paddlex = WIDTH - paddlew;
        }
    } else if (leftDown) {
        if (paddlex > 0) {
            paddlex -= 10;
        } else {
            paddlex = 0;
        }
    }
    rect(paddlex, HEIGHT - paddleh, paddlew, paddleh);

    for (i = 0; i < NROWS; i++) {
        for (j = 0; j < NCOLS; j++) {
            if (bricks[i][j] != 0) {
                rect((j * (BRICKWIDTH + PADDING)) + PADDING,
                    (i * (BRICKHEIGHT + PADDING)) + PADDING,
                    BRICKWIDTH, BRICKHEIGHT, bricks[i][j]);
            }
        }
    }

    rowheight = BRICKHEIGHT + PADDING + paddleh / 2;
    colwidth = BRICKWIDTH + PADDING + paddleh / 2;
    do {
        try {
            if (y < NROWS * rowheight - (dy < 0 ? dy : -dy)) {
                col = Math.floor((x + r) / colwidth);
                if (dy < 0) {
                    //Spodnji odboj
                    row = Math.floor((y - rowheight / 2) / rowheight);
                    if (row >= 0 && col >= 0 && bricks[row][col] != 0) {
                        dy = -dy;
                        hit(row, col)
                        break;
                    }
                } else {
                    row = Math.floor((y + rowheight) / rowheight);
                    //Zgornji odboj
                    if (row >= 0 && col >= 0 && bricks[row][col] != 0) {
                        dy = -dy;
                        hit(row, col)
                        break;
                    }
                }
                row = Math.floor((y + r) / rowheight);
                if (dx > 0) {
                    col = Math.floor((x + colwidth / 2 - r) / colwidth);
                    //Levi odboj
                    if (row >= 0 && col >= 0 && bricks[row][col] != 0) {
                        dx = -dx;
                        hit(row, col)
                        break;
                    }
                } else {
                    col = Math.floor((x) / colwidth);
                    //Desni odboj
                    if (row >= 0 && col >= 0 && bricks[row][col] != 0) {
                        dx = -dx;
                        hit(row, col)
                        break;
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    } while (false);

    if (x + dx > WIDTH - r || x + dx < 0 + r) {
        dx = -dx;
        a.stop();
        a.play();

    }
    if (y + dy < 0 + r) {
        dy = -dy;
        a.stop();
        a.play();
    } else if (y + dy > HEIGHT - r - paddleh) {
        if (x > paddlex - r && x < paddlex + paddlew + r) {
            dx = 8 * ((x - (paddlex + paddlew / 2)) / paddlew);
            a.stop();
            a.play();
            dy = -dy;
        } else if (y + dy > HEIGHT - r) {
            endGame();
            failed();
        }
    }
    x += dx;
    y += dy;
}

function hit(i, j) {
    switch (bricks[i][j]) {
        case 1:
            b.stop();
            b.play();
            array.push(1);
            break;
        case 2:
            c.play();
            array.push(2);
            break;
        case 3:
            d.play();
            array.push(3);
            break;
        case 4:
            e.play();
            array.push(4);
            break;
        case 5:
            f.play();
            array.push(5);
            break;
        case 6:
            g.play();
            array.push(6);
            break;
        default:
            break;
    }
    bricks[i][j] -= 1;
    tocke += 1;
    Points.innerHTML = "Points: " + tocke;
    if (target == tocke) {
        endGame();
        completed();
    }
}
