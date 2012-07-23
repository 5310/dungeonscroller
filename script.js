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
	speed: 0,		// Peak speed for entity.
	_move: {		// Namespace for internal storage.
	    mx: 0,		// Impulse along x axis in grid units.
	    my: 0,		// Ditto for y.
	    nx: 0,		// Storage for current/previous entity position in pixels by discrete grid units, x.
	    ny: 0,		// Ditto for y.
	    ox: 0,		// Storage for target entity position in pixels by discrete grid units, x.
	    oy: 0,		// Ditto for y.
	    state: 0,		// State to control movement: 0 = ready to move. 1 = moving.
	    speed: 0,		// Current speed.
	    tick: function() {}	// Repeating function that does the actual movement.
	},
	speed_now: 0,		// Storage for current speed.
	init: function() {	// Initialization function for component.
	    this.bind('enterframe', this._move.tick);
	}
    });
    
};

test = function() {
    
    player = Crafty.e("2D, Canvas, sprite_adventurer, Fourway, Tween")
	.attr({x: 160, y: 96, w: 24, h: 24}) // for Component 2D
	.fourway(10) // for Component Fourway
	.tween({x: 400}, 200);
	
}
