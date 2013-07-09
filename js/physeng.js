// Global Constants

// If an object's velocity is nearing this number, then its
// velocity will be set to 0.
var SETTLE_POINT = 0.001;

// The world's X and Y gravity values.
// Measured in seconds, i.e., 10 pixels per second.
// Positive values will move right or down.
// Negative values will move left or up.
var GRAVITY_X = 0;
var GRAVITY_Y = 5;

var WORKSPACE = [];

var NUMBER_OF_TRAILS = 3;
var TRAILS_BASE_SPEED = 2;

// Engine Output

var VIEWPORT = document.getElementById("viewport");
var VIEWPORT_CONTEXT = VIEWPORT.getContext("2d");
var BUFFER = document.createElement("canvas");
var BUFFER_CONTEXT = BUFFER.getContext("2d");

// Set the view size
VIEWPORT.width  = window.innerWidth;
VIEWPORT.height = window.innerHeight;

BUFFER.width = VIEWPORT.width;
BUFFER.height = VIEWPORT.height;

var BACKGROUND_COLOR = "#222244";

// A shortcut for drawing methods
var view = BUFFER_CONTEXT;

var Entity = function(name, width, height, x, y, type, fillColor, outlineColor, elasticity, texture, vx, vy, ax, ay) {

    this.destroy = function() {
        var location = WORKSPACE.indexOf(this);

        WORKSPACE.splice(location, 1);
    };

    this.freeze = function(toggleColor) {
        this.frozen = true;
        this.vx = 0;
        this.vy = 0;
        this.ax = 0;
        this.ay = 0;

        if (toggleColor == true) {
            this.lastOutlineColor = this.outlineColor;
            this.lastFillColor = this.fillColor;

            this.fillColor = "#00bbff";
            this.outlineColor = "#005577";
        }
    };

    this.thaw = function() {
        this.frozen = false;
        this.fillColor = this.lastFillColor;
        this.outlineColor = this.lastOutlineColor;
    };



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

    // Some state values for functions and such
    this.frozen = false;
    this.lastOutlineColor = this.outlineColor;
    this.lastFillColor = this.fillColor;

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

// Track FPS
var framesSinceLastTick = 0;
var framesPerSecond = '?';
setInterval(function(){
    framesPerSecond = framesSinceLastTick;
    framesSinceLastTick = 0;
}, 1000);

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

    // Set the view size
    VIEWPORT.width  = window.innerWidth;
    VIEWPORT.height = window.innerHeight;
    BUFFER.width = window.innerWidth;
    BUFFER.height = window.innerHeight;

    // Clear the view
    view.fillStyle = BACKGROUND_COLOR;
    view.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);

    for (var i = 0; i < WORKSPACE.length; i++) {

        if (WORKSPACE[i]) {
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
                var speed = TRAILS_BASE_SPEED;
                var offset = 0.05; // Default 0.1
                var alpha = 0.5; // Default 0.3
                for (var i2 = 0; i2 < NUMBER_OF_TRAILS; i2++) {

                    newAlpha = (alpha / NUMBER_OF_TRAILS) * (6 - i2);

                    trail(item, speed, newAlpha, offset);

                    offset = offset + 0.1;
                    speed = speed * 2;
                }
                /*
                trail(item, 32, 0.3, 0.1);
                trail(item, 128, 0.2, 0.2);
                trail(item, 512, 0.1, 0.3);
                */

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

    // Draw the title
    var title = 'Shattered Solace';
    view.font = 'italic ' + Math.max(20, (BUFFER.width / 30)) + 'px Arial';
    view.fillStyle = '#1a1a1a';
    var titleMeasurement = view.measureText(title);
    var titleHeight = BUFFER.height - 10;
    view.fillText(title,
                    BUFFER.width / 2 - (titleMeasurement.width / 2),
                    titleHeight);
//    view.strokeStyle = '#111';
//    view.lineWidth = 1;
//    view.strokeText(title,
//                    BUFFER.width / 2 - (titleMeasurement.width / 2),
//                    titleHeight);

    // Draw the FPS
    framesSinceLastTick++;
    view.font = '14px Arial';
    view.fillStyle = 'black';
    view.fillText('FPS: ' + framesPerSecond, VIEWPORT.width - 55, 19);
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
            if (item.frozen == false) {
                var Velocity = function() {
                    item.vx = item.ax * delta + item.vx + (GRAVITY_X * delta);
                    item.vy = item.ay * delta + item.vy + (GRAVITY_Y * delta);
                    //alert("VY "+item.vy);
                }();
            }

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

document.ontouchstart = function(e) {
    SLOW_TIME = true;
};

document.ontouchend = function(e) {
    SLOW_TIME = false;
};

window.ondevicemotion = function(event) {
    devicex = event.accelerationIncludingGravity.x;
    devicey = event.accelerationIncludingGravity.y;
    devicez = event.accelerationIncludingGravity.z;

    GRAVITY_X = devicex / 2;
    GRAVITY_Y = devicey / 2 * -1;
};

document.onkeydown = function(e) {
//    alert(e);
    //alert(document.keyCode);
};

document.onkeydown = function(e) {
    var event = window.event ? window.event : e;
    var key = event.keyCode;
    //console.log(key);
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
    //console.log(key);
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

    //Work backwards so we can slice out items as we go
    for (var i = (WORKSPACE.length - 1); i >= 0; i--) {
        var part = WORKSPACE[i];

        if (part.y > VIEWPORT.height + 150) {
            part.destroy();
        }
        if (part.y + part.height < -150) {
            part.destroy();
        }
        if (part.x > VIEWPORT.width + 150) {
            part.destroy();
        }
        if (part.x + part.height < -150) {
            part.destroy();
        }

        if (part.x < -200 || part.x > VIEWPORT.width + 200 || part.y > VIEWPORT.height + 200) {
            //alert("Part is out of bounds!");
        }

         /*
         if (part.y > VIEWPORT.height) {
             part.y = -part.height;
         }
         if (part.y + part.height < 0) {
             part.y = VIEWPORT.height;
         }
         if (part.x > VIEWPORT.width) {
             part.x = -part.width;
         }
         if (part.x + part.height < 0) {
             part.x = VIEWPORT.width;
         }

        if (Math.abs(block.vx) >= 512) {
            var random = Math.random();
            if (random > 0.5) {
                GRAVITY_X = GRAVITY_X * -1;
            }
        }

        if (Math.abs(block.vy) >= 512) {
            var random = Math.random();
            if (random > 0.5) {
                GRAVITY_Y = GRAVITY_Y * -1;
            }
        }
        */
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
var green = new Entity("Green Block", 25, 25, Math.random() * VIEWPORT.width, Math.random() * VIEWPORT.height, Entity.DYNAMIC, "#00ff00", "#000000");
var yellow = new Entity ("Yellow Block", 25, 25, Math.random() * VIEWPORT.width, Math.random() * VIEWPORT.height, Entity.DYNAMIC, "#ffff00", "#000000", 0, null, Math.random() * -100, Math.random() * -100);
*/

// Start the Engine
Engine();