// Insert game generation code here...

/*

function randomInt(min, max){
    return Math.max(min, Math.round(Math.random() * max));
}

var minRaindropsPerTick = 3;
var maxRaindropsPerTick = 5;
var timePerRaindropTick;
var timePerRaindropBaseTick = 1000 / 60;
var timeSinceRaindropTick = 0;

var generateRain = function() {
    //Is it time to drop more rain yet?
    var time = (new Date().getTime());
    timePerRaindropTick = timePerRaindropBaseTick  * (SLOW_TIME ? SLOW_TIME_FACTOR : 1);
    if((time - timeSinceRaindropTick) > timePerRaindropTick){

        timeSinceRaindropTick = time;
        var rainDropsThisTick = randomInt(minRaindropsPerTick, maxRaindropsPerTick);
        for(var i = 0; i < rainDropsThisTick; i++){
            var size1 = randomInt(2, 4);
            var size2 = randomInt(2, 4);
            var size3 = randomInt(2, 4);
            var size4 = randomInt(2, 4);
            if (GRAVITY_Y > 0) { new Entity("Rain Drop", size1, size1, randomInt(-100, BUFFER.width + 100), -100, Entity.DYNAMIC, "#3333ff", "#3333ff", 0, null, 0, 0); }
            else if (GRAVITY_Y < 0) { new Entity("Rain Drop", size2, size2, randomInt(-100, BUFFER.width + 100), BUFFER.height + 100, Entity.DYNAMIC, "#3333ff", "#3333ff", 0, null, 0, 0); }
            if (GRAVITY_X > 0) { new Entity("Rain Drop", size3, size3, -100, randomInt(-100, BUFFER.height + 100), Entity.DYNAMIC, "#3333ff", "#3333ff", 0, null, 0, 0); }
            else if (GRAVITY_X < 0) { new Entity("Rain Drop", size4, size4, BUFFER.width + 100, randomInt(-100, BUFFER.height + 100), Entity.DYNAMIC, "#3333ff", "#3333ff", 0, null, 0, 0); }
        }
    }
    requestAnimationFrame(generateRain);
};
generateRain(); //Kick it off

*/

