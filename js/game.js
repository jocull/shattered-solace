// Insert game generation code here...

function randomInt(min, max){
    return Math.max(min, Math.round(Math.random() * max));
}

var minRaindropsPerTick = 3;
var maxRaindropsPerTick = 3;
var timePerRaindropTick;
var timePerRaindropBaseTick = 1000 / 60;
var timeSinceRaindropTick = 0;

var generateRain = function() {
    //Is it time to drop more rain yet?
    timePerRaindropTick = timePerRaindropBaseTick  * (SLOW_TIME ? 20 : 1);
    if(((new Date().getTime()) - timeSinceRaindropTick) > timePerRaindropTick){

        timeSinceRaindropTick = (new Date().getTime());
        var rainDropsThisTick = randomInt(minRaindropsPerTick, maxRaindropsPerTick);
        for(var i = 0; i < rainDropsThisTick; i++){
            new Entity("Rain Drop", randomInt(1, 3), randomInt(10, 20), randomInt(1, BUFFER.width), -100, Entity.DYNAMIC, "#3333ff", "#3333ff", 0, null, 0, randomInt(0, 100));
        }
    }
    requestAnimationFrame(generateRain);
};
generateRain(); //Kick it off
