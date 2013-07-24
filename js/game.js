// Insert game generation code here...

GameConditions = function() {
    //console.log("It works!");
};

//new Entity("Block", 300, 50, Math.random() * VIEWPORT.width - 25, Math.random() * VIEWPORT.height - 25, Entity.DYNAMIC,"#000000", "#000000", 0.7);
var Player = new Entity("Player", 35 * 2, 75 * 2, VIEWPORT.width / 2 - 16, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 0.3, "textures/Man.png", 0, 0, 0, 0);

DEFLECTION = false;

for (var i = 1; i < 25; i++) {
    new Entity("Debris", 50, 50, Math.random() * VIEWPORT.width, Math.random() * VIEWPORT.height, Entity.DYNAMIC, "#000000", "#000000", 0.5, null, Math.random() * 20, Math.random() * 20, 0, 0);
}

var top = new Entity("Top", VIEWPORT.width -30, 30, 0, -30, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);
var bottom = new Entity("Bottom", VIEWPORT.width - 30, 30, 0, VIEWPORT.height - 30, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);
var left = new Entity("Left", 30, VIEWPORT.height - 30, -30, 0, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);
var right = new Entity("Right", 30, VIEWPORT.height - 30, VIEWPORT.width - 30, 0, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);


CAMERA.target = Player;

GRAVITY_Y = 9.8;

// Start the Engine
new Engine();