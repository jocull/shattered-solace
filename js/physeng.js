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
    scrollTarget : {
        focusX : 0,
        focusY : 0,
        startX : 0,
        startY : 0,
        increment : 0,
        step : 0,
        target : null,
        state : false
    },
    scrollTo : function(focusX, focusY, increment, target) {
        this.scrollTarget.focusX = focusX;
        this.scrollTarget.focusY = focusY;
        if (target != null) {
            this.scrollTarget.focusX = target.x + (target.width / 2);
            this.scrollTarget.focusY = target.y + (target.height / 2);
        }
        this.scrollTarget.startX = CAMERA.focusX;
        this.scrollTarget.startY = CAMERA.focusY;
        this.scrollTarget.increment = increment;
        this.scrollTarget.target = target || null;
        this.scrollTarget.step = 0;
        this.scrollTarget.state = true;
    },
    scrollCheck : function() {
        if (this.scrollTarget.state == true) {
            this.scrollTarget.step++;

            var main = this.scrollTarget;

            if (CAMERA.target != null) {
                CAMERA.target = null;
            }

            if (main.target != null) {
                main.focusX = main.target.x + (main.target.width / 2);
                main.focusY = main.target.y + (main.target.height / 2);

                if (main.startX >= main.focusX) {
                    CAMERA.focusX = (((main.focusX - main.startX) / main.increment) * main.step) + main.startX;
                }
                else if (main.startX < main.focusX) {
                    CAMERA.focusX = (((main.focusX - main.startX) / main.increment) * main.step) + main.startX;
                }
                if (main.startY >= main.focusY) {
                    CAMERA.focusY = (((main.focusY - main.startY) / main.increment) * main.step) + main.startY;
                }
                else if (main.startY < main.focusY) {
                    CAMERA.focusY = (((main.focusY - main.startY) / main.increment) * main.step) + main.startY;
                }

                if (main.step >= main.increment) {
                    CAMERA.target = main.target;
                }
            }
            else {
                if (main.startX >= main.focusX) {
                    CAMERA.focusX = (main.startX - main.focusX) / main.increment * main.step;
                }
                else if (main.startX < main.focusX) {
                    CAMERA.focusX = (main.focusX - main.startX) / main.increment * main.step;
                }
                if (main.startY >= main.focusY) {
                    CAMERA.focusY = (main.startY - main.focusY) / main.increment * main.step;
                }
                else if (main.startY < main.focusY) {
                    CAMERA.focusY = (main.focusY - main.startX) / main.increment * main.step;
                }

                if (main.step >= main.increment) {
                    CAMERA.focusX = main.focusX;
                    CAMERA.focusY = main.focusY;
                }
            }

            if (this.scrollTarget.step >= this.scrollTarget.increment) {
                this.scrollTarget.state = false;
            }
        }
    },
    toPointX : function(mouseX) {
        var point = mouseX - CAMERA.scrollX;
        return point;
    },
    toPointY : function(mouseY) {
        var point = mouseY - CAMERA.scrollY;
        return point;
    }
};

var BACKGROUND_COLOR = "#ffffff";

// A shortcut for drawing methods
var view = BUFFER_CONTEXT;

