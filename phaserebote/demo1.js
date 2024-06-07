// Declaramos las variables
var w = 800;
var h = 400;
var jugador;
var fondo;

// Variables para las balas y naves
var bala, bala1, bala2, balaD = false, balaD1 = false, balaD2 = false, nave, nave1, terceraNave;
var balasJugador = [];
var balasNave = [];
var balasTerceraNave = [];

// Variables para el salto, despliegue menu, movimiento izquierda y derecha del personaje
var salto, menu, izquierda, derecha, saltosonido;

// Velocidad de las balas de las naves
var velocidadBala, velocidadBala1, velocidadBala2;
var despBala, despBala1, despBala2;
var estatusAire, estatuSuelo, estatusizquierda, estatusderecha;

// Variables para el entrenamiento de la red neuronal
var nnNetwork, nnEntrenamiento, nnSalida, datosEntrenamiento = [];
var modoAuto = false, eCompleto = false;

// Iniciamos el juego Phaser con el tamaño de las variables indicadas arriba (800x400) y definimos las funciones que están dentro de los paréntesis; preload, create, update, render)
var juego = new Phaser.Game(w, h, Phaser.CANVAS, '', { preload: preload, create: create, update: update, render: render });

// Esta función es la encargada de cargar lo referente a las imágenes, el fondo, de lo que hay en el juego; la bala, la nave, etc
function preload() {
    juego.load.image('fondo', 'assets/game/fondo.jpg');
    juego.load.spritesheet('mono', 'assets/sprites/altair.png', 32, 48);
    juego.load.image('nave', 'assets/game/ufo.png');
    juego.load.image('bala', 'assets/sprites/purple_ball.png');
    juego.load.image('menu', 'assets/game/menu.png');
    juego.load.audio('saltosonido', 'assets/audio/jump.mp3');
}

// Crear los objetos que van a estar dentro del juego
function create() {
    juego.physics.startSystem(Phaser.Physics.ARCADE);
    juego.physics.arcade.gravity.y = 800;
    juego.time.desiredFps = 30;

    fondo = juego.add.tileSprite(0, 0, w, h, 'fondo');
    nave = juego.add.sprite(w - 100, h - 75, 'nave'); // La nave que dispara en horizontal
    nave1 = juego.add.sprite(w - 790, h - 390, 'nave'); // La nave que dispara en vertical, hacía abajo
    terceraNave = juego.add.sprite(w - 50, 50, 'nave'); // Crear la tercera nave en la esquina superior derecha

    // El personaje
    jugador = juego.add.sprite(50, h - 75, 'mono');
    juego.physics.enable(jugador);
    jugador.body.collideWorldBounds = true;
    var corre = jugador.animations.add('corre', [8, 9, 10, 11]);
    jugador.animations.play('corre', 10, true);

    // Las balas de las naves
    bala = juego.add.sprite(w - 100, h, 'bala');
    juego.physics.enable(bala);
    bala.body.collideWorldBounds = true;

    bala1 = juego.add.sprite(w - 750, h - 350, 'bala');
    juego.physics.enable(bala1);
    bala1.body.collideWorldBounds = true;

    bala2 = juego.add.sprite(w - 50, 50, 'bala');
    juego.physics.enable(bala2);
    bala2.body.collideWorldBounds = true;

    // Menú de pausa
    pausaL = juego.add.text(w - 100, 20, 'Pausa', { font: '20px Arial', fill: '#fff' });
    pausaL.inputEnabled = true;
    pausaL.events.onInputUp.add(pausa, this);
    juego.input.onDown.add(mPausa, this);

    // Teclado
    salto = juego.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    izquierda = juego.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    derecha = juego.input.keyboard.addKey(Phaser.Keyboard.RIGHT);

    // Red neuronal
    nnNetwork = new synaptic.Architect.Perceptron(6, 6, 6, 4);
    nnEntrenamiento = new synaptic.Trainer(nnNetwork);
}

// Entrenamiento de la red neuronal
function enRedNeural() {
    nnEntrenamiento.train(datosEntrenamiento, { rate: 0.003, iterations: 10000, shuffle: true });
}

// Predicción utilizando la red neuronal
function datosDeEntrenamiento(param_entrada) {
    nnSalida = nnNetwork.activate(param_entrada);
    var aire = Math.round(nnSalida[0] * 100);
    var piso = Math.round(nnSalida[1] * 100);
    return nnSalida[0] >= nnSalida[1];
}

function datosDeEntrenamiento1(param_entrada) {
    nnSalida = nnNetwork.activate(param_entrada);
    var derecha = Math.round(nnSalida[2] * 100);
    var izquierda = Math.round(nnSalida[3] * 100);
    return nnSalida[2] >= nnSalida[3];
}

function datosDeEntrenamiento2(param_entrada) {
    nnSalida = nnNetwork.activate(param_entrada);
    var derecha = Math.round(nnSalida[2] * 100);
    var izquierda = Math.round(nnSalida[3] * 100);
    return nnSalida[3] >= nnSalida[2];
}

