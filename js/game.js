// Insert game generation code here...
/*
for (var i = 0; i < 50; i++) {
    new Entity("Rain Drop", 1, 10, Math.random() * 800, 0, Entity.DYNAMIC, "#0000ff", "#0000ff");
}
*/
var loop;
var speed = 1000 / 60;

var generateRain = function() {
    new Entity("Rain Drop", 1, 20, Math.random() * 800, -100, Entity.DYNAMIC, "#3333ff", "#3333ff", 0, null, 0, 100);
    new Entity("Rain Drop", 1, 15, Math.random() * 800, -100, Entity.DYNAMIC, "#3333ff", "#3333ff", 0, null, 0, 50);
    new Entity("Rain Drop", 1, 10, Math.random() * 800, -100, Entity.DYNAMIC, "#3333ff", "#3333ff", 0, null, 0, 0);


    loop = setTimeout(generateRain, speed);
};

generateRain();