// Global Constants

// If an object's velocity is nearing this number, then its
// velocity will be set to 0.
var SETTLE_POINT = 0.001;

// The world's X and Y gravity values.
// Measured in seconds, i.e., 10 pixels per second.
// Positive values will move right or down.
// Negative values will move left or up.
var GRAVITY_X = 0.0;
var GRAVITY_Y = 1;

var WORKSPACE = [];

// Engine Output

var VIEWPORT = document.getElementById("viewport");
var VIEWPORT_CONTEXT = VIEWPORT.getContext("2d");
var BUFFER = document.createElement("canvas");
var BUFFER_CONTEXT = BUFFER.getContext("2d");

BUFFER.width = VIEWPORT.width;
BUFFER.height = VIEWPORT.height;

var BACKGROUND_COLOR = "#333366";

// A shortcut for drawing methods
var view = BUFFER_CONTEXT;

var Entity = function(name, width, height, x, y, type, fillColor, outlineColor, elasticity, texture, vx, vy, ax, ay) {

    this.name = name || "Object";
    this.width = width || 50;
    this.height = height || 50;
    this.x = x || 0;
    this.y = y || 0;
    this.vx = vx || 0;
    this.vy = vy || 0;
    this.ax = ax || 0;
    this.ay = ay || 0;
    this.mass = this.width * this.height;
    this.elasticity = elasticity || 0.2;
    this.fillColor = fillColor || "#ffffff";
    this.outlineColor = outlineColor || "#000000";
    this.texture = texture || null;
    this.type = type || Entity.DYNAMIC;
    //this.collideType = collideType || Entity.DISPLACE;

    WORKSPACE.push(this);

};

// Kinematic entities are not affected by gravity,
// and will not allow the solver to solve these elements.
// Collides, but isn't affected by collisions or gravity.
Entity.KINEMATIC = "kinematic";

// Dynamic entities will constantly be changing and are
// affected by all aspects of the physics engine
Entity.DYNAMIC = "dynamic";

// Static entities are not affected by collisions
// and do not move.
Entity.STATIC = "static";

// Phantom entities do not collide with other objects
// and may move.
Entity.PHANTOM = "phantom";

/*
// The displace resolution will only move an entity outside
// of the space of the other and zero the velocity in that direction
Entity.DISPLACE = "displace";

// The elastic resolution will displace and also bounce the
// colliding entity off by reducing the velocity by its
// restitution coefficient
Entity.ELASTIC = "elastic";
*/

var DrawFrame = function() {

    // Clear the view
    view.fillStyle = BACKGROUND_COLOR;
    view.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);

    for (var i = 0; i < WORKSPACE.length; i++){

        if (WORKSPACE[i] != null) {
            var item = WORKSPACE[i];

            var trail = function(item, speed, alpha, offset) {
                if (Math.abs(item.vx) + Math.abs(item.vy) > speed) {

                    view.globalAlpha = alpha;

                    var offsetx = item.vx * offset;
                    var offsety = item.vy * offset;

                    view.beginPath();

                    view.moveTo(item.x - offsetx, item.y - offsety);
                    view.lineTo(item.x - offsetx, item.y + item.height - offsety);
                    view.lineTo(item.x + item.width - offsetx, item.y + item.height - offsety);
                    view.lineTo(item.x + item.width - offsetx, item.y - offsety);
                    view.lineTo(item.x - offsetx, item.y - offsety);
                    view.closePath();

                    view.fillStyle = item.fillColor;
                    //view.strokeStyle = item.outlineColor;
                    view.fill();
                    //view.stroke();

                    view.globalAlpha = 1.0;
                }
            };

            if (item.texture == null){

                // Probably putting too much emphasis on these...
                trail(item, 32, 0.3, 0.1);
                trail(item, 128, 0.2, 0.2);
                trail(item, 512, 0.1, 0.3);

                view.beginPath();

                view.moveTo(item.x, item.y);
                view.lineTo(item.x, item.y + item.height);
                view.lineTo(item.x + item.width, item.y + item.height);
                view.lineTo(item.x + item.width, item.y);
                view.lineTo(item.x, item.y);
                view.closePath();

                view.fillStyle = item.fillColor;
                view.strokeStyle = item.outlineColor;
                view.fill();
                view.stroke();


            }
            else{
                view.drawImage(item.texture, item.x, item.y, item.width, item.height);
            }
        }
    }
};