// Pausa el juego y muestra el menú de la pausa
function pausa() {
    juego.paused = true;
    menu = juego.add.sprite(w / 2, h / 2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
    jugador.body.velocity.x = 0;
    jugador.body.velocity.y = 0;
    jugador.position.x = 50;
}

// Lógica cuando pausamos el juego
function mPausa(event) {
    if (juego.paused) {
        var menu_x1 = w / 2 - 135, menu_x2 = w / 2 + 135,
            menu_y1 = h / 2 - 90, menu_y2 = h / 2 + 90;

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
            resetVariables1();
            resetVariables2();
            juego.paused = false;
        }
    }
}

// Reestablecer el estado del muñeco y las balas
function resetVariables() {
    jugador.body.velocity.x = 0;
    jugador.body.velocity.y = 0;
    bala.body.velocity.x = 0;
    bala.position.x = w - 100;
    balaD = false;
}

function resetVariables1() {
    jugador.body.velocity.x = 0;
    jugador.body.velocity.y = 0;
    bala1.body.velocity.y = 0;
    bala1.position.y = nave1.position.y;
    balaD1 = false;
}

function resetVariables2() {
    jugador.body.velocity.x = 0;
    jugador.body.velocity.y = 0;
    bala2.body.velocity.x = 0;
    bala2.position.x = terceraNave.position.x;
    bala2.position.y = terceraNave.position.y;
    balaD2 = false;
}

// Funciones de movimiento del personaje
function saltar() {
    jugador.body.velocity.y = -270;
}

function movIzquierda() {
    jugador.body.velocity.x = -120;
}

function movDerecha() {
    jugador.body.velocity.x = 100;
}

// Actualización del juego
function update() {
    fondo.tilePosition.x -= 1;

    // juego.physics.arcade.collide(bala, jugador, colisionH, null, this);
    // juego.physics.arcade.collide(bala1, jugador, colisionH, null, this);
    // juego.physics.arcade.collide(bala2, jugador, colisionH, null, this);

    estatuSuelo = 1;
    estatusAire = 0;
    estatusizquierda = 0;
    estatusderecha = 0;

    if (!jugador.body.onFloor()) {
        estatuSuelo = 0;
        estatusAire = 1;
    }

    // Disparar balas
    if (balaD == false) {
        disparo();
    }
    if (balaD1 == false) {
        disparo1();
    }
    if (balaD2 == false) {
        disparo2();
    }

    // Resetear balas
    if (bala.position.x <= 0) {
        resetVariables();
    }
    if (bala1.position.y >= 380) {
        resetVariables1();
    }
    if (bala2.position.x <= 0) {
        resetVariables2();
    }

    // Modo Manual
    if (modoAuto == false && salto.isDown && jugador.body.onFloor()) {
        saltar();
    } else if (modoAuto == false && izquierda.isDown) {
        estatusizquierda = 1;
        estatusderecha = 0;
        movIzquierda();
    } else if (modoAuto == false && derecha.isDown) {
        estatusizquierda = 0;
        estatusderecha = 1;
        movDerecha();
    }

    despBala = Math.floor(jugador.position.x - bala.position.x);
    despBala1 = Math.floor(jugador.position.x - bala1.position.x);
    despBala2 = Math.floor(jugador.position.x - bala2.position.x);

    if (modoAuto == true && bala.position.x > 0 && jugador.body.onFloor()) {
        if (datosDeEntrenamiento([despBala, velocidadBala, despBala1, velocidadBala1, despBala2, velocidadBala2])) {
            saltar();
        }
    }

    if (modoAuto == true && bala1.position.y > 0) { //0
        if (datosDeEntrenamiento1([despBala, velocidadBala, despBala1, velocidadBala1, despBala2, velocidadBala2])) {
            movDerecha();
        }
    }

    if (modoAuto == true && bala2.position.y > 0) {
        if (datosDeEntrenamiento2([despBala, velocidadBala, despBala1, velocidadBala1, despBala2, velocidadBala2])) {
            movIzquierda();
        }
    }

    if (modoAuto == false && bala.position.x > 0 && bala1.position.x > 0 && bala2.position.x > 0) {
        datosEntrenamiento.push({
            'input': [despBala, velocidadBala, despBala1, velocidadBala1, despBala2, velocidadBala2],
            'output': [estatusAire, estatuSuelo, estatusderecha, estatusizquierda]
        });
        console.log("Desplazamiento Bala: " + despBala + " Velocidad Bala: " + velocidadBala + " Salto: " + estatusAire + " Suelo: " + estatuSuelo + " DER: " + estatusderecha + " IZQ: " + estatusizquierda);
    }
}

// Función para el disparo de la primera nave
function disparo() {
    velocidadBala = -1 * velocidadRandom(300, 800);
    bala.body.velocity.y = 0;
    bala.body.velocity.x = velocidadBala;
    balaD = true;
}

// Función para el disparo de la segunda nave
function disparo1() {
    velocidadBala1 = -1 * velocidadRandom(300, 800);
    bala1.body.velocity.x = 0;
    bala1.body.velocity.y = velocidadBala1;
    balaD1 = true;
}

// Función para el disparo de la tercera nave
function disparo2() {
    velocidadBala2 = -1 * velocidadRandom(300, 800);
    bala2.body.velocity.y = 0;
    bala2.body.velocity.x = velocidadBala2;
    balaD2 = true;
}

// Función de colisión que detiene el juego y restablece todo
function colisionH() {
    pausa();
}

// Generador de velocidades aleatorias
function velocidadRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Renderizado del juego
function render() {
    // Agregar cualquier lógica de renderizado adicional aquí si es necesario
}

