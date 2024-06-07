var w=800; // variable de anchura
var h=400; // variable de altura
//Crea un objeto de la clase Phaser posiblemente para que genere el juego en la pagina
var game = new Phaser.Game(w, h, Phaser.CANVAS, 'phaser-game', { preload: preload, create: create, update: update, render: render });

//Funcion precargar
function preload() {
    // Carga el fondo del juego
    game.load.image('background', 'assets/game/fondo.jpg');
    // carga la imagen con los sprites del personaje recortando cada 32 de ancho y 48 de alto
    game.load.spritesheet('player', 'assets/sprites/player.png',32 ,48);
    // carga la imagen de el ovni
    game.load.image('ufo', 'assets/game/ufo.png');
    // carga la imagen de las balas
    game.load.image('bullet', 'assets/sprites/purple_ball.png');
    // carga la imagen del menu
    game.load.image('menu', 'assets/game/menu.png');

}
// Todos los elementos del juego
var player;
var bg;

var bullet;
//Esta desactivado que el Ovni dispare
var bullet_fired=false;
var ufo;

var jumpButton;

var menu;

var bullet_speed;
var bullet_displacement;
var stay_on_air;
var stay_on_floor;

var nn_network;
var nn_trainer;
var nn_output;
var trainingData=[];
// El modo automatico y entrenamiento esta desactivado
var auto_mode = false;
var training_complete=false;

//Funcion que va generando el juego
function create() {
    //Inicia la generacion del juego
    game.physics.startSystem(Phaser.Physics.ARCADE);
    // La gravedad de y es de 800
    game.physics.arcade.gravity.y = 800;
    // A que velocidad va que son 30 frames por segundo
    game.time.desiredFps = 30;
    // bg(background) ingresa el sprite del fondo del juego
    bg = game.add.tileSprite(0, 0, w, h, 'background');
    // ingresa el sprite de ufo (ovni)
    ufo = game.add.sprite(w-100, h-70, 'ufo');
    // ingresa el sprite de las balas
    bullet = game.add.sprite(w-100, h, 'bullet');
    // ingresa el sprite del jugador
    player = game.add.sprite(50, h, 'player');

    //se activan las fisicas del juego al objeto player
    game.physics.enable(player);
    //Estan activadas las colisiones con los limites de la pantallas
    player.body.collideWorldBounds = true;
    var run = player.animations.add('run');
    //Se reproduce la animacion del jugador corriendo
    player.animations.play('run', 10, true);
    // se activan las fisicas y las colisiones al objeto bullet
    game.physics.enable(bullet);
    bullet.body.collideWorldBounds = true;
    // Ingresa el boton de pausa a la pantalla aunque es una etiqueta
    pause_label = game.add.text(w - 100, 20, 'Pause', { font: '20px Arial', fill: '#fff' });
    pause_label.inputEnabled = true;
    pause_label.events.onInputUp.add(pause, self);
    game.input.onDown.add(un_pause, self);
    // el boton de saltar esta asignado a la barra espaciadora del teclado
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    //Son parte de las redes neuronales creando una percepcion
    nn_network =  new synaptic.Architect.Perceptron(2, 6, 6, 2);
    // se entrena a la inteligencia artificial mediante la red neuronal que se genero anteriormente
    nn_trainer = new synaptic.Trainer(nn_network); // Create trainer

    
}
// funcion para entrenar a la inteligencia artificial o redes neuronales
function train_nn(){

    nn_trainer.train(trainingData, {
        rate: 0.0003,
        iterations: 10000,
        shuffle: true
    });

}
// Funcion para obtener los datos de entrada para el entrenamiento de la red neuronal o inteligencia artificial
function get_op_from_trainedData(input_param){

    console.log("Entradas",input_param[0]+" "+input_param[1]);
    nn_output = nn_network.activate(input_param);
    var on_air=Math.round( nn_output[0]*100 );
    var on_floor=Math.round( nn_output[1]*100 );
    console.log("Valores ","Aire %: "+ on_air + " Suelo %: " + on_floor );
    return nn_output[0]>=nn_output[1];
}
// Pausa el juego y muestra el menu
function pause(){
    game.paused = true;
    menu = game.add.sprite(w/2,h/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);
}