var Entity = function(name, width, height, x, y, type, fillColor, outlineColor, elasticity, friction, texture, vx, vy, ax, ay) {

    // Object functions
    this.destroy = function() {
        var location = WORKSPACE.indexOf(this);

        WORKSPACE.splice(location, 1);
    };

    this.freeze = function(time, toggleColor) {
        this.frozen = true;
        this.freezeTime = time || 5;

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
    this.friction = friction || 0.5;
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

        if (WORKSPACE[i] &&
            WORKSPACE[i].x + CAMERA.scrollX < VIEWPORT.width &&
            WORKSPACE[i].x + CAMERA.scrollX + WORKSPACE[i].width > 0 &&
            WORKSPACE[i].y + CAMERA.scrollY < VIEWPORT.height &&
            WORKSPACE[i].y + CAMERA.scrollY + WORKSPACE[i].height > 0) {
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
                        view.fill();
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
                view.closePath();

                view.fillStyle = item.fillColor;
                view.strokeStyle = item.outlineColor;
                view.fill();
                view.stroke();
            }
            else
            {
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
};

var Physics = function(delta) {
    for (var i = 0; i < WORKSPACE.length; i++) {

        if (WORKSPACE[i] != null) {
            var item = WORKSPACE[i];

        // Calculate positioning

            // Motion Equation of Position: x = x + v * t + 1/2 * a * t^2
            item.x = item.x + (item.vx * delta) + ((0.5 * item.ax) * (delta * delta));
            item.y = item.y + (item.vy * delta) + ((0.5 * item.ay) * (delta * delta));

        // Detect and resolve collisions
            if (item.type != Entity.PHANTOM) {
            for (var i2 = 0; i2 < WORKSPACE.length; i2 ++) {
                if (WORKSPACE[i2] != null && WORKSPACE[i2] != item) {
                    var collider = WORKSPACE[i2];

                    if (collider.type != Entity.PHANTOM) {
                        if ((item.x + item.width > collider.x && item.x < collider.x + collider.width)
                            && (item.y + item.height > collider.y && item.y < collider.y + collider.height)) {

                            // Calculate the distances between the faces of the objects
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

                            // Coefficients of restitution
                            var crx;
                            var cry;

                            // Initial velocities
                            var iivx = item.vx;
                            var civx = collider.vx;

                            var iivy = item.vy;
                            var civy = collider.vy;

                            if (leftDistance < rightDistance && leftDistance < topDistance && leftDistance < bottomDistance) {
                                // WEST or LEFT collision from ITEM

                                // Equation of the coefficient of restitution: cr = (vb - va) / (ua - ub)
                                crx = (collider.vx - item.vx) / (item.vx - collider.vx) || 0;
                                if (item.type != Entity.KINEMATIC) {

                                    // Collision Equation: va = (cr * mb * (vb - va) + ma * va + mb * vb) / ma + mb
                                    item.vx = (((item.mass * iivx) + (collider.mass * civx) + (collider.mass * (item.elasticity * crx) * (iivx - civx)))) / (item.mass + collider.mass);

                                    // This positional skip keeps parts from detecting an additional collision
                                    // from the collider due to a missing change in position.
                                    // It also helps to stop the shakiness from gravity.
                                    item.x = collider.x + collider.width;
                                    if (item.vx < 0 && GRAVITY_X < 0) {
                                        item.vx = 0;
                                    }
                                }
                                if (collider.type != Entity.KINEMATIC) {
                                    collider.vx = (((collider.mass * civx) + (item.mass * iivx) + (item.mass * (collider.elasticity * crx) * (civx - iivx)))) / (collider.mass + item.mass);
                                    collider.x = item.x - collider.width;
                                    if (collider.vx > 0 && GRAVITY_X > 0) {
                                        collider.vx = 0;
                                    }
                                }
                            }
                            else if (rightDistance < leftDistance && rightDistance < topDistance && rightDistance < bottomDistance) {
                                // EAST or RIGHT collision from ITEM
                                crx = (collider.vx - item.vx) / (item.vx - collider.vx) || 0;
                                if (item.type != Entity.KINEMATIC) {
                                    item.vx = (((item.mass * iivx) + (collider.mass * civx) + (collider.mass * (item.elasticity * crx) * (iivx - civx)))) / (item.mass + collider.mass);
                                    item.x = collider.x - item.width;
                                    if (item.vx > 0 && GRAVITY_X > 0) {
                                        item.vx = 0;
                                    }
                                }
                                if (collider.type != Entity.KINEMATIC) {
                                    collider.vx = (((collider.mass * civx) + (item.mass * iivx) + (item.mass * (collider.elasticity * crx) * (civx - iivx)))) / (collider.mass + item.mass);
                                    collider.x = item.x + item.width;
                                    if (collider.vx < 0 && GRAVITY_X < 0) {
                                        collider.vx = 0;
                                    }
                                }
                            }
                            else if (topDistance < bottomDistance && topDistance < leftDistance && topDistance < rightDistance) {
                                // NORTH or TOP collision from ITEM
                                cry = (collider.vy - item.vy) / (item.vy - collider.vy) || 0;
                                if (item.type != Entity.KINEMATIC) {
                                    item.vy = (((item.mass * iivy) + (collider.mass * civy) + (collider.mass * (item.elasticity * cry) * (iivy - civy)))) / (item.mass + collider.mass);
                                    item.y = collider.y + collider.height;
                                    if (item.vy < 0 && GRAVITY_Y < 0) {
                                        item.vy = 0;
                                    }
                                }
                                if (collider.type != Entity.KINEMATIC) {
                                    collider.vy = (((collider.mass * civy) + (item.mass * iivy) + (item.mass * (collider.elasticity * cry) * (civy - iivy)))) / (collider.mass + item.mass);
                                    collider.y = item.y - collider.height;
                                    if (collider.vy > 0 && GRAVITY_Y > 0) {
                                        collider.vy = 0;
                                    }
                                }
                            }
                            else if (bottomDistance < topDistance && bottomDistance < leftDistance && bottomDistance < rightDistance) {
                                // SOUTH or BOTTOM collision from ITEM
                                cry = (collider.vy - item.vy) / (item.vy - collider.vy) || 0;
                                if (item.type != Entity.KINEMATIC) {
                                    item.vy = (((item.mass * iivy) + (collider.mass * civy) + (collider.mass * (item.elasticity * cry) * (iivy - civy)))) / (item.mass + collider.mass);
                                    item.y = collider.y - item.height;
                                    if (item.vy > 0 && GRAVITY_Y > 0) {
                                        item.vy = 0;
                                    }
                                }
                                if (collider.type != Entity.KINEMATIC) {
                                    collider.vy = (((collider.mass * civy) + (item.mass * iivy) + (item.mass * (collider.elasticity * cry) * (civy - iivy)))) / (collider.mass + item.mass);
                                    collider.y = item.y + item.height;
                                    if (collider.vy < 0 && GRAVITY_Y < 0) {
                                        collider.vy = 0;
                                    }
                                }
                            }
                        }
        // Calculate Frictional Data
                        // Coulomb Friction Equation: f <= u * n
                        // Where f = force of friction (Force slowing the object),
                        // u = coefficient of friction,
                        // n = normal force (Force that is exerted by each surface on the other)

                        var cf = (item.friction + collider.friction) / 2; // Mean of the two friction (approximate coefficient of friction)
                        var friction;
                        var itemDirectionX;
                        var itemDirectionY;
                        var colliderDirectionX;
                        var colliderDirectionY;
                        var seed;

                        if (item.vx > 0) {
                            itemDirectionX = -1;
                            if (collider.vx > item.vx) {
                                colliderDirectionX = -1;
                            }
                            else if (collider.vx < item.vx) {
                                colliderDirectionX = 1;
                            }
                            else {
                                colliderDirectionX = 0;
                            }
                        }
                        else if (item.vx < 0) {
                            itemDirectionX = 1;
                            if (collider.vx > item.vx) {
                                colliderDirectionX = -1;
                            }
                            else if (collider.vx < item.vx) {
                                colliderDirectionX = 1;
                            }
                            else {
                                colliderDirectionX = 0;
                            }
                        }
                        else {
                            itemDirectionX = 0;
                            if (collider.vx > 0) {
                                colliderDirectionX = -1;
                            }
                            else if (collider.vx < 0) {
                                colliderDirectionX = 1;
                            }
                            else {
                                colliderDirectionX = 0;
                            }
                        }

                        if (item.vy > 0) {
                            itemDirectionY = -1;
                            if (collider.vy > item.vy) {
                                colliderDirectionY = -1;
                            }
                            else if (collider.vy < item.vy) {
                                colliderDirectionY = 1;
                            }
                            else {
                                colliderDirectionY = 0;
                            }
                        }
                        else if (item.vy < 0) {
                            itemDirectionY = 1;
                            if (collider.vy > item.vy) {
                                colliderDirectionY = -1;
                            }
                            else if (collider.vy < item.vy) {
                                colliderDirectionY = 1;
                            }
                            else {
                                colliderDirectionY = 0;
                            }
                        }
                        else {
                            itemDirectionY = 0;
                            if (collider.vy > 0) {
                                colliderDirectionY = -1;
                            }
                            else if (collider.vy < 0) {
                                colliderDirectionY = 1;
                            }
                            else {
                                colliderDirectionY = 0;
                            }
                        }

                        if (item.x + item.width == collider.x && item.y > collider.y - item.height && item.y < collider.y + collider.height && (item.vy != 0 || collider.vy != 0)) {
                            // EAST or RIGHT friction from ITEM
                            seed = Math.random();
                            if (item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (item.vx * item.mass) * seed) / item.mass);
                                item.vy = item.vy + (friction * itemDirectionY);
                            }
                            if (collider.type != Entity.KINEMATIC && item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (collider.vx * collider.mass) * seed) / collider.mass);
                                collider.vy = collider.vy + (friction * colliderDirectionY);
                            }
                        }
                        else if (item.x == collider.x + collider.width && item.y > collider.y - item.height && item.y < collider.y + collider.height && (item.vy != 0 || collider.vy != 0)) {
                            // WEST or LEFT friction from ITEM
                            seed = Math.random();
                            if (item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (item.vx * item.mass) * seed) / item.mass);
                                item.vy = item.vy + (friction * itemDirectionY);
                            }
                            if (collider.type != Entity.KINEMATIC && item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (collider.vx * collider.mass) * seed) / collider.mass);
                                collider.vy = collider.vy + (friction * colliderDirectionY);
                            }
                        }
                        if (item.y + item.height == collider.y && item.x > collider.x - item.width && item.x < collider.x + collider.width && (item.vx != 0 || collider.vx != 0)) {
                            // SOUTH or BOTTOM friction from ITEM
                            seed = Math.random();
                            if (item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (item.vy * item.mass) * seed) / item.mass);
                                item.vx = item.vx + (friction * itemDirectionX);
                            }
                            if (collider.type != Entity.KINEMATIC && item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (collider.vy * collider.mass) * seed) / collider.mass);
                                collider.vx = collider.vx + (friction * colliderDirectionX);
                            }
                        }
                        else if (item.y == collider.y + collider.height && item.x > collider.x - item.width && item.x < collider.x + collider.width && (item.vx != 0 || collider.vx != 0)) {
                            // NORTH or TOP friction from ITEM
                            seed = Math.random();
                            if (item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (item.vy * item.mass) * seed) / item.mass);
                                item.vx = item.vx + (friction * itemDirectionX);
                            }
                            if (collider.type != Entity.KINEMATIC && item.type != Entity.KINEMATIC) {
                                friction = Math.abs((cf * (collider.vy * collider.mass) * seed) / collider.mass);
                                collider.vx = collider.vx + (friction * colliderDirectionX);
                            }
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
                item.vx = item.vx + (item.ax + GRAVITY_X) * delta;
                item.vy = item.vy + (item.ay + GRAVITY_Y) * delta;
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
    e.preventDefault(); // Stop scrolling on iOS
    e.stopPropagation();
    TOUCHES = e.changedTouches;

    if (TOUCHES.length >= 1) {
        MOUSE_X = TOUCHES[0].pageX * PIXEL_RATIO;
        MOUSE_Y = TOUCHES[0].pageY * PIXEL_RATIO;
    }
};

