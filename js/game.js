var gamelib = new GameLib(512, 480);

gamelib.setBackground("images/background.png");

gamelib.registerSprite("hero", new Sprite("images/hero.png"));

var hero = gamelib.getSprite("hero");

// Reset the game when the player catches a monster
var reset = function () {
	hero.moveCenter(gamelib.canvas);
};

// Update game objects
var update = function (modifier) {
};

// Draw everything
var render = function () {
};

// Let's play this game!
reset();
gamelib.init(update, render);
gamelib.gameLoop();
