// Global Constants

// If an object's velocity is nearing this number, then its
// velocity will be set to 0.
var SETTLE_POINT = 0.05;

// The world's X and Y gravity values.
// Measured in seconds, i.e., 10 pixels per second.
// Positive values will move right or down.
// Negative values will move left or up.
var GRAVITY_X = 0;
var GRAVITY_Y = 0; // 9.8 m/s^2 is Earth gravity

var WORKSPACE = [];

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

var CAMERA = {
    focusX : VIEWPORT.width / 2,
    focusY : VIEWPORT.height / 2,
    scrollX: 0,
    scrollY: 0,
    target : null,
    moveTo : function(focusX, focusY, frames) {
        // For later
        // This will be a smooth scrolling between two objects.
    }
};

var BACKGROUND_COLOR = "#ffffff";

// A shortcut for drawing methods
var view = BUFFER_CONTEXT;

var Entity = function(name, width, height, x, y, type, fillColor, outlineColor, elasticity, texture, vx, vy, ax, ay) {

    // Object functions
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

    // Object properties
    this.name = name || "Object";
    this.width = width || 50;
    this.height = height || 50;
    this.x = x || 0;
    this.y = y || 0;
    this.vx = vx || 0;
    this.vy = vy || 0;
    this.ax = ax || 0;
    this.ay = ay || 0;

    this.elasticity = Math.abs(elasticity) || 0.5; // We don't want the elasticity to be negative, because then objects will move through each other.
    this.fillColor = fillColor || "#ffffff";
    this.outlineColor = outlineColor || "#000000";
    this.texture = texture || null;
    this.type = type || Entity.DYNAMIC;
    if (this.type == Entity.KINEMATIC) {
        this.mass = 9007199254740992; // JavaScript's largest value that is not Infinity.
    }
    else {
        this.mass = (this.width * this.height);
    }

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

    // Set the Camera
    if (CAMERA.target != null) {
        CAMERA.focusX = CAMERA.target.x + (CAMERA.target.width / 2);
        CAMERA.focusY = CAMERA.target.y + (CAMERA.target.height / 2);
    }

    CAMERA.scrollX = (VIEWPORT.width / 2) - CAMERA.focusX;
    CAMERA.scrollY = (VIEWPORT.height / 2) - CAMERA.focusY;

    // Clear the view

    view.fillStyle = BACKGROUND_COLOR;
    view.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);

    for (var i = 0; i < WORKSPACE.length; i++) {

        if (WORKSPACE[i]/* &&
            WORKSPACE[i].x < VIEWPORT.width &&
            WORKSPACE[i].x + WORKSPACE[i].width > 0 &&
            WORKSPACE[i].y < VIEWPORT.height &&
            WORKSPACE[i].y + WORKSPACE[i].width > 0*/) {
            var item = WORKSPACE[i];

            var xPos = item.x + CAMERA.scrollX;
            var yPos = item.y + CAMERA.scrollY;

            var trail = function(item, speed, alpha, offset) {
                if (Math.abs(item.vx) + Math.abs(item.vy) > speed) {

                    view.globalAlpha = alpha;

                    var offsetx = item.vx * offset;
                    var offsety = item.vy * offset;

                    if (item.texture == null) {
                        view.beginPath();

                        view.moveTo(xPos - offsetx, yPos - offsety);
                        view.lineTo(xPos - offsetx, yPos + item.height - offsety);
                        view.lineTo(xPos + item.width - offsetx, yPos + item.height - offsety);
                        view.lineTo(xPos + item.width - offsetx, yPos - offsety);
                        view.lineTo(xPos - offsetx, yPos - offsety);
                        view.closePath();

                        view.fillStyle = item.fillColor;
                        //view.strokeStyle = item.outlineColor;
                        view.fill();
                        //view.stroke();
                    }
                    else {
                        var texture = new Image();
                        texture.src = item.texture;

                        view.drawImage(texture, xPos - offsetx, yPos - offsety, item.width, item.height);
                    }

                    view.globalAlpha = 1.0;
                }
            };

            if (item.texture == null){

                trail(item, 32, 0.3, 0.1);
                trail(item, 128, 0.2, 0.2);
                trail(item, 512, 0.1, 0.3);


                view.beginPath();

                view.moveTo(xPos, yPos);
                view.lineTo(xPos, yPos + item.height);
                view.lineTo(xPos + item.width, yPos + item.height);
                view.lineTo(xPos + item.width, yPos);
                view.lineTo(xPos, yPos);
                /*
                 view.moveTo(item.x, item.y);
                 view.lineTo(item.x, item.y + item.height);
                 view.lineTo(item.x + item.width, item.y + item.height);
                 view.lineTo(item.x + item.width, item.y);
                 view.lineTo(item.x, item.y);
                 */
                view.closePath();

                view.fillStyle = item.fillColor;
                view.strokeStyle = item.outlineColor;
                view.fill();
                view.stroke();


            }
            else{

                trail(item, 32, 0.3, 0.1);
                trail(item, 128, 0.2, 0.2);
                trail(item, 512, 0.1, 0.3);

                var texture = new Image();
                texture.src = item.texture;

                view.drawImage(texture, xPos, yPos, item.width, item.height);
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
            if (item.type != Entity.PHANTOM) {
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

                            if (item.type != Entity.KINEMATIC || (item.type == Entity.KINEMATIC && collider.type == Entity.KINEMATIC)) {
                            item.vx = (((item.mass * iivx) + (collider.mass * civx) + (collider.mass * (item.elasticity * crx) * (iivx - civx)))) / (item.mass + collider.mass);
                            item.vy = (((item.mass * iivy) + (collider.mass * civy) + (collider.mass * (item.elasticity * cry) * (iivy - civy)))) / (item.mass + collider.mass);
                            }

                            if (collider.type != Entity.KINEMATIC || (item.type == Entity.KINEMATIC && collider.type == Entity.KINEMATIC)) {
                            collider.vx = (((collider.mass * civx) + (item.mass * iivx) + (item.mass * (collider.elasticity * crx) * (civx - iivx)))) / (collider.mass + item.mass);
                            collider.vy = (((collider.mass * civy) + (item.mass * iivy) + (item.mass * (collider.elasticity * cry) * (civy - iivy)))) / (collider.mass + item.mass);
                            }

                            // Enable this to ensure that energy stays at a constant.
                            //console.log((iivy * item.mass + civy * item.mass) + " = " + (item.vy * item.mass + collider.vy * collider.mass));

                            // This positional skip keeps parts from detecting an additional collision
                            // from the collider due to a missing change in position.
                            // It also helps to stop the shakiness from gravity.

                            // Detect which sides are colliding
                            var itemLeft = item.x;
                            var itemRight = item.x + item.width;
                            var itemTop = item.y;
                            var itemBottom = item.y + item.height;
                            var colliderLeft = collider.x;
                            var colliderRight = collider.x + collider.width;
                            var colliderTop = collider.y;
                            var colliderBottom = collider.y + collider.height;

                            var leftDistance = Math.abs(itemLeft - colliderRight);
                            var rightDistance = Math.abs(itemRight - colliderLeft);
                            var topDistance = Math.abs(itemTop - colliderBottom);
                            var bottomDistance = Math.abs(itemBottom - colliderTop);

                            if (leftDistance < rightDistance && leftDistance < topDistance && leftDistance < bottomDistance) {
                                // WEST or LEFT collision from ITEM
                                if (collider.type == Entity.KINEMATIC || item.mass < collider.mass) {
                                    item.x = collider.width + collider.x;
                                }
                                else if (item.type == Entity.KINEMATIC || collider.mass < item.mass) {
                                    collider.x = item.width + item.x;
                                }
                            }
                            else if (rightDistance < leftDistance && rightDistance < topDistance && rightDistance < bottomDistance) {
                                // EAST or RIGHT collision from ITEM
                                if (collider.type == Entity.KINEMATIC || item.mass < collider.mass) {
                                    item.x = collider.x - item.width;
                                }
                                else if (item.type == Entity.KINEMATIC || collider.mass < item.mass) {
                                    collider.x = item.x - collider.width;
                                }
                            }
                            else if (topDistance < bottomDistance && topDistance < leftDistance && topDistance < rightDistance) {
                                // NORTH or TOP collision from ITEM
                                if (collider.type == Entity.KINEMATIC || item.mass < collider.mass) {
                                    item.y = collider.y + collider.height;
                                }
                                else if (item.type == Entity.KINEMATIC || collider.mass < item.mass) {
                                    collider.y = item.x + item.height;
                                }
                            }
                            else if (bottomDistance < topDistance && bottomDistance < leftDistance && bottomDistance < rightDistance) {
                                // SOUTH or BOTTOM collision from ITEM
                                if (collider.type == Entity.KINEMATIC || item.mass < collider.mass) {
                                    item.y = collider.y - item.height;
                                }
                                else if (item.type == Entity.KINEMATIC || collider.mass < item.mass) {
                                    collider.y = item.x - collider.height;
                                }
                            }
                            /*
                            if (item.type != Entity.KINEMATIC || (item.type == Entity.KINEMATIC && collider.type == Entity.KINEMATIC)) {
                            item.x = item.x + (item.vx * delta);
                            item.y = item.y + (item.vy * delta);
                            }

                            if (collider.type != Entity.KINEMATIC || (item.type == Entity.KINEMATIC && collider.type == Entity.KINEMATIC)) {
                            collider.x = collider.x + (collider.vx * delta);
                            collider.y = collider.y + (collider.vy * delta);
                            }
                            */
                        }
                    }
                }
            }
            }

        // Complete motion data

            // Velocity
            if (item.type == Entity.KINEMATIC) {
                item.vx = item.vx + item.ax * delta;
            }
            else if (item.frozen == true) {
                item.vx = (item.ax * delta + item.vx) / 1.1;
                item.vy = (item.ay * delta + item.vy) / 1.1;
                item.freezeTime = item.freezeTime - delta;
                if (item.freezeTime <= 0) {
                    item.thaw();
                }
            }
            else {
                // Motion Equation of Velocity: v = v + a * t
                item.vx = item.vx + item.ax * delta + GRAVITY_X * delta;
                item.vy = item.vy + item.ay * delta + GRAVITY_Y * delta;
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

};

