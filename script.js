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
		
		// Regulate speed.						//TODO: This will be changed to allow easing.
		move.speed = this.speed;
		
		
		switch ( move.state ) {
		    
		    case 0:	// Entity is ready to move.
		    
			// Trigger an event.
			Crafty.trigger("MovementReady");
			
			return;
			break;
		
		    case 1: 	// If entity is moving:

			// Move entity.
			this.x += move.mx*move.speed;
			this.y += move.my*move.speed;

			// Snap entity to target if reached.
			if ( (move.mx > 0 && this.x >= move.ox) || (move.mx < 0 && this.x <= move.ox) )
			    this.x = move.ox;
			if ( (move.my > 0 && this.y >= move.oy) || (move.my < 0 && this.y <= move.oy) )
			    this.y = move.oy;
			
			// If target reached, change state back to 0.
			if ( this.x == move.ox && this.y == move.oy ) {
			    move.state = 0;
			}
			
			return;
			break;
		
		}
		
	    }
	},
	move: function( direction ) {	// Function to initiate movement.
	    
	    // direction:
	    //	 1 = right
	    //	 2 = down
	    //	 3 = left
	    //   4 = up
	    
	    // Shorthand and some variables.
	    var move = this._move;
	    var unit = 24;
	    
	    if ( move.state == 0 ) { // If entity ready to move.

		// Set this._movement direction and sprite orientation.
		switch ( direction ) {
		    case 1:	// right
			this._move.mx = 1;
			this._move.my = 0;
			this.unflip('X');
			break;
		    case 2:	// down
			this._move.mx = 0;
			this._move.my = 1;
			break;
		    case 3:	// left
			this._move.mx = -1;
			this._move.my = 0;
			this.flip('X');
			break;
		    case 4:	// up
			this._move.mx = 0;
			this._move.my = -1;
			break;
		    default:	// cancel
			return false;
			break;
		}
				
		// Set state.
		this._move.state = 1;
		// Set current discrete position.
		this._move.nx = this.x;
		this._move.ny = this.y;
		// Set target discrete position.
		this._move.ox = this.x + this._move.mx*unit;
		this._move.oy = this.y + this._move.my*unit;
		
		return true;
	    
	    } else {
		return false;
	    }
	    
	},
	init: function() {	// Initialization function for component.
	    this.bind("EnterFrame", this._move.tick);
	}
    });
    
};

test = function() {
    
    player = Crafty.e("2D, Canvas, sprite_adventurer, move")
	.attr({x: 160, y: 96, w: 24, h: 24}) // for Component 2D
	
}
