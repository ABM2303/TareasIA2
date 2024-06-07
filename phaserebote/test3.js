// Configuración del juego
const config = {
    type: Phaser.AUTO,
    parent: 'phaser-example',
    backgroundColor: '#0072bc',
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var player, cursors, menu, pausaL;
var statusIzq, statusDer, statusArr, statusAba, statusQuietoh, statusQuietov;
var despBallx, despBally;
var nnNetwork, nnEntrenamiento, nnSalida, datosEntrenamiento = [];
var modoAuto = false, eCompleto = false;

function preload() {
    this.load.image('wizball', 'assets/sprites/wizball.png');
    this.load.image('menu', 'assets/game/menu.png');
}

function create() {
    player = this.add.rectangle(400, 300, 64, 64, 0xffffff);
    this.physics.add.existing(player, false);

    cursors = this.input.keyboard.createCursorKeys();

    player.body.setCollideWorldBounds(true);

    ball1 = this.physics.add.image(100, 240, 'wizball');
    ball1.setCircle(46);
    ball1.setCollideWorldBounds(true);
    ball1.setBounce(1);
    ball1.setVelocity(50);

    // Red neuronal
    nnNetwork = new synaptic.Architect.Perceptron(2, 2, 2, 6);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);

    // Añadir el texto de pausa
    pausaL = this.add.text(700, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.setInteractive({ useHandCursor: true }); 
    pausaL.on('pointerup', pausa, this); 

    this.input.on('pointerdown', mPausa, this); 
}

function enRedNeural() {
    nnEntrenamiento.train(datosEntrenamiento, { rate: 0.003, iterations: 10000, shuffle: true });
}
//Izquierda
function datosDeEntrenamiento(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1]);
    nnSalida = nnNetwork.activate(param_entrada);
    var izquierda = Math.round(nnSalida[0] * 100);
    var derecha = Math.round(nnSalida[1] * 100);
    var horizontal = Math.round(nnSalida[4] * 100);
    var vertical = Math.round(nnSalida[5] * 100);
    console.log("Valor ", "En Izquierda %: " + izquierda + " En Derecha %: " + derecha + " En Horizontal %: " + horizontal + " En Vertical %: " + vertical)
    return (nnSalida[0] >= nnSalida[1] && nnSalida[0] >= nnSalida[4] && nnSalida[1] >= nnSalida[4]);
}
//Derecha
function datosDeEntrenamiento1(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1]);
    nnSalida = nnNetwork.activate(param_entrada);
    var izquierda = Math.round(nnSalida[0] * 100);
    var derecha = Math.round(nnSalida[1] * 100);
    var horizontal = Math.round(nnSalida[4] * 100);
    var vertical = Math.round(nnSalida[5] * 100);
    console.log("Valor ", "En Izquierda %: " + izquierda + " En Derecha %: " + derecha + " En Horizontal %: " + horizontal + " En Vertical %: " + vertical)
    return (nnSalida[1] >= nnSalida[0] && nnSalida[0] >= nnSalida[4] && nnSalida[1] >= nnSalida[4]);
}

function datosDeEntrenamiento2(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1]);
    nnSalida = nnNetwork.activate(param_entrada);
    var Arriba = Math.round(nnSalida[2] * 100);
    var Abajo = Math.round(nnSalida[3] * 100);
    var horizontal = Math.round(nnSalida[4] * 100);
    var vertical = Math.round(nnSalida[5] * 100);
    console.log("Valor ", "Hacia Arriba %: " + Arriba + " Hacia abajo %: " + Abajo + " En Horizontal %: " + horizontal + " En Vertical %: " + vertical)
    return (nnSalida[2] >= nnSalida[3] && nnSalida[2] >= nnSalida[5] && nnSalida[3] >= nnSalida[5]);
}

