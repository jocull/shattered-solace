// Insert game generation code here...
var toggle;
GameConditions = function() {

    if (Math.abs(hammer.vx) > Math.abs(escape.vx)) {
        if (toggle == 0 || toggle == null) {
            toggle = 1;
            CAMERA.scrollTo(0, 0, 75, hammer);
        }
    }
    if (Math.abs(escape.vx) > Math.abs(hammer.vx)) {
        if (toggle == 1) {
            toggle = 0;
            CAMERA.scrollTo(0, 0, 75, escape);
        }
    }
    if (escape.x > VIEWPORT.width / 2 + 125 - escape.width) {
        escape.vx = escape.vx -1;
    }
    if (hammer.x < VIEWPORT.width / 2 - 225) {
        hammer.vx = hammer.vx * -1;
    }
    //console.log(toggle);
};

// Newton's Cradle Demo

var escape = new Entity("Escape", 50, 50, VIEWPORT.width / 2 + 25, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);

var middle1 = new Entity("Middle", 50, 50, VIEWPORT.width / 2 - 25, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);
var middle2 = new Entity("Middle", 50, 50, VIEWPORT.width / 2 - 75, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);
var middle3 = new Entity("Middle", 50, 50, VIEWPORT.width / 2 - 125, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1);

var hammer = new Entity("Hammer", 50, 50, VIEWPORT.width / 2 - 225, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1, 0.5, null, 3);

CAMERA.focusX = hammer.x + hammer.width / 2;
CAMERA.focusY = hammer.y + hammer.height / 2;
CAMERA.target = hammer;

GRAVITY_Y = 0;
GRAVITY_X = 0;

// Start the Engine
new Engine();