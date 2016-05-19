var gamelib = new GameLib(512, 480);

gamelib.setBackground("images/background.png");
gamelib.registerSprite("hero", new Sprite("images/hero.png"));
gamelib.registerSprite("monster", new Sprite("images/monster.png"));

keys = new KeyListener();
key = new Key();

var splatt_sound = new Audio('sounds/splatt.mp3');
var coin_sound = new Audio('sounds/coin.mp3');


var hero = gamelib.getSprite("hero");
var monster = gamelib.getSprite("monster");

var game_start = false;
monster.speed = hero.speed = 200;

var hero_score = 0;
var monster_score = 0;


var coins = [];

// Reset the game when the player catches a monster
var reset = function () {
	hero.moveRandom();
	monster.moveRandom();

	for(var i=0; i<10; i++) {
		gamelib.registerSprite("coin." + i, new Sprite("images/coin.png"));
	}

	for(var i=0; i<10; i++) {
		coins["coin." + i] = gamelib.getSprite("coin." + i);
	}

	for(var i=0; i<10; i++) {
		var coin_hit = "coin." + i;
		// console.log(coins[coin_hit]);
		coins[coin_hit].moveRandom();
		// console.log("coins" + i + "[" + coins[coin_hit].x + "," + coins[coin_hit].y + "]");
	}

	game_start = true;
};

// Update game objects
var update = function (modifier) {

	if(keys.isPressed(key.UP_ARROW)) {
		hero.moveUp();
	} else if(keys.isPressed(key.DOWN_ARROW)) {
		hero.moveDown();
	}

	if(keys.isPressed(key.LEFT_ARROW)) {
		hero.moveLeft();
	} else if(keys.isPressed(key.RIGHT_ARROW)) {
		hero.moveRight();
	}
	if(keys.isPressed(key.W)) {
		monster.moveUp();
	} else if(keys.isPressed(key.S)) {
		monster.moveDown();
	}

	if(keys.isPressed(key.A)) {
		monster.moveLeft();
	} else if(keys.isPressed(key.D)) {
		monster.moveRight();
	}

	if(!game_start && keys.isPressed(32)) {
		reset();
	}
	for(var i=0; i<10; i++) {
		var coin_hit = "coin." + i;
		var coin = coins[coin_hit];
		if(typeof coin !== 'undefined') {
			var hero_collide = gamelib.spritesCollide(hero, coin);
			var monster_collide = gamelib.spritesCollide(monster, coin);
			if(hero_collide || monster_collide) {
				// console.log("coin hit: " + i + " - " + coin_hit + " at " + coin.x + "," + coin.y);
				coin_sound.play();

				if(hero_collide) { hero_score++; }
				else if(monster_collide) { monster_score++; }

				delete coins[coin_hit];
				gamelib.deregisterSprite(coin_hit);
			}
		}
	}

	if((hero_score + monster_score == 10) && game_start) {
		game_start = false;
		console.log("GAME OVER");
	}
};

// Draw everything
var render = function () {
	if((hero_score + monster_score == 10) && !game_start) {
		gamelib.drawText("GAME OVER", gamelib.canvas.width / 2, gamelib.canvas.height / 2);
	}
	gamelib.drawText("Hero: " + hero_score, 32, 32);
	gamelib.drawText("Monster: " + monster_score, 32, gamelib.canvas.height - 64);
};

// Let's play this game!
reset();
gamelib.init(update, render);
gamelib.gameLoop();