// Funcionamiento del menu de pausa
function un_pause(event){
    if(game.paused){
        // Calculate the corners of the menu
        var menu_x1 = w/2 - 270/2, menu_x2 = w/2 + 270/2,
            menu_y1 = h/2 - 180/2, menu_y2 = h/2 + 180/2;

        var mouse_x = event.x  ,
            mouse_y = event.y  ;

        if(mouse_x > menu_x1 && mouse_x < menu_x2 && mouse_y > menu_y1 && mouse_y < menu_y2 ){
            // dar clic a la opcion manual mode
            if(mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1 && mouse_y <=menu_y1+90){
                training_complete=false;
                trainingData = [];
                auto_mode = false;
            }
            // dar clic a la opcion auto mode
            else if (mouse_x >=menu_x1 && mouse_x <=menu_x2 && mouse_y >=menu_y1+90 && mouse_y <=menu_y2) {
                if(!training_complete) {
                    console.log("","Entrenamiento "+ trainingData.length +" valores" );
                    train_nn();
                    training_complete=true;
                }
                auto_mode = true;
            }

            menu.destroy();
            reset_state_variables();
            game.paused = false;

        }
    }
}

// reinicion del juego
function reset_state_variables(){
    //reinicia la posicion y velocidad del jugador y las balas
    player.body.velocity.x=0;
    player.body.velocity.y=0;
    bullet.body.velocity.x = 0;

    bullet.position.x = w-100;
    player.position.x=50;

    bullet_fired=false;

}
// funcion para que el jugador salte y se mueva el sprite
function jump(){
    player.body.velocity.y = -270;
}

function right(){
    player.body.velocity.x = 50;
}

function update() {

    bg.tilePosition.x -= 1; //movimiento del fondo del juego
    // colision entre jugador y bala
    game.physics.arcade.collide(bullet, player, collisionHandler, null, this);
    stay_on_floor=1;
    stay_on_air = 0;

    if(!player.body.onFloor()) {
        stay_on_floor = 0;
        stay_on_air = 1;
    }
    //Desplazamiento de la vala
    bullet_displacement = Math.floor( player.position.x - bullet.position.x );

    // Manual Jump
    if( auto_mode==false          &&
        jumpButton.isDown         &&
        player.body.onFloor()     ){
        jump();
    }

    // Auto Jump
    if( auto_mode==true           &&
        bullet.position.x>0       &&
        player.body.onFloor()     ){

        if( get_op_from_trainedData( [bullet_displacement , bullet_speed] )  ){
            jump();
        }
    }

    // Repeated Fire
    if( bullet_fired==false ){
        fire();
    }

    //Reload bullet
    if( bullet.position.x <= 0  ){
        reset_state_variables();
    }

    // Collecting Training Set
    if( auto_mode==false      &&
        bullet.position.x > 0 ){

        trainingData.push({
                'input' :  [bullet_displacement , bullet_speed],
                'output':  [stay_on_air , stay_on_floor ]  // jump now , stay on floor
        });

        console.log("Desplazamiento Bala, Velocidad Bala, Estado del Salto Aire, Estado del Salto Suelo: ",
            bullet_displacement + " " +bullet_speed + " "+
            stay_on_air+" "+  stay_on_floor
        );

    }


}
// disparar la bala que valocidad puede ser de 300 a 800
function fire(){
    bullet_speed =  -1 * getRandomSpeed(300,800);
    bullet.body.velocity.y = 0 ;
    bullet.body.velocity.x = bullet_speed ;
    bullet_fired=true;
}
// el jugador al chocar con la bala el juego se pausa automaticamente
function collisionHandler(){
    pause();
}
function getRandomSpeed(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function render () {

}