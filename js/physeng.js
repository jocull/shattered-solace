// Global Constants

// If an object's velocity is nearing this number, then its
// velocity will be set to 0.
var SETTLE_POINT = 0.001;

// The world's X and Y gravity values.
// Measured in seconds, i.e., 10 pixels per second.
// Positive values will move right or down.
// Negative values will move left or up.
var GRAVITY_X = 0;
var GRAVITY_Y = 0; // 9.8 m/s^2 is Earth gravity

//These factors handle long key presses
//var GRAVITY_FACTOR_BASE = 0.3;
//var GRAVITY_X_FACTOR = 0;
//var GRAVITY_Y_FACTOR = 9.8;

var WORKSPACE = [];

var NUMBER_OF_TRAILS = 3;
var TRAILS_BASE_SPEED = 2;

// Engine Output

var VIEWPORT = document.getElementById("viewport");
var VIEWPORT_CONTEXT = VIEWPORT.getContext("2d");
var BUFFER = document.createElement("canvas");
var BUFFER_CONTEXT = BUFFER.getContext("2d");

// Set the view size, detect resizes, and orientation changes
var PIXEL_RATIO = window.devicePixelRatio || 1;
function setViewSize() {
    VIEWPORT.width  = window.innerWidth * PIXEL_RATIO;
    VIEWPORT.height = window.innerHeight * PIXEL_RATIO;
    BUFFER.width = window.innerWidth * PIXEL_RATIO;
    BUFFER.height = window.innerHeight * PIXEL_RATIO;

    VIEWPORT.style.width = (window.innerWidth) + 'px';
    VIEWPORT.style.height = (window.innerHeight) + 'px';
    BUFFER.style.width = (window.innerWidth) + 'px';
    BUFFER.style.height = (window.innerHeight) + 'px';
}
setViewSize();
window.addEventListener('resize', setViewSize);
window.addEventListener('orientationchange', setViewSize);

var BACKGROUND_COLOR = "#ffffff"; // "#222244" for rain

// A shortcut for drawing methods
var view = BUFFER_CONTEXT;

