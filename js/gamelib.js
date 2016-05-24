function GameLib(width, height) {
    var $this = this;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 512;
    this.canvas.height = 480;
    document.body.appendChild(this.canvas);

    var w = window;
    this.requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    this.then = Date.now();
    this.start = Date.now();
    this.sprites = {};
    this.sounds = {};
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

// Cross-browser support for requestAnimationFrame
GameLib.prototype.requestAnimationFrame = function(func) {
    this.requestAnimationFrame(func);
}

GameLib.prototype.drawTextCenter = function(text) {
  var measured_text = this.ctx.measureText(text);
  text_x = (this.canvas.width - measured_text.width) / 2;
  text_y = this.canvas.height / 2;
  this.drawText(text, text_x, text_y);
}

GameLib.prototype.elapsedTime = function() {
    var $this = this;

    return Date.now() - this.start;
}

GameLib.prototype.elapsedTimeInSeconds = function() {
  var $this = this;
  return (Date.now() - this.start) / 1000;
}

GameLib.prototype.setBackground = function(backgroundLocation) {
    var $this = this;

    // Background image
    this.bgReady = false;
    this.bgImage = new Image();
    this.bgImage.onload = function () {
    	$this.bgReady = true;
    };
    this.bgImage.src = backgroundLocation;
}

GameLib.prototype.drawText = function(text, x, y) {
	// Score
	this.ctx.fillStyle = "rgb(250, 250, 250)";
	this.ctx.font = "24px Helvetica";
	this.ctx.textAlign = "left";
	this.ctx.textBaseline = "top";
	this.ctx.fillText(text, x, y);
}

GameLib.prototype.render = function() {
    if(this.bgReady) {
        this.ctx.drawImage(this.bgImage, 0, 0);
    }

    for (var property in this.sprites) {
        if (this.sprites.hasOwnProperty(property)) {
            sprite = this.sprites[property];
            // console.log(sprite);
            if(sprite.ready) {
                this.ctx.drawImage(sprite.image, sprite.x, sprite.y);
            }
        }
    }

    this.renderFunc();
}

GameLib.prototype.init = function(updateFunc, renderFunc) {
    this.updateFunc = updateFunc;
    this.renderFunc = renderFunc;
}

GameLib.prototype.spritesCollide = function(first, second) {
	if (first.x <= (second.x + 32) && second.x <= (first.x + 32) && first.y <= (second.y + 32) && second.y <= (first.y + 32)) {
	    return true;
	}

	return false;
}

GameLib.prototype.gameLoop = function() {
    var now = Date.now();
    var delta = now - this.then;
    // console.log("this.then:", this.then);
    this.modifier = delta / 1000;
    this.updateFunc(this.modifier);
    this.render();

    this.then = now;
    this.reqAnimFrame = window.requestAnimationFrame.bind(window);

    this.reqAnimFrame(this.gameLoop.bind(this));
}

GameLib.prototype.registerSprite = function(name, sprite) {
    this.sprites[name] = sprite;
    sprite.gamelib = this;
}

GameLib.prototype.registerSound = function(name, audio) {
  this.sounds[name] = audio;
}

GameLib.prototype.deregisterSprite = function(name) {
  delete this.sprites[name];
}

GameLib.prototype.getSprite = function(name) {
    return this.sprites[name];
}

GameLib.prototype.getSound = function(name) {
  return this.sounds[name];
}

GameLib.prototype.randomBetween = function(begin, end) {
    return Math.floor(Math.random() * end) + begin;
}

function Sprite(imageSrc) {
    var $this = this;

    this.DIRECTION = {
      NOT: 0,
      LEFT: 1,
      RIGHT: 2,
      UP: 3,
      DOWN: 4
    };

    this.direction = this.DIRECTION.RIGHT;

    this.ready = false;
    this.image = new Image();
    this.image.onload = function() {
        $this.ready = true;
    };
    this.image.src = imageSrc;
}

Sprite.prototype.move = function() {
  switch(this.direction) {
    case this.DIRECTION.LEFT:
      return this.moveLeft();
    case this.DIRECTION.RIGHT:
      return this.moveRight();
    case this.DIRECTION.UP:
      return this.moveUp();
    case this.DIRECTION.DOWN:
      return this.moveDown();
  }
}
Sprite.prototype.moveLeft = function() {
  worked = false;
  if(this.x > this.image.width) {
      this.x -= this.speed * this.gamelib.modifier;
      worked = true;
      this.direction = this.DIRECTION.LEFT;
  }

  return worked;
}

Sprite.prototype.moveRight = function() {
  worked = false;
  if(this.x < (this.gamelib.canvas.width - this.image.width)) {
      this.x += this.speed * this.gamelib.modifier;
      worked = true;
      this.direction = this.DIRECTION.RIGHT;
  }

  return worked;
}

Sprite.prototype.moveUp = function() {
  worked = false;
  if(this.y > this.image.height) {
    this.y -= this.speed * this.gamelib.modifier;
    worked = true;
    this.direction = this.DIRECTION.UP;
  }

  return worked;
}

Sprite.prototype.moveDown = function() {
  worked = false;
  if(this.y < (this.gamelib.canvas.height - this.image.height)) {
    this.y += this.speed * this.gamelib.modifier;
    worked = true;
    this.direction = this.DIRECTION.DOWN;
  }

  return worked;
}

Sprite.prototype.moveCenter = function() {
    this.x = this.gamelib.canvas.width / 2;
    this.y = this.gamelib.canvas.height / 2;
}

Sprite.prototype.moveRandom = function() {
  this.x = 32 + (Math.random() * (this.gamelib.canvas.width - 64));
	this.y = 32 + (Math.random() * (this.gamelib.canvas.height - 64));
}


function KeyListener() {
  this.pressedKeys = [];

  this.UP_ARROW = 38;
  this.DOWN_ARROW = 40;
  this.LEFT_ARROW = 37;
  this.RIGHT_ARROW = 39;
  this.SPACE_BAR = 32;

  this.keydown = function(e) {
    this.pressedKeys[e.keyCode] = true;
  };

  this.keyup = function(e) {
    this.pressedKeys[e.keyCode] = false;
  }

  document.addEventListener("keydown", this.keydown.bind(this));
  document.addEventListener("keyup", this.keyup.bind(this));
}

KeyListener.prototype.isPressed = function(key) {
  var keyCode = key;
  if(!isNumeric(key)) {
    keyCode = key.charCodeAt()
  }
  return this.pressedKeys[keyCode] ? true : false;
}

KeyListener.prototype.addKeyPressListener = function(keyCode, callback) {
  document.addEventListener("keypress", function(e) {
    if(e.keyCode == keyCode)
      callback(e);
  });
};
