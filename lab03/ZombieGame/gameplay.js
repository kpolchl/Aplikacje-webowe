const elem = document.getElementById('myCanvas');
const mouseCursor = document.querySelector("#crosshair")
const elemLeft = elem.offsetLeft + elem.clientLeft;
const elemTop = elem.offsetTop + elem.clientTop;
const ctx = elem.getContext('2d');
elem.width = window.innerWidth;
elem.height = window.innerHeight;

const zombieSprite = new Image();
const fullHeart = new Image();
const emptyHeart = new Image();
fullHeart.src = 'full_heart.png';
emptyHeart.src = 'empty_heart.png';
zombieSprite.src = 'walkingdead.png'; 
const FRAME_WIDTH = 200;  
const FRAME_HEIGHT = 312; 
const TOTAL_FRAMES = 10;  
const youDead = new Audio('sad-music.mp3');
let animationId = null;

let elements = [];
let score = '10'.padStart(6,'0');
const startLives = 3;
let lives = 0;


function animate() {
    ctx.clearRect(0, 0, elem.width, elem.height);  

    elements.forEach(function(zombie) {
        zombie.updateFrame();
        zombie.move();
        zombie.draw();
    });

    drawScore(); 
    drawLives();
    checkGameOver();
    spawnZombie();
    animationId = requestAnimationFrame(animate); 
}

function getRandom(min, max, isFloat = false) {
    return isFloat ? Math.random() * (max - min) + min : Math.floor(Math.random() * (max - min)) + min;
}

// Zombie class definition
class Zombie {
    constructor(x, y, speed, scale = 1) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.scale = scale;
        this.currentFrame = 0; 
        this.width = FRAME_WIDTH * this.scale;
        this.height = FRAME_HEIGHT * this.scale;
        this.isAlive = true; 
    }

    
    updateFrame() {
        if (this.isAlive) { 
            this.currentFrame++;
            if (this.currentFrame >= TOTAL_FRAMES) {
                this.currentFrame = 0; 
            }
        }
    }


    draw() {
        if (this.isAlive) { 
            ctx.drawImage(
                zombieSprite,
                this.currentFrame * FRAME_WIDTH, 0, FRAME_WIDTH, FRAME_HEIGHT,
                this.x, this.y, this.width, this.height
            );
        }
    }


    move() {
        if (this.isAlive) { 
            this.x -= this.speed;
            if (this.x < -this.width) { 
                this.x = elem.width;
                lives--;
            }
        }
    }

    isClicked(mouseX, mouseY) {
        if (!this.isAlive) return false; 
        return (
            mouseX > this.x && mouseX < this.x + this.width &&
            mouseY > this.y && mouseY < this.y + this.height
        );
    }

    handleClick(mouseX, mouseY) {
        if (this.isClicked(mouseX, mouseY)) {
            score = (parseInt(score) + 10).toString().padStart(6, '0'); 
            this.isAlive = false;
            return true; 
        }
        return false;
    }
    
}


function drawScore() {
    ctx.font = "100px Comic Sans"; 
    ctx.fillStyle = "white"; 
    const textWidth = ctx.measureText(score).width;

        const x = elem.width - textWidth+150 ; 

    ctx.fillText(score, x, 100); 
}

function drawLives() {
    const heartSize = 100; 
    const spacing = 140;   
    const startX = 10;     
    const startY = 10;     

    for (let i = 0; i < lives; i++) {
        ctx.drawImage(fullHeart, startX + i * spacing, startY, heartSize, heartSize);
    }


    for (let j = lives; j < startLives; j++) {
        ctx.drawImage(emptyHeart, startX + j * spacing, startY, heartSize, heartSize);
    }
}
function checkGameOver(){
    if (lives<=0){
        gameOver();
    }
}

function gameOver() {
    youDead.play();
    

    ctx.clearRect(0, 0, elem.width, elem.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
    ctx.fillRect(0, 0, elem.width, elem.height); 
    
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", elem.width / 2, elem.height / 3);
    
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText(`Final Score: ${score}`, elem.width / 2, elem.height / 2);
    
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Kliknij aby zagrać pononwnie", elem.width / 2, elem.height / 1.5);
    
    cancelAnimationFrame(animationId);
    elem.addEventListener('click', restartGame, { once: true });
    lastSpawnTime = 0;
}

function restartGame() {
    youDead.pause();
    youDead.currentTime =0;
    score = '10'.padStart(6, '0');
    lives = startLives;
    elements = [];
    animate();
}

function start() {
    ctx.clearRect(0, 0, elem.width, elem.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
    ctx.fillRect(0, 0, elem.width, elem.height); 
    
    ctx.font = "60px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("Start", elem.width / 2, elem.height / 3);
    elem.addEventListener('click', restartGame, { once: true });
}

zombieSprite.onload = function() {
    start();
    document.body.style.cursor="none"
    ctx.addEventListener("mousemove", crosshairMove)

};

elem.addEventListener('click', function (event) {
    const mouseX = event.pageX - elemLeft;
    const mouseY = event.pageY - elemTop;
    for (const zombie of elements) {
        if (zombie.handleClick(mouseX, mouseY)) {
            return; 
        }
    }
    score = (parseInt(score)-5).toString().padStart(6, '0');
    if(parseInt(score)<=0){
        gameOver();
    }       
    elements = elements.filter(zombie => zombie.isAlive);  
});


let lastSpawnTime = 0;
function spawnZombie() {
    const now = Date.now();
    if (now - lastSpawnTime > 1000) {
        const maxAttempts = 10; 
        let attempts = 0;

        while (attempts < maxAttempts && elements.length < 30) {
            const x = getRandom(1800, 2000);
            const y = getRandom(500, 750);
            const speed = getRandom(0.5, 4, true);
            const scale = getRandom(0.5, 1.5, true);
            const newZombie = new Zombie(x, y, speed, scale);

            if (isPositionValid(newZombie)) {
            elements.push(newZombie);
                break;
            }
            attempts++;
        }
        lastSpawnTime = now;
    }
}
function isPositionValid(newZombie) {
    const minDistance = 50; 

    for (const zombie of elements) {
        const dx = newZombie.x - zombie.x;
        const dy = newZombie.y - zombie.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < minDistance) {
            return false; 
        }
    }
    return true; 
}

    function crosshairMove(e) {
        const mouseCursor = document.querySelector("#crosshair");

        mouseCursor.style.left = (e.pageX - mouseCursor.offsetWidth / 2) + "px";
        mouseCursor.style.top = (e.pageY - mouseCursor.offsetHeight / 2) + "px";
    }

    window.addEventListener("mousemove", crosshairMove);

    document.body.style.cursor = "none";