var Entity = function(name, width, height, x, y, type, fillColor, outlineColor, elasticity, texture, vx, vy, ax, ay) {

    this.destroy = function() {
        var location = WORKSPACE.indexOf(this);

        WORKSPACE.splice(location, 1);
    };

    this.freeze = function(time, toggleColor) {
        this.frozen = true;
        this.freezeTime = time || 5;
        //this.vx = 0;
        //this.vy = 0;
        //this.ax = 0;
        //this.ay = 0;

        if (toggleColor == true) {
            if (this.fillColor != "#00bbff" && this.outlineColor != "#005577") {
                this.lastOutlineColor = this.outlineColor;
                this.lastFillColor = this.fillColor;

                this.fillColor = "#00bbff";
                this.outlineColor = "#005577";
            }
        }
    };

    this.thaw = function() {
        this.frozen = false;
        this.freezeTime = 0;
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
    this.mass = (this.width * this.height);
    this.elasticity = Math.abs(elasticity) || 1; // We don't want the elasticity to be negative, because then objects will move through each other.
    this.fillColor = fillColor || "#ffffff";
    this.outlineColor = outlineColor || "#000000";
    this.texture = texture || null;
    this.type = type || Entity.DYNAMIC;

    // Some state values for functions and such
    this.frozen = false;
    this.freezeTime = 0;
    this.lastOutlineColor = this.outlineColor;
    this.lastFillColor = this.fillColor;

    WORKSPACE.push(this);

};

// Dynamic entities are affected by all aspects of
// the physics engine.
Entity.DYNAMIC = "dynamic";

// Kinematic entities collide but are not affected by
// collisions or gravity.
Entity.KINEMATIC = "kinematic";

// Phantom entities do not collide nor are affected
// by collisions.
Entity.PHANTOM = "phantom";

// Track FPS
var framesSinceLastTick = 0;
var framesPerSecond = '?';
setInterval(function(){
    framesPerSecond = framesSinceLastTick;
    framesSinceLastTick = 0;
}, 1000);

var DrawFrame = function() {

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
                /*
                var speed = TRAILS_BASE_SPEED;
                var offset = 0.05; // Default 0.1
                var alpha = 0.5; // Default 0.3
                for (var i2 = 0; i2 < NUMBER_OF_TRAILS; i2++) {

                    newAlpha = (alpha / NUMBER_OF_TRAILS) * (6 - i2);

                    trail(item, speed, newAlpha, offset);

                    offset = offset + 0.1;
                    speed = speed * 2;
                }
                */

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
    view.fillStyle = '#000000';
    var fpsText = 'FPS: ' + framesPerSecond;
    var fpsMeasurement = view.measureText(fpsText);
    view.fillText(fpsText, VIEWPORT.width - (fpsMeasurement.width) - 5, 15);

    if (FREEZE_MODE == true) {
        view.beginPath();
        view.arc(MOUSE_X, MOUSE_Y, FREEZE_RADIUS, 0, 2*Math.PI, false);
        view.closePath();

        view.globalAlpha = 0.1;

        view.fillStyle = "#00bbff";
        view.strokeStyle = "#005577";
        view.fill();
        view.stroke();

        view.globalAlpha = 1;
    }
};

var Physics = function(delta) {
    for (var i = 0; i < WORKSPACE.length; i++) {

        if (WORKSPACE[i] != null) {
            var item = WORKSPACE[i];

        // Calculate positioning

            // Motion Equation of Position: x = x + v * t + 1/2 * a * t^2
            item.x = item.x + (item.vx * delta) + ((0.5 * item.ax) * (delta * delta));
            item.y = item.y + (item.vy * delta) + ((0.5 * item.ay) * (delta * delta));

        // Detect collisions

            for (var i2 = 0; i2 < WORKSPACE.length; i2 ++) {
                if (WORKSPACE[i2] != null && WORKSPACE[i2] != item) {
                    var collider = WORKSPACE[i2];

                    if (collider.type != Entity.PHANTOM) {
                        if ((item.x + item.width > collider.x && item.x < collider.x + collider.width)
                            && (item.y + item.height > collider.y && item.y < collider.y + collider.height)) {

        // Resolve collisions

                            // Collision Equation: va = (cr * mb * (vb - va) + ma * va + mb * vb) / ma + mb
                            // Equation of the coefficient of restitution: cr = (vb - va) / (ua - ub)

                            // Calculate the coefficients of restitution
                            var crx;
                            var cry;

                            // To avoid NaN results...
                            if (item.vx - collider.vx == 0) {
                                crx = 0;
                            }
                            else {
                                crx = (collider.vx - item.vx) / (item.vx - collider.vx);
                            }

                            if (item.vy - collider.vy == 0) {
                                cry = 0;
                            }
                            else {
                                cry = (collider.vy - item.vy) / (item.vy - collider.vy);
                            }

                            var iivx = item.vx; // item initial velocity x
                            var civx = collider.vx; // collider initial velocity x

                            var iivy = item.vy; // item initial velocity y
                            var civy = collider.vy; // collider initial velocity y

                            item.vx = (((item.mass * iivx) + (collider.mass * civx) + (collider.mass * (item.elasticity * crx) * (iivx - civx)))) / (item.mass + collider.mass);
                            item.vy = (((item.mass * iivy) + (collider.mass * civy) + (collider.mass * (item.elasticity * cry) * (iivy - civy)))) / (item.mass + collider.mass);

                            collider.vx = (((collider.mass * civx) + (item.mass * iivx) + (item.mass * (collider.elasticity * crx) * (civx - iivx)))) / (collider.mass + item.mass);
                            collider.vy = (((collider.mass * civy) + (item.mass * iivy) + (item.mass * (collider.elasticity * cry) * (civy - iivy)))) / (collider.mass + item.mass);

                            // This positional skip keeps parts from detecting an additional collision
                            // from the collider due to a missing change in position.

                            item.x = item.x + (item.vx * delta);
                            item.y = item.y + (item.vy * delta);

                            collider.x = collider.x + (collider.vx * delta);
                            collider.y = collider.y + (collider.vy * delta);
                        }
                    }
                }
            }

        // Complete motion data

            // Velocity
            if (item.frozen == false) {

                // Motion Equation of Velocity: v = v + a * t
                item.vx = item.vx + item.ax * delta + GRAVITY_X * delta;
                item.vy = item.vy + item.ay * delta + GRAVITY_Y * delta;
            }
            else {
                item.vx = (item.ax * delta + item.vx) / 1.1;
                item.vy = (item.ay * delta + item.vy) / 1.1;
                item.freezeTime = item.freezeTime - delta;
                if (item.freezeTime <= 0) {
                    item.thaw();
                }
            }

            // Settle
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

var MOUSE_X;
var MOUSE_Y;

var TOUCHES = [];

document.ontouchmove = function(e) {
    e.preventDefault(); //Stop scrolling on iOS
    e.stopPropagation();
    TOUCHES = e.changedTouches;

    if (TOUCHES.length > 1) {
        SLOW_TIME = true;
        FREEZE_MODE = false;
    }
    else if (TOUCHES.length == 1) {
        FREEZE_MODE = true;
        MOUSE_X = TOUCHES[0].pageX * PIXEL_RATIO;
        MOUSE_Y = TOUCHES[0].pageY * PIXEL_RATIO;
    }
    else if (TOUCHES.length = 0) {
        SLOW_TIME = false;
        FREEZE_MODE = false;
    }
};

document.ontouchstart = function(e) {
    TOUCHES = e.changedTouches;

    if (TOUCHES.length > 1) {
        SLOW_TIME = true;
        FREEZE_MODE = false;
    }
    else if (TOUCHES.length == 1) {
        FREEZE_MODE = true;
        MOUSE_X = TOUCHES[0].pageX * PIXEL_RATIO;
        MOUSE_Y = TOUCHES[0].pageY * PIXEL_RATIO;
    }

    //alert(TOUCHES[0].pageX + " " + TOUCHES[0].pageY + " " + SLOW_TIME + " " + FREEZE_MODE + " " + TOUCHES.length);

};

document.ontouchend = function(e) {
    TOUCHES = e.changedTouches;

    //alert(TOUCHES.length);

    if (TOUCHES.length > 1) {
        SLOW_TIME = true;
        FREEZE_MODE = false;
    }
    else if (TOUCHES.length = 0) {
        SLOW_TIME = false;
        FREEZE_MODE = false;
    }
    else {
        SLOW_TIME = false;
        FREEZE_MODE = false;
    }
    /*
    else if (TOUCHES.length == 1) {
        FREEZE_MODE = true;
        MOUSE_X = TOUCHES[0].pageX * PIXEL_RATIO;
        MOUSE_Y = TOUCHES[0].pageY * PIXEL_RATIO;
    }
    */
};

window.ondevicemotion = function(event) {
    /*
    devicex = event.accelerationIncludingGravity.x;
    devicey = event.accelerationIncludingGravity.y;
    devicez = event.accelerationIncludingGravity.z;

    GRAVITY_X = devicex / 2;
    GRAVITY_Y = devicey / 2 * -1;

    if (devicez > 8) {
        GRAVITY_X = 0;
        GRAVITY_Y = 0;
    }
    */
};

document.onmousemove = function(e) {
    MOUSE_X = e.pageX;
    MOUSE_Y = e.pageY;
};

document.onmousedown = function(e) {
    FREEZE_MODE = true;
};

document.onmouseup = function(e) {
    FREEZE_MODE = false;
};

document.onkeydown = function(e) {
    var event = window.event ? window.event : e;
    var key = event.keyCode;
    //console.log('KEY DOWN: ' + key);
    if (key == "87" || key == "38") {
        // W or UP key
        GRAVITY_Y_FACTOR = -(GRAVITY_FACTOR_BASE * 1.5);
    }
    if (key == "65" || key == "37") {
        // A or LEFT key
        GRAVITY_X_FACTOR = -(GRAVITY_FACTOR_BASE);
    }
    if (key == "83" || key == "40") {
        // S or DOWN key
        GRAVITY_Y_FACTOR = GRAVITY_FACTOR_BASE;
    }
    if (key == "68" || key == "39") {
        // D or RIGHT key
        GRAVITY_X_FACTOR = GRAVITY_FACTOR_BASE;
    }
    if (key == "32") {
        // Spacebar
        SLOW_TIME = true;
    }
};

document.onkeyup = function(e) {
    var event = window.event ? window.event : e;
    var key = event.keyCode;
    //console.log('KEY UP: ' + key);
    if (key == "87" || key == "38") {
        // W or UP key
        GRAVITY_Y_FACTOR = 0;
    }
    if (key == "65" || key == "37") {
        // A or LEFT key
        GRAVITY_X_FACTOR = 0;
    }
    if (key == "83" || key == "40") {
        // S or DOWN key
        GRAVITY_Y_FACTOR = 0;
    }
    if (key == "68" || key == "39") {
        // D or RIGHT key
        GRAVITY_X_FACTOR = 0;
    }
    if (key == "32") {
        // Spacebar
        SLOW_TIME = false;
    }
};

var FREEZE_MODE = false;
var FREEZE_RADIUS = 50;

var GameConditions = function() {
    //Work backwards so we can slice out items as we go
    for (var i = (WORKSPACE.length - 1); i >= 0; i--) {
        var part = WORKSPACE[i];

        if (FREEZE_MODE == true) {

            var distanceFromMouse = Math.abs(MOUSE_X - (part.x + (part.width / 2))) + Math.abs(MOUSE_Y - (part.y + (part.height / 2)));

            if (distanceFromMouse <= FREEZE_RADIUS) {
                part.freeze(20, true);
            }
        }

        /*
        if (Math.abs(block.vx) >= 512) {
            var random = Math.random();
            if (random > 0.5) {
                GRAVITY_X = GRAVITY_X * -1;
            }
        }

        if (Math.abs(block.vy) >= 512) {
            var random2 = Math.random();
            if (random2 > 0.5) {
                GRAVITY_Y = GRAVITY_Y * -1;
            }
        }
        */

    }
};

var SLOW_TIME = false;
var SLOW_TIME_FACTOR = 4;

var lastStep;

var Engine = function() {
    // Delta Capture
    var thisStep = new Date().getTime();
    var delta = (thisStep - lastStep) / 100 || thisStep - thisStep;
    lastStep = thisStep;

    // Calculations
    if (SLOW_TIME == true) {
        Physics(delta / SLOW_TIME_FACTOR);
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

var block = new Entity("Block", 50, 50, VIEWPORT.width / 2 - 25 + 150, VIEWPORT.height / 2 - 25 - 100, Entity.DYNAMIC, "#0000ff", "#000000", 1, null, 0, 0, 0, 0);
var subject = new Entity("Subject", 50, 50, VIEWPORT.width / 2 - 25 + 150, VIEWPORT.height / 2 - 25 + 100, Entity.DYNAMIC, "#000000", "#000000", 1, null, 0, -5, 0, 0);

var block2 = new Entity("Block", 50, 50, VIEWPORT.width / 2 - 25 + 50, VIEWPORT.height / 2 - 25 - 100, Entity.DYNAMIC, "#0000ff", "#000000", 1, null, 0, 3, 0, 0);
var subject2 = new Entity("Subject", 50, 50, VIEWPORT.width / 2 - 25 + 50, VIEWPORT.height / 2 - 25 + 100, Entity.DYNAMIC, "#000000", "#000000", 1, null, 0, -5, 0, 0);

var block3 = new Entity("Block", 50, 50, VIEWPORT.width / 2 - 25 - 50, VIEWPORT.height / 2 - 25 - 100, Entity.DYNAMIC, "#0000ff", "#000000", 1, null, 0, 5, 0, 0);
var subject3 = new Entity("Subject", 50, 50, VIEWPORT.width / 2 - 25 - 50, VIEWPORT.height / 2 - 25 + 100, Entity.DYNAMIC, "#000000", "#000000", 1, null, 0, -5, 0, 0);

var block4 = new Entity("Block", 50, 50, VIEWPORT.width / 2 - 25 - 250, VIEWPORT.height / 2 - 25 - 0, Entity.DYNAMIC, "#0000ff", "#000000", 1, null, 0, 0, 0, 0);
var subject4 = new Entity("Subject", 50, 50, VIEWPORT.width / 2 - 25 - 150, VIEWPORT.height / 2 - 25 + 0, Entity.DYNAMIC, "#000000", "#000000", 1, null, -5, -2, 0, 0);

var block5 = new Entity("Big", 100, 100, VIEWPORT.width / 2 - 25 + 250, VIEWPORT.height / 2 - 25 - 0, Entity.DYNAMIC, "#0000ff", "#000000", 1, null, 0, 0, 0, 0);
var subject5 = new Entity("Small", 25, 25, VIEWPORT.width / 2 - 12.5 + 275, VIEWPORT.height / 2 - 25 - 175, Entity.DYNAMIC, "#000000", "#000000", 1, null, 0, 5, 0, 0);

// Start the Engine
Engine();