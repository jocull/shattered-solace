// Insert game generation code here...

GameConditions = function() {
    /*
    if (escape.x > VIEWPORT.width / 2 + 125 - escape.width) {
        escape.vx = escape.vx -1;
    }
    if (hammer.x < VIEWPORT.width / 2 - 225) {
        hammer.vx = hammer.vx * -1;
    }
    */
};

//new Entity("Block", 300, 50, Math.random() * VIEWPORT.width - 25, Math.random() * VIEWPORT.height - 25, Entity.DYNAMIC,"#000000", "#000000", 0.7);
//var Player = new Entity("Player", 35 * 2, 75 * 2, VIEWPORT.width / 2 - 16, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 0.3, "textures/Man.png", 0, 0, 0, 0);

DEFLECTION = false;

/*
for (var i = 1; i < 25; i++) {
    new Entity("Debris", 50, 50, Math.random() * VIEWPORT.width, Math.random() * VIEWPORT.height, Entity.DYNAMIC, "#000000", "#000000", 0.5, null, Math.random() * 20, Math.random() * 20, 0, 0);
}
*/

//var top = new Entity("Top", VIEWPORT.width -30, 30, 0, -30, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);
//var bottom = new Entity("Bottom", VIEWPORT.width - 30, 30, 0, VIEWPORT.height - 30, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);
//var left = new Entity("Left", 30, VIEWPORT.height - 30, -30, 0, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);
//var right = new Entity("Right", 30, VIEWPORT.height - 30, VIEWPORT.width - 30, 0, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);

var flat = new Entity("Flat", 200, 20, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 + 300, Entity.KINEMATIC, "#000000", "#000000", 1);
var deflector = new Entity("Deflector", 25, 25, VIEWPORT.width / 2 + 100, VIEWPORT.height / 2 + 200, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, null, -5, 5);

var flat2 = new Entity("Flat", 200, 20, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 10, Entity.KINEMATIC, "#000000", "#000000", 1);
var slider1 = new Entity("Slider", 25, 25, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 35, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, null, 10, 0, 0, 9.8);
var comparison = new Entity("Slider", 25, 25, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 65, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, null, 10, 0);

var flat3 = new Entity("Flat", 200, 20, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 300, Entity.KINEMATIC, "#000000", "#000000", 1);
var slider2 = new Entity("Slider", 25, 25, VIEWPORT.width / 2 - 50, VIEWPORT.height / 2 - 325, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, null, 0, 0, 0, 9.8);
var hammer = new Entity("Hammer", 25, 25, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 335, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, null, 10, 0);


var collider1 = new Entity("Collider A", 50, 100, VIEWPORT.width / 2 - 225, VIEWPORT.height / 2 - 175, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, null, 0, 5);
var collider2 = new Entity("Collider B", 50, 100, VIEWPORT.width / 2 - 175, VIEWPORT.height / 2 + 125, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, null, 0, -5);

/*
// Newton's Cradle Demo

var escape = new Entity("Escape", 50, 50, VIEWPORT.width / 2 + 25, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);

var middle1 = new Entity("Middle", 50, 50, VIEWPORT.width / 2 - 25, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);
var middle2 = new Entity("Middle", 50, 50, VIEWPORT.width / 2 - 75, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);
var middle3 = new Entity("Middle", 50, 50, VIEWPORT.width / 2 - 125, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);

var hammer = new Entity("Hammer", 50, 50, VIEWPORT.width / 2 - 225, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1, null, 3);
*/

//CAMERA.target = middle2;

GRAVITY_Y = 0;

// Start the Engine
new Engine();