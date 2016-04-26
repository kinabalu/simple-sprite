function GameLib(width, height) {
    var $this = this;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.canvas.width = 512;
    this.canvas.height = 480;
    document.body.appendChild(this.canvas);

    var w = window;
    this.requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    this.keysDown = {};

    addEventListener("keydown", function(e) {
        $this.keysDown[e.keyCode] = true;
    }, false);

    addEventListener("keyup", function(e) {
        delete $this.keysDown[e.keyCode];
    }, false);

    this.then = Date.now();
    this.start = Date.now();
    this.sprites = {};
}

// Cross-browser support for requestAnimationFrame
GameLib.prototype.requestAnimationFrame = function(func) {
    this.requestAnimationFrame(func);
}

GameLib.prototype.elapsedTime = function() {
    var $this = this;

    return Date.now() - this.start;
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

GameLib.prototype.processKeystroke = function(actions) {
	if (38 in gamelib.keysDown) { // Player holding up
	    actions.up();
	}
	if (40 in gamelib.keysDown) { // Player holding down
	    actions.down();
	}
	if (37 in gamelib.keysDown) { // Player holding left
	    actions.left();
	}
	if (39 in gamelib.keysDown) { // Player holding right
	    actions.right();
	}

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
    this.updateFunc(delta / 1000);
    this.render();

    this.then = now;
    this.reqAnimFrame = window.requestAnimationFrame.bind(window);

    this.reqAnimFrame(this.gameLoop.bind(this));
}

GameLib.prototype.registerSprite = function(name, sprite) {
    this.sprites[name] = sprite;
}

GameLib.prototype.getSprite = function(name) {
    return this.sprites[name];
}

GameLib.prototype.randomBetween = function(begin, end) {
    return Math.floor(Math.random() * end) + begin;
}


function Sprite(imageSrc) {
    var $this = this;

    this.ready = false;
    this.image = new Image();
    this.image.onload = function() {
        $this.ready = true;
    };
    this.image.src = imageSrc;
}

Sprite.prototype.moveCenter = function(canvas) {
    this.x = canvas.width / 2;
    this.y = canvas.height / 2;
}

Sprite.prototype.moveRandom = function(canvas) {
  this.x = 32 + (Math.random() * (canvas.width - 64));
	this.y = 32 + (Math.random() * (canvas.height - 64));
}

// Sprite.prototype.moveX = function(xfactor) {
//   directional = xfactor > 0 ? 1 : 0;
//   if (this.x < canvas.width && this.x > 0) {
//     this.x += xfactor;
//   } else if (this.x > 5 && this.x < 0) {
//     this.x
//   }
// }
