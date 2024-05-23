let canvasW;
let canvasH;
let max = 0
let mouseX = 0;
let mouseY = 0;
let time = 30;
let interval; // переменная для хранения интервала
let bottle_interval;

const canvas = document.getElementById("screen");
let bottles = [];
let dirki = [];
let fires = [];

let score = 0;
let loaded_images = 0;
let cadr = 0;

const images = {
    "fire0": "images/fire.png",
    "fire1": "images/fire.png",
    "fire2": "images/fire.png",
    "fire3": "images/fire.png",
    "fire4": "images/fire.png",
    "fire5": "images/fire.png",
    "fire6": "images/fire.png",
    "fire7": "images/fire.png",
    "fire8": "images/fire.png",
    "fire9": "images/fire.png",
    "cross": "images/cross.png",
    "bottle": "images/bottle.png",

    "hole": "images/hole.png"
}

function loadAllImages() {
    Object.keys(images).forEach((image_title) => {
        let img = new Image()

        img.addEventListener("load", () => {
            loaded_images += 1
            if (loaded_images === Object.keys(images).length) {
                startGame()
            }
        });

        img.src = images[image_title]
        images[image_title] = img
    })
}

function increment() {
    time -= 1;
    var time_field = document.getElementById("time");
    time_field.innerText = "осталось: " + time + " сек";

    if (time <= 0) {
        clearInterval(interval);
        max = Math.max(max, score)
        alert("ВАШ СЧЕТ: " + score + " ВАШ РЕКОРД: " + max);
        time = 30;
        score = 0;
        time_field.innerText = "осталось: " + time + " сек";
        startGame();
    }
}

function enable() {
    disable(); // Stop previous timer
    interval = setInterval(increment, 1000);
}

function disable() {
    try {
        clearInterval(interval);
    } catch (e) {
        console.log(e);
    }
}

function random(a, b) {
    return Math.random() * (b - a) + a;
}

function createBottle() {
    const bottle = {
        x: random(0, canvasW),
        y: random(0, canvasH),
    }
    bottles.push(bottle)
}

function removeOldBottles() {
    if (bottles.length > 3) {
        bottles.shift();
    }
}

function mouseClick(e) {
    makeShot(e.clientX, e.clientY);
}


function makeShot(x, y) {
    let currentSize = bottles.length;


    bottles = bottles.filter(bottle => !(bottle.x - 50 <= x && x <= bottle.x + 50 && bottle.y - 100 <= y && y <= bottle.y + 100));
    if (currentSize - bottles.length == 0){
        const dirka = {
            x: mouseX - 25,
            y: mouseY - 25,
        }
        dirki.push(dirka)
    }
    else{
        const firee = {
            x: mouseX - 50,
            y: mouseY - 100,
        }
        fires.push(firee)
    }

    score += currentSize - bottles.length;
}

function makeFullscreen() {
    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    canvasW = canvas.width;
    canvasH = canvas.height;
}

function saveMousePosition(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
}

function drawBackground(ctx) {
    ctx.fillStyle = "#f5f5dc";
    ctx.fillRect(0, 0, canvasW, canvasH);
}

function drawCursor(ctx) {
    ctx.drawImage(images.cross, mouseX - 25, mouseY - 25, 50, 50);
}

function drawBottles(ctx) {
    bottles.forEach((bottle) => {
        ctx.drawImage(images.bottle, bottle.x - 50, bottle.y - 100, 100, 200);
    });
}
function drawHole(ctx) {
    dirki.forEach((dirka) => {
        ctx.drawImage(images.hole, dirka.x ,dirka.y , 50, 50);
    });
}
function drawfire(ctx) {
    if(cadr>9){
        fires.shift();
        cadr = 0;
    }
    let firess = "fire" + cadr;
    fires.forEach((firee) => {
        ctx.drawImage(images[firess], firee.x ,firee.y , 100, 200);
    cadr += 1
    });
}


function drawScore(ctx) {
    ctx.font = "48px serif";
    ctx.fillStyle = "green";
    let textSize = ctx.measureText(score);
    ctx.fillText(score, canvasW - 50 - textSize.width, 50);
}

function drawTime(ctx) {
    ctx.font = "48px serif";
    ctx.fillStyle = "green";
    let textSize = ctx.measureText(time);
    ctx.fillText(time, canvasW - 100 - textSize.width, 100);
}

function drawFrame() {
    makeFullscreen();
    removeOldBottles();

    const ctx = canvas.getContext("2d");

    drawBackground(ctx);

    drawHole(ctx);
    drawBottles(ctx);
    drawfire(ctx)
    drawCursor(ctx);
    drawScore(ctx);
}


function startGame() {
    enable();
    clearInterval(bottle_interval);
    setInterval(drawFrame, 20);
    bottle_interval = setInterval(createBottle, 1000);
    addEventListener("mousemove", saveMousePosition);
    addEventListener("mousedown", mouseClick);
}

loadAllImages();
