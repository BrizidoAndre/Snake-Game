const modal = document.querySelector('.modal')
let formLogin = document.getElementById('form-login');
let modalWelcome = document.getElementById('welcome')
let btnWelcome = document.getElementById('btn-welcome')
let modalStartGame = document.getElementById('modal-start-game')
let btnStartGame = document.getElementById('btn-start-game');
let containerGame = document.getElementById(`game`)
let errorMessage = document.getElementById('error-message')
let containerRank = document.getElementById('rank');
let tableRank = document.getElementById('table');
let btnPlayAgain = document.getElementById('btn-playAgain');
let btnMenu = document.getElementById('btn-menu');
let usernameGlobal;


// quando o usuário apera o botão
btnPlayAgain.addEventListener('click', () => {
    containerRank.style.display = 'hide';
    containerGame.style.display = 'flex';
    gameStart();
})
btnMenu.addEventListener('click', () => {
    containerRank.style.display = 'hide';
    formLogin.classList.remove('hide');
    gameStart();
})

// when the first form is submiting
formLogin.onsubmit = async (event) => {
    event.preventDefault();
    let username = document.getElementById('username')
    let password = document.getElementById('password')

    formLogin.classList.add('hide')
    usernameGlobal = username.value
    showWelcome()
}

// from login to welcome
function showWelcome() {
    modalWelcome.classList.remove('hide')
    let usernameShow = document.getElementById('username-show')
    usernameShow.textContent = usernameGlobal;
}

// from welcome to two buttons modal
btnWelcome.addEventListener('click', () => {
    modalWelcome.classList.add('hide');
    modalStartGame.classList.remove('hide')
})

// from two buttons modal to game
btnStartGame.addEventListener('click', () => {
    modalStartGame.classList.add('hide')
    modal.classList.add('hide')
    containerGame.classList.remove('hide')
    containerGame.style.display = 'flex'
    gameStart()
})


async function renderRank() {
    containerRank.style.display = 'flex'

    let data = [];

    data.sort((a, b) => b.points - a.points)

    let list = [];

    for (let i = 0; i < 5; i++) {
        let rank = data[i];
        list.push('<tr>' +
            `<td>${i + 1}</td>` +
            `<td>${rank.username}</td>` +
            `<td>${rank.points}</td>` +
            `<td>${rank.fruits}</td>` +
            `<td>${rank.medals}</td>` +
            `<td>${rank.trophy}</td>` +
            '</tr>')
    }

    tableRank.innerHTML = list.join('')
}

//starting the canvas game

const canvas = document.getElementById('canvas')
const context = canvas.getContext('2d');
// html elements for showing points
const pointText = document.getElementById('point');
const healthyText = document.getElementById('healthy');
const notHealthyText = document.getElementById('not-healthy');
const levelText = document.getElementById('level');
// all colors possible
const colors = [{
    primary: '#0d77c5', secondary: '#0d99ff'
}, {
    primary: '#ffa629', secondary: '#ffcd29'
}, {
    primary: '#3cb2bd', secondary: '#4ce2f0'
}, {
    primary: '#9546bd', secondary: '#d8a2f2'
}, {
    primary: '#eeb7b7', secondary: '#f4e5e5'
}]

/* unit size */
const unitSize = 30;
const gameWidth = unitSize * 17
const gameHeight = unitSize * 15;
canvas.width = gameWidth;
canvas.height = gameHeight;

let running = 0;
let xVelocity = unitSize;
let yVelocity = 0;
let speedGame = 150;
let snake = [{
    xPosition: unitSize * 4, yPosition: unitSize
}, {
    xPosition: unitSize * 3, yPosition: unitSize
}, {
    xPosition: unitSize * 2, yPosition: unitSize
}, {
    xPosition: unitSize, yPosition: unitSize
},];
let snakeColor = colors[0];
let snakeFattiness = 50;
let goodFood = []
let badFood = [];
let score = {
    unit: 0, points: 0, medal: 0, trophy: 0, healthy: 0, notHealthy: 0, level: 1
}

// when the user press a key
window.addEventListener('keydown', event => {
    const up = xVelocity === 0 && yVelocity < 0;
    const down = xVelocity === 0 && yVelocity > 0;
    const right = xVelocity > 0 && yVelocity === 0;
    const left = xVelocity < 0 && yVelocity === 0;

    let pressedKey = event.key;
    if (pressedKey === 'ArrowDown' && !up) {
        yVelocity = unitSize;
        xVelocity = 0;
    }
    if (pressedKey === 'ArrowUp' && !down) {
        yVelocity = -unitSize;
        xVelocity = 0;
    }
    if (pressedKey === 'ArrowLeft' && !right) {
        yVelocity = 0;
        xVelocity = -unitSize;
    }
    if (pressedKey === 'ArrowRight' && !left) {
        yVelocity = 0;
        xVelocity = unitSize;
    }

    console.log(goodFood, gameWidth, gameHeight)
})

// quando o jogo começa reiniciando todas as pontuações e mudanças de cor, estado ou tamanho
function gameStart() {
    containerRank.style.display = 'none'
    running = true;
    score = {
        unit: 0, points: 0, medal: 0, trophy: 0, healthy: 0, notHealthy: 0, level: 1
    };
    snake = [{
        xPosition: unitSize * 4, yPosition: unitSize
    }, {
        xPosition: unitSize * 3, yPosition: unitSize
    }, {
        xPosition: unitSize * 2, yPosition: unitSize
    }, {
        xPosition: unitSize, yPosition: unitSize
    },];

    badFood = [];
    goodFood = [];
    xVelocity = unitSize;
    yVelocity = 0;
    snakeColor = colors[0];
    snakeFattiness = 50;
    speedGame = 150;
    drawSnake()
    createBadFood()
    createGoodFood()
    drawFood()
    nextTick()
}