var Physics = function(delta) {

    for (var i = 0; i < WORKSPACE.length; i++) {

        if (WORKSPACE[i] != null) {
            var item = WORKSPACE[i];

            var Settle = function() {
                if (Math.abs(item.ax) <= SETTLE_POINT) {
                    item.ax = 0;
                }
                if (Math.abs(item.ay) <= SETTLE_POINT) {
                    item.ay = 0;
                }
                if (Math.abs(item.vx) <= SETTLE_POINT) {
                    item.vx = 0;
                }
                if (Math.abs(item.vy) <= SETTLE_POINT) {
                    item.vy = 0;
                }
            }();
            /*
             var Collisions = function() {
             for (var i2 = 0; i2 < WORKSPACE.length; i++) {
             var collider = WORKSPACE[i2];
             if (collider != item) {
             // Collision parameters
             }
             }

             }();
             */
            var Velocity = function() {
                item.vx = item.ax * delta + item.vx + GRAVITY_X;
                item.vy = item.ay * delta + item.vy + GRAVITY_Y;
                //alert("VY "+item.vy);
            }();

            var Position = function() {
                item.x = item.vx * delta + item.x;
                item.y = item.vy * delta + item.y;
            }();
        }
     }
};


(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
            || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


document.onkeydown = function(e) {
    alert(e);
    //alert(document.keyCode);
};

document.onkeydown = function(e) {
    var event = window.event ? window.event : e;
    var key = event.keyCode;
    console.log(key);
    if (key == "87" || key == "38") {
        // W or UP key
    }
    if (key == "65" || key == "37") {
        // A or LEFT key
    }
    if (key == "83" || key == "40") {
        // S or DOWN key
    }
    if (key == "68" || key == "39") {
        // D or RIGHT key
    }
    if (key == "32") {
        // Spacebar
        SLOW_TIME = true;
    }
};

document.onkeyup = function(e) {
    var event = window.event ? window.event : e;
    var key = event.keyCode;
    console.log(key);
    if (key == "87" || key == "38") {
        // W or UP key
    }
    if (key == "65" || key == "37") {
        // A or LEFT key
    }
    if (key == "83" || key == "40") {
        // S or DOWN key
    }
    if (key == "68" || key == "39") {
        // D or RIGHT key
    }
    if (key == "32") {
        // Spacebar
        SLOW_TIME = false;
    }
};

var GameConditions = function() {

    for (var i = 0; i < WORKSPACE.length; i++) {

        if (WORKSPACE[i] != null) {
            var part = WORKSPACE[i];

            if (part.y > VIEWPORT.height) {
                WORKSPACE[i] = null;
                //part = null;
            }
            /*
             if (part.y > VIEWPORT.height) {
             part.y = 0;
             }
             if (part.y + part.height < 0) {
             part.y = VIEWPORT.height;
             }
             if (part.x > VIEWPORT.width) {
             part.x = 0;
             }
             if (part.x + part.height < 0) {
             part.x = VIEWPORT.width;
             }
             */
        }
    }
};

var SLOW_TIME = false;

var lastStep;

var Engine = function() {
    // Delta Capture
    var thisStep = new Date().getTime();
    var delta = (thisStep - lastStep) / 100 || thisStep - thisStep;
    //console.log(delta);
    lastStep = thisStep;

    // Calculations
    if (SLOW_TIME == true) {
        Physics(delta / 100);
    }
    else {
        Physics(delta);
    }

    GameConditions();

    // Draw
    DrawFrame();

    // Refresh Frame
    VIEWPORT_CONTEXT.drawImage(BUFFER, 0, 0);
    requestAnimationFrame(Engine);
};

// Initialize here
/*
var block = new Entity("Block", 50, 50, VIEWPORT.width / 2 - 25, VIEWPORT.height / 2 - 25, Entity.DYNAMIC, "#0000ff", "#000000", 0, null, 0, 0, 0, 0);
var green = new Entity("Green Block", 25, 25, Math.random() * 800, Math.random() * 600, Entity.DYNAMIC, "#00ff00", "#000000");
var yellow = new Entity ("Yellow Block", 25, 25, Math.random() * 800, Math.random() * 600, Entity.DYNAMIC, "#ffff00", "#000000", 0, null, Math.random() * -100, Math.random() * -100);
*/
// Start the Engine

requestAnimationFrame(Engine);