document.ontouchend = function(e) {
    TOUCHES = e.changedTouches;

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
    switch (e.which) {
        case 1:
            //FREEZE_MODE = true;
            // Left mouse button
            break;
        case 2:
            // Middle mouse button
            break;
        case 3:
            // Right mouse button
            CAMERA.focusX = MOUSE_X;
            CAMERA.focusY = MOUSE_Y;
            CAMERA.target = null;
            break;
    }
};

document.onmouseup = function(e) {
    //FREEZE_MODE = false;
};

document.onkeydown = function(e) {
    var event = window.event ? window.event : e;
    var key = event.keyCode;
    //console.log('KEY DOWN: ' + key);
    if (key == "87" || key == "38") {
        // W or UP key
        center.vy = -50;
    }
    if (key == "65" || key == "37") {
        // A or LEFT key
        center.ax = -10;
    }
    if (key == "83" || key == "40") {
        // S or DOWN key
    }
    if (key == "68" || key == "39") {
        // D or RIGHT key
        center.ax = 10;
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
    }
    if (key == "65" || key == "37") {
        // A or LEFT key
        center.ax = 0;
    }
    if (key == "83" || key == "40") {
        // S or DOWN key
    }
    if (key == "68" || key == "39") {
        // D or RIGHT key
        center.ax = 0;
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

/*
var block = new Entity("Purple", 50, 50, VIEWPORT.width / 2 - 25 + 150, VIEWPORT.height / 2 - 25 - 100, Entity.DYNAMIC, "#ff00ff", "#000000", 2, null, 0, 0, 0, 0);
var subject = new Entity("Red", 50, 50, VIEWPORT.width / 2 - 25 + 150, VIEWPORT.height / 2 - 25 + 100, Entity.DYNAMIC, "#ff0000", "#000000", 2, null, 0, -5, 0, 0);

var block2 = new Entity("Block", 50, 50, VIEWPORT.width / 2 - 25 + 50, VIEWPORT.height / 2 - 25 - 100, Entity.DYNAMIC, "#0000ff", "#000000", 1, null, 0, 3, 0, 0);
var subject2 = new Entity("Subject", 50, 50, VIEWPORT.width / 2 - 25 + 50, VIEWPORT.height / 2 - 25 + 100, Entity.DYNAMIC, "#000000", "#000000", 1, null, 0, -5, 0, 0);

var block3 = new Entity("Block", 50, 50, VIEWPORT.width / 2 - 25 - 50, VIEWPORT.height / 2 - 25 - 100, Entity.DYNAMIC, "#0000ff", "#000000", 1, null, 0, 5, 0, 0);
var subject3 = new Entity("Subject", 50, 50, VIEWPORT.width / 2 - 25 - 50, VIEWPORT.height / 2 - 25 + 100, Entity.DYNAMIC, "#000000", "#000000", 1, null, 0, -5, 0, 0);

var block4 = new Entity("Block", 50, 50, VIEWPORT.width / 2 - 25 - 250, VIEWPORT.height / 2 - 25 - 0, Entity.DYNAMIC, "#0000ff", "#000000", 1, null, 0, 0, 0, 0);
var subject4 = new Entity("Subject", 50, 50, VIEWPORT.width / 2 - 25 - 150, VIEWPORT.height / 2 - 25 + 0, Entity.DYNAMIC, "#000000", "#000000", 1, null, -5, -2, 0, 0);

var block5 = new Entity("Big", 100, 100, VIEWPORT.width / 2 - 25 + 250, VIEWPORT.height / 2 - 25 - 0, Entity.DYNAMIC, "#0000ff", "#000000", 1, null, 0, 0, 0, 0);
var subject5 = new Entity("Small", 25, 25, VIEWPORT.width / 2 - 12.5 + 275, VIEWPORT.height / 2 - 25 - 175, Entity.DYNAMIC, "#000000", "#000000", 1, null, 0, 5, 0, 0);

var drop = new Entity("Drop", 50, 50, VIEWPORT.width / 2 - 25 - 251, VIEWPORT.height / 2 + 125 - 50, Entity.DYNAMIC, "#0000ff", "#000000", 0.6, null, 0, 5, 0, 0);
var plate = new Entity("Plate", 100, 5, VIEWPORT.width / 2 - 50 - 250, VIEWPORT.height / 2 + 250 - 0, Entity.KINEMATIC, "#00ff00", "#000000", 1, null, 0, 0, 0, 0);

var deflector = new Entity("Deflector", 25, 25, VIEWPORT.width / 2 - 12.5 + 400, VIEWPORT.height / 2 - 25 - 175, Entity.DYNAMIC, "#000000", "#000000", 1, null, 1, 5, 0, 0);
var plane = new Entity("Plane", 100, 10, VIEWPORT.width / 2 - 25 + 400, VIEWPORT.height / 2 - 25 + 50, Entity.KINEMATIC, "#0000ff", "#000000", 1, null, 0, 0, 0, 0);

var deflector2 = new Entity("Deflector", 25, 25, VIEWPORT.width / 2 - 12.5 + 500, VIEWPORT.height / 2 - 25 + 100, Entity.DYNAMIC, "#000000", "#000000", 1, null, -5, 1, 0, 0);
var plane2 = new Entity("Plane", 10, 100, VIEWPORT.width / 2 - 25 + 400, VIEWPORT.height / 2 - 25 + 100, Entity.KINEMATIC, "#0000ff", "#000000", 1, null, 0, 0, 0, 0);

var sharp = new Entity("Sharp", 25, 25, 10.5, 10.5);
var blurry = new Entity("Blurry", 25, 25, 40, 40);
*/

var center = new Entity("Center", 100, 100, VIEWPORT.width / 2 - 50, VIEWPORT.height / 2 - 50, Entity.DYNAMIC, "#000000", "#000000", 0.5, "textures/Block.png", Math.random() * 50, Math.random() * 100 * -1, 0, 0);
new Entity("Block", 50, 50, Math.random() * VIEWPORT.width - 25, Math.random() * VIEWPORT.height - 25, Entity.DYNAMIC,"#000000", "#000000", 0.7);

/*
for (var i = 0; i < 15; i++) {
    new Entity("Block", 50, 50, Math.random() * VIEWPORT.width - 25, Math.random() * VIEWPORT.height - 25, Entity.DYNAMIC,"#000000", "#000000", 0.7);
}
*/

var top = new Entity("Top", VIEWPORT.width -30, 30, 0, -30, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);
var bottom = new Entity("Bottom", VIEWPORT.width - 30, 30, 0, VIEWPORT.height - 30, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);
var left = new Entity("Left", 30, VIEWPORT.height - 30, -30, 0, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);
var right = new Entity("Right", 30, VIEWPORT.height - 30, VIEWPORT.width - 30, 0, Entity.KINEMATIC, "#ff0000", "#000000", 0.6);

CAMERA.target = center;

GRAVITY_Y = 9.8;

/*
var texblock = new Entity("Textured", 50, 50, VIEWPORT.width/2 - 25, VIEWPORT.height/2 - 25, Entity.DYNAMIC, "#000000", "#000000", 1, "textures/Block.png", 0, 0, 0, 0);
var texblock2 = new Entity("Textured", 100, 100, VIEWPORT.width/2 - 25, VIEWPORT.height/2 - 50 + 100, Entity.DYNAMIC, "#000000", "#000000", 1, "textures/Block.png", 0, 0, 0, 0);
*/

// Start the Engine
Engine();