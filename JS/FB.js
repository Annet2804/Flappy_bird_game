let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let bird = new Image();
let background = new Image();
let foreground = new Image();
let pipeUp = new Image();
let pipeDown = new Image();
let sale_persent = new Image();
let game_lose = new Image();
let winner = new Image();
let upAudio = new Audio();
let pointsAudio = new Audio();

let score_for_sale = document.getElementById('score_of_fb');
let game_relode_but = document.getElementById('game_relode_but');

bird.src = "img_game/boot.png";
background.src = "img_game/background.png";
foreground.src = "img_game/fg.png";
pipeUp.src = "img_game/down.png";
pipeDown.src = "img_game/up.png";
sale_persent.src = "img_game/sale.png";
game_lose.src = "img_game/lose.png";
winner.src = "img_game/win.png";
upAudio.src = "audio_game/fly.mp3";
pointsAudio.src = "audio_game/score.mp3";

const characters = document.querySelectorAll('.character');

characters.forEach(char => {
    char.addEventListener('click', () => {
        characters.forEach(c => c.classList.remove('selected'));
        char.classList.add('selected');

        const selectedChar = char.dataset.character;
        if (selectedChar === "boot") {
            bird.src = "img_game/boot.png";
        } else if (selectedChar === "bird") {
            bird.src = "img_game/bird.png";
        }
    });
});


let distance = 190;
let xb = 10;
let yb = 150;
let grav = 2;
let points = 0;
let highScore = localStorage.getItem('flappyHighScore') || 0;
let animationId;

let pipes = [];
pipes[0] = { x: canvas.width, y: 0 };

document.addEventListener("keydown", function(e) {
    if (e.code === 'Space') {
        yb -= 40;

    }
});


//скидаєм налаштування
function resetGame() {
    cancelAnimationFrame(animationId); //зупинка анімації
    xb = 10;
    yb = 150;
    grav = 2;
    points = 0;
    pipes = [];
    pipes[0] = { x: canvas.width, y: 0 };
    game_relode_but.blur();

    draw();
}

function endGame(win = false) {
    cancelAnimationFrame(animationId); //  зупиняємо анімацію

    if (points > highScore) {
        highScore = points;
        localStorage.setItem('flappyHighScore', highScore);
    }
    if(win) {
        ctx.drawImage(winner, 0, 0, canvas.width, canvas.height);
    } else {
        ctx.drawImage(game_lose, 0, 0, canvas.width, canvas.height);
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    // Малювання труб
    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeUp, pipes[i].x, pipes[i].y);
        ctx.drawImage(pipeDown, pipes[i].x, pipes[i].y + pipeUp.height + distance);
        ctx.drawImage(sale_persent, pipes[i].x, pipes[i].y + pipeUp.height + (distance / 4), 50, 50);

        pipes[i].x--;

        if (pipes[i].x === 125) {
            pipes.push({
                x: canvas.width,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
            });
        }

        // Перевірка на зіткнення
        if (xb + bird.width >= pipes[i].x &&
            xb <= pipes[i].x + pipeUp.width &&
            (yb <= pipes[i].y + pipeUp.height || yb + bird.height >= pipes[i].y + pipeUp.height + distance) ||
            yb + bird.height >= canvas.height - foreground.height
        ) {
            return endGame(); // Завершуємо гру
        }

        // Підрахунок очок
        if (pipes[i].x === 5) {
            points++;
            pointsAudio.play();
        }

        // Перевірка на перемогу
        if (points >= 10) {
            return endGame(true); // перемога
        }
    }

    ctx.drawImage(foreground, 0, canvas.height - foreground.height, canvas.width, foreground.height);
    ctx.drawImage(bird, xb, yb, 38, 26);
    yb += grav;

    // Відображення поточних очок
    ctx.fillStyle = '#e0ba06';
    ctx.font = '25px Verdana';
    ctx.fillText(points, 10, canvas.height - 25);
    ctx.drawImage(sale_persent, 40, canvas.height - 48, 25, 25);

    // Відображення рекорду
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Verdana';
    ctx.fillText("High Score: " + highScore, 10, 30);

    animationId = requestAnimationFrame(draw);
}


game_relode_but.addEventListener('click', resetGame);


window.onload = draw;