function datosDeEntrenamiento3(param_entrada) {
    console.log("Entrada", param_entrada[0] + " " + param_entrada[1]);
    nnSalida = nnNetwork.activate(param_entrada);
    var Arriba = Math.round(nnSalida[2] * 100);
    var Abajo = Math.round(nnSalida[3] * 100);
    var horizontal = Math.round(nnSalida[4] * 100);
    var vertical = Math.round(nnSalida[5] * 100);
    console.log("Valor ", "Hacia Arriba %: " + Arriba + " Hacia abajo %: " + Abajo + " En Horizontal %: " + horizontal + " En Vertical %: " + vertical)
    return (nnSalida[3] >= nnSalida[2] && nnSalida[2] >= nnSalida[5] && nnSalida[3] >= nnSalida[5]);
}

function pausa() {
    game.paused = true;
    menu = this.add.sprite(400, 300, 'menu');
    menu.setOrigin(0.5, 0.5);
    player.body.setVelocity(0, 0);
    player.setPosition(50, player.y);
}

function mPausa(event) {
    if (game.paused) {
        var menu_x1 = 800 / 2 - 135, menu_x2 = 800 / 2 + 135,
            menu_y1 = 600 / 2 - 90, menu_y2 = 600 / 2 + 90;

        var mouse_x = event.x,
            mouse_y = event.y;

        if (mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2) {
            if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 && mouse_y <= menu_y1 + 90) {
                eCompleto = false;
                datosEntrenamiento = [];
                modoAuto = false;
            } else if (mouse_x >= menu_x1 && mouse_x <= menu_x2 && mouse_y >= menu_y1 + 90 && mouse_y <= menu_y2) {
                if (!eCompleto) {
                    enRedNeural();
                    eCompleto = true;
                }
                modoAuto = true;
            }

            menu.destroy();
            resetVariables();
            game.paused = false;
        }
    }
}

function resetVariables() {
    player.body.position.x = 400;
    player.body.position.y = 300;
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
    ball1.body.position.x = 300;
}

function update() {
    statusQuietoh = 1;
    statusQuietov = 1;
    statusArr = 0;
    statusDer = 0;
    statusIzq = 0;
    statusAba = 0;

    this.physics.world.collide(ball1, player, colisionH, null, this);

    player.body.setVelocity(0);

    if (!modoAuto && cursors.left.isDown) {
        statusQuietoh = 0;
        statusQuietov = 1;
        statusIzq = 1;
        player.body.setVelocityX(-300);
    } else if (!modoAuto && cursors.right.isDown) {
        statusQuietoh = 0;
        statusQuietov = 1;
        statusDer = 1;
        player.body.setVelocityX(300);
    }

    if (!modoAuto && cursors.up.isDown) {
        statusQuietoh = 1;
        statusQuietov = 0;
        statusArr = 1;
        player.body.setVelocityY(-300);
    } else if (!modoAuto && cursors.down.isDown) {
        statusQuietoh = 1;
        statusQuietov = 0;
        statusAba = 1;
        player.body.setVelocityY(300);
    }

    despBallx = Math.floor(player.x - ball1.x);
    despBally = Math.floor(player.y - ball1.y);

    if (modoAuto) {
        // Iazquierda
        if (datosDeEntrenamiento([despBallx, despBally])) {
            player.body.setVelocityX(-300);
        }
        //Derecha
        if (datosDeEntrenamiento1([despBallx, despBally])) {
            player.body.setVelocityX(300);
        }
        //Arriba
        if (datosDeEntrenamiento2([despBallx, despBally])) {
            player.body.setVelocityY(-300);
        }
        //Abajo
        if (datosDeEntrenamiento3([despBallx, despBally])) {
            player.body.setVelocityY(300);
        }
    }

    if (!modoAuto) {
        datosEntrenamiento.push({
            'input': [despBallx, despBally],
            'output': [statusIzq, statusDer, statusArr, statusAba, statusQuietoh, statusQuietov]
        });
        console.log("Desplazamiento en X: " + despBallx + " Desplazamiento en Y: " + despBally + " Izquierda: " + statusIzq + " Derecha: " + statusDer + " Arriba: " + statusArr + " Abajo: " + statusAba + " QuietoHor: " + statusQuietoh + " QuietoVer: " + statusQuietov);
    }
}

function colisionH() {
    pausa.call(this);
}