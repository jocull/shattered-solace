// Insert game generation code here...

GameConditions = function() {
    if (tickleMode == true) {
        for (var i= 1; i < WORKSPACE.length; i++) {
            if (WORKSPACE[i] != null) {
                var item = WORKSPACE[i];
                if ( Math.sqrt( ((item.x + item.width / 2) - MOUSE_X)^2 + ((item.y + item.height / 2) - MOUSE_Y)^2) < 100 ) {
                    console.log("Tickling " + item.name);
                    var rand = Math.random();
                    if (rand > 0.5) {
                        item.vx = item.vx + (Math.random() * -1);
                    }
                    else {
                        item.vx = item.vx + Math.random();
                    }

                    rand = Math.random();
                    if (rand > 0.5) {
                        item.vy = item.vy + (Math.random() * -1);
                    }
                    else {
                        item.vy = item.vy + Math.random();
                    }
                }
            }
        }
    }

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

var flat = new Entity("Flat", 200, 20, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 + 300, Entity.KINEMATIC, "#000000", "#000000", 1, 0.5);
var deflector = new Entity("Deflector", 25, 25, VIEWPORT.width / 2 + 100, VIEWPORT.height / 2 + 200, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 1, null, -5, 5);

var flat2 = new Entity("Flat", 200, 20, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 10, Entity.KINEMATIC, "#000000", "#000000", 1, 0.5);
var slider1 = new Entity("Slider", 25, 25, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 35, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, 10, 0, 0, 9.8);
var slider3 = new Entity("Slider", 25, 25, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 10, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, 10, 0, 0, -9.8);
var comparison = new Entity("Slider", 25, 25, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 65, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, 10, 0);

var flat3 = new Entity("Flat", 200, 20, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 300, Entity.KINEMATIC, "#000000", "#000000", 1, 0.5);
var slider2 = new Entity("Slider", 25, 25, VIEWPORT.width / 2 - 50, VIEWPORT.height / 2 - 325, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, 0, 0, 0, 9.8);
var hammer = new Entity("Hammer", 25, 25, VIEWPORT.width / 2 - 100, VIEWPORT.height / 2 - 335, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, 10, 0);


var collider1 = new Entity("Collider A", 50, 100, VIEWPORT.width / 2 - 425, VIEWPORT.height / 2 - 50, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, 0, 5, 9.8);
var collider2 = new Entity("Collider B", 50, 100, VIEWPORT.width / 2 - 375, VIEWPORT.height / 2 + 25, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, 0, -5, -9.8);

var collider3 = new Entity("Collider C", 50, 100, VIEWPORT.width / 2 - 225, VIEWPORT.height / 2 - 50, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.01, null, 0, 0, 9.8);
var collider4 = new Entity("Collider D", 50, 100, VIEWPORT.width / 2 - 175, VIEWPORT.height / 2 + 25, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, 0, -5, -9.8);

var collider5 = new Entity("Collider E", 100, 50, VIEWPORT.width / 2 - 425, VIEWPORT.height / 2 - 250, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, 5, 0, 0, 3);
var collider6 = new Entity("Collider F", 100, 50, VIEWPORT.width / 2 - 375, VIEWPORT.height / 2 - 200, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, -10, 0, 0, -3);

var collider7 = new Entity("Collider G", 100, 50, VIEWPORT.width / 2 - 225, VIEWPORT.height / 2 - 250, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.3, null, 0, 0, 0, 9.8);
var collider8 = new Entity("Collider H", 100, 50, VIEWPORT.width / 2 - 175, VIEWPORT.height / 2 - 200, Entity.DYNAMIC, "#0000ff", "#000000", 0.5, 0.5, null, -5, 0, 0, -9.8);


/*
// Newton's Cradle Demo

var escape = new Entity("Escape", 50, 50, VIEWPORT.width / 2 + 25, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);

var middle1 = new Entity("Middle", 50, 50, VIEWPORT.width / 2 - 25, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);
var middle2 = new Entity("Middle", 50, 50, VIEWPORT.width / 2 - 75, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);
var middle3 = new Entity("Middle", 50, 50, VIEWPORT.width / 2 - 125, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);

var hammer = new Entity("Hammer", 50, 50, VIEWPORT.width / 2 - 225, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1, null, 3);
*/

CAMERA.target = slider1;

GRAVITY_Y = 0;
GRAVITY_X = 0;

// Start the Engine
new Engine();