// uma funçao que repete e limpa o quadro e desenha a cobra dando a impressão de animação
function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard()
            moveSnake();
            drawSnake();
            drawFood();
            checkGameOver()
            nextTick();
        }, speedGame)
    }
}

// quando uma cobra se move
// essa funnção também verifica se a cobra bateu em uma comida
function moveSnake() {
    snake.unshift({
        xPosition: snake[0].xPosition + xVelocity, yPosition: snake[0].yPosition + yVelocity
    })

    let hasEaten = true;

    // verificando se a cobra comeu comida boa
    goodFood.forEach((food, index) => {
        if (snake[0].xPosition === food.xPosition && snake[0].yPosition === food.yPosition) {
            goodFood[index] = {
                xPosition: Math.floor(Math.random() * 17) * unitSize,
                yPosition: Math.floor(Math.random() * 15) * unitSize
            }
            hasEaten = false;
            increasePoints();

            score.healthy++;
            healthyText.textContent = score.healthy;
        }
    })

    // verificando se a cobra comeu comida ruim
    badFood.forEach((food, index) => {
        if (snake[0].xPosition === food.xPosition && snake[0].yPosition === food.yPosition) {
            badFood[index] = {
                xPosition: Math.floor(Math.random() * 17) * unitSize,
                yPosition: Math.floor(Math.random() * 15) * unitSize
            }
            speedGame -= 5;
            if (snakeFattiness > 0) {
                snakeFattiness -= 5;
            }

            score.notHealthy++;
            notHealthyText.textContent = score.notHealthy;
        }
    })

    // se a cobra comeu uma comida saudável então ela não perde essa última borda
    if (hasEaten) {
        snake.pop();
    }
}

// desenhando a cobra após ela mudar de lugar
function drawSnake() {
    snake.forEach((snakePart, index) => {
        context.beginPath();
        context.roundRect(snakePart.xPosition, snakePart.yPosition, unitSize, unitSize, snakeFattiness)
        index % 2 === 0 ? context.fillStyle = snakeColor.primary : context.fillStyle = snakeColor.secondary;
        context.fill();
        context.closePath();
    })
}

// criando uma comida boa com base no nivel
function createGoodFood() {
    for (let i = 0; i < score.level; i++) {
        goodFood.push({
            xPosition: Math.floor(Math.random() * 17) * unitSize, yPosition: Math.floor(Math.random() * 15) * unitSize
        })
    }
}

// criando uma comida ruim com base no nível
function createBadFood() {
    for (let i = 0; i < score.level; i++) {
        badFood.push({
            xPosition: Math.floor(Math.random() * 17) * unitSize, yPosition: Math.floor(Math.random() * 15) * unitSize
        })
    }
}

// função para aumentar uma pontuação
function increasePoints() {
    score.unit++;
    // se a unidade é divisivel por 3
    if (score.unit % 3 === 0) {
        score.points += 10;
        pointText.textContent = score.points;
        // se os pontos são divisíveis por 50 e diferente de 0
        if (score.points % 50 === 0 && score.points > 0) {
            score.medal++;
            score.level++;
            if (colors[score.level - 1]) {
                snakeColor = colors[score.level - 1];
            }
            // se as medalhas são divisiveis de 10 e diferentes de 0
            if (score.medal % 10 === 0 && score.medal > 0) {
                score.trophy++;
            }
        }
    }
}

//  função para desenhar a cobra após ela se mover
function drawFood() {
    goodFood.forEach(food => {
        let image = new Image();
        image.src = './apple-work.jpg'
        context.drawImage(image, food.xPosition, food.yPosition, unitSize, unitSize)
    })
    badFood.forEach(food => {
        let image = new Image();
        image.src = './hamburguer.png'
        context.drawImage(image, food.xPosition, food.yPosition, unitSize, unitSize)
    })
}

// função para limpar o quadro
function clearBoard() {
    context.clearRect(0, 0, gameWidth, gameHeight)

    let color = true;

    for (let i = 0; i < 17; i++) {
        for (let n = 0; n < 15; n++) {
            if (color) {
                context.fillStyle = '#6fff6f'
            } else {
                context.fillStyle = '#0d600d'
            }
            context.fillRect(i * unitSize, n * unitSize, unitSize, unitSize);
            color = !color;
        }
    }
}

// verificando se a cobra bateu na borda ou nela mesma
function checkGameOver() {
    if (snake[0].xPosition < 0 || snake[0].yPosition < 0 || snake[0].xPosition >= gameWidth || snake[0].yPosition >= gameHeight) {
        finishGame()
    }

    for (let i = 1; i < snake.length; i++) {
        let snakePart = snake[i];
        if (snake[0].xPosition === snakePart.xPosition && snake[0].yPosition === snakePart.yPosition) {
            finishGame()
        }
    }

}

// acabando o jogo
function finishGame() {
    running = false;
    context.font = '50px Comic Sans MS';
    context.textAlign = 'center';
    context.fillStyle = 'red'
    context.fillText('Você perdeu!', gameWidth / 2, gameHeight / 2)
    setTimeout(() => {
        containerGame.style.display = 'none'
        renderRank();
    }, 2000)
}
