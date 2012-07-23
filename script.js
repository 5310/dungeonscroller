window.onload = function () {
	
    // Initialize.
    init();
    
    // Test.
    test();
    
};

init = function() {
	
    // Dimensions.
    var width = 1000;
    var height = 1000;
    
    // Initialize Crafty.
    Crafty.init(width, height);
    Crafty.canvas.init();
    
    // Loading assets.
    Crafty.load(["static.png"]);
    
    // Defining sprites.
    Crafty.sprite(24, "static.png", {
	sprite_adventurer: [5, 2],
	sprite_bat: [5, 14],
	sprite_brick: [1, 39]
    });
    
    // Custom components:
    
    // move - This components keeps track of all relevant states for movement, 
    // such as "impulses" to discrete now and target position, 
    // and also the ticking movement function.
    Crafty.c("move", {
	speed: 1,		// Peak speed for entity.
	_move: {		// Namespace for internal storage.
	    mx: 0,		// Impulse along x axis in grid units.
	    my: 0,		// Ditto for y.
	    nx: 0,		// Storage for current/previous entity position in pixels by discrete grid units, x.
	    ny: 0,		// Ditto for y.
	    ox: 0,		// Storage for target entity position in pixels by discrete grid units, x.
	    oy: 0,		// Ditto for y.
	    state: 0,		// State to control movement: 0 = ready to move. 1 = moving.
	    speed: 0,		// Current speed.
	    tick: function() {	// Repeating function that does the actual movement.
	    
		// Shorthand for internal storage and other variables.
		var move = this._move;
		var unit = 24;
		move.speed = this.speed;
		
		// Calculate direction of movement.
		var dx = move.mx != 0 ? move.mx > 0 ? 1 : -1 : 0;
		var dy = move.my != 0 ? move.my > 0 ? 1 : -1 : 0;
		
		if ( move.state == 0 ) { // If entity ready to move:		//TODO: Convert this to a switch.
		    
		    // If there is movement, change state and set positions.
		    if ( dx != 0 || dy != 0 ) {
			move.state = 1;
			move.nx = this.x;
			move.ny = this.y;
			move.ox = this.x + dx*unit;
			move.oy = this.y + dy*unit;
		    }
		    
		} 
		if ( move.state == 1 ) {	// If entity is already moving.

		    // Move entity.
		    this.x += dx*move.speed;
		    this.y += dy*move.speed;

		    // Snap entity to target if reached.
		    if ( (dx > 0 && this.x >= move.ox) || (dx < 0 && this.x <= move.ox) )
			this.x = move.ox;
		    if ( (dy > 0 && this.y >= move.oy) || (dy < 0 && this.y <= move.oy) )
			this.y = move.oy;
		    
		    // If target reached, change state back to 0.
		    if ( this.x == move.ox && this.y == move.oy ) {
			move.state = 0;
			move.mx -= dx;
			move.my -= dy;
		    }
		    
		}
		
	    }
	},
	speed_now: 0,		// Storage for current speed.
	init: function() {	// Initialization function for component.
	    this.bind("EnterFrame", this._move.tick);
	}
    });
    
};

test = function() {
    
    player = Crafty.e("2D, Canvas, sprite_adventurer, move")
	.attr({x: 160, y: 96, w: 24, h: 24}) // for Component 2D
	
}