document.ontouchstart = function(e) {
    TOUCHES = e.changedTouches;

    if (TOUCHES.length >= 1) {
        MOUSE_X = TOUCHES[0].pageX * PIXEL_RATIO;
        MOUSE_Y = TOUCHES[0].pageY * PIXEL_RATIO;
    }

};

document.ontouchend = function(e) {
    TOUCHES = e.changedTouches;
};

window.ondevicemotion = function(event) {
    /*
    // Use this to set the engine's gravity to that of the real world
    // by using the accelerometer on the device;
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

VIEWPORT.onmousemove = function(e) {
    MOUSE_X = Math.round(e.layerX * PIXEL_RATIO);
    MOUSE_Y = Math.round(e.layerY * PIXEL_RATIO);
};


var drawMode = false;
var startX;
var startY;

document.onmousedown = function(e) {
    switch (e.which) {
        case 1:
            // Left mouse button
            if (drawMode == false) {
                drawMode = true;
                startX = MOUSE_X;
                startY = MOUSE_Y;
            }
            break;
        case 2:
            // Middle mouse button
            break;
        case 3:
            // Right mouse button
            CAMERA.focusX = CAMERA.toPointX(MOUSE_X);
            CAMERA.focusY = CAMERA.toPointY(MOUSE_Y);
            CAMERA.target = null;
            break;
    }
};

document.onmouseup = function(e) {

    if (drawMode == true) {
        var endX = MOUSE_X - CAMERA.scrollX;
        var endY = MOUSE_Y - CAMERA.scrollY;
        startX = startX - CAMERA.scrollX;
        startY = startY - CAMERA.scrollY;
        var objectX;
        var objectY;
        var objectWidth;
        var objectHeight;
        if (startX < endX) {
            objectX = startX;
            objectWidth = endX - startX;
        }
        else {
            objectX = endX;
            objectWidth = startX - endX;
        }
        if (startY < endY) {
            objectY = startY;
            objectHeight = endY - startY;
        }
        else {
            objectY = endY;
            objectHeight = startY - endY;
        }

        new Entity("Drawn Object", objectWidth, objectHeight, objectX, objectY, Entity.DYNAMIC, "#0000ff", "#000000", 0.5);

        drawMode = false;

    }
};

document.onkeydown = function(e) {
    var event = window.event ? window.event : e;
    var key = event.keyCode;
    //console.log('KEY DOWN: ' + key);
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
    }
    if (key == "83" || key == "40") {
        // S or DOWN key
    }
    if (key == "68" || key == "39") {
        // D or RIGHT key
    }
    if (key == "32") {
        // Spacebar
    }
};

var GameConditions; // This is a function that is set in the game.js file.

var thisStep;
var lastStep;

var waitStart;
var waitEnd;
var waitState;
var waitCallback;

var wait = function(seconds, callback) {
    if (waitState != true) {
        waitStart = thisStep;
        seconds = seconds * 1000;
        waitEnd = waitStart + seconds;
        waitCallback = callback;
        waitState = true;
    }
};

var Engine = function() {
    // Delta Capture
    thisStep = new Date().getTime();
    var delta = (thisStep - lastStep) / 100 || thisStep - thisStep;
    if (delta > 3) { delta = thisStep - thisStep; } // to prevent skipping and freezes.
    lastStep = thisStep;

    if (waitState == true) {
        var waitCheck = function(waitStart, waitEnd, thisStep, callback) {
            if (thisStep >= waitEnd) {
                waitState = false;
                callback();
            }
        }(waitStart, waitEnd, thisStep, waitCallback);
    }

    // Calculations
    Physics(delta);

    GameConditions();

    // Draw
    CAMERA.scrollCheck();
    DrawFrame();

    // Refresh Frame
    VIEWPORT_CONTEXT.drawImage(BUFFER, 0, 0);
    requestAnimationFrame(Engine);
};