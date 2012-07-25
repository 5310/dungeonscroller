window.onload = function () {
	
    // Initialize.
    init();
    
    // Test.
    test();
    
};

init = function() {
    
    // Setup: //
	
    // Dimensions.
    var width = 1000;
    var height = 1000;
    
    // Initialize Crafty.
    Crafty.init(width, height);
    Crafty.canvas.init();
    
    // Add an object to store global mouse states.
    Crafty.extend({
	mouse: {
	    down: false,// current state of mouse
	    x: 0,	// current cursor x position
	    y: 0,	// ditto for y
	    px: 0,	// last cursor x position
	    py: 0,	// ditto for y
	    // Triggers the global mouse-hold event once. Internal.
	    triggerGlobalMouseHold: function() {
		Crafty.trigger("GlobalMouseHold");
	    }
	}
    });
    // Set-up DOM event handlers to set global mouse-states and events.
    {
	// Get Crafty canvas.
	var c = Crafty.stage.elem;
	
	// Function for when mouse is brought down.
	var down = function(e) {
	    // Sets global mouse-down flag.
	    Crafty.mouse.down = true;
	    // Initiates GlobalMouseHold event.
	    Crafty.bind("EnterFrame", Crafty.mouse.triggerGlobalMouseHold);	    	    
	};
	// Add handler to relevant event.
	Crafty.addEvent(Crafty, c, "mousedown", down);
	
	// Function for when mouse if moved up or away.
	var up = function(e) {
	    // Unsets global mouse-down flag.
	    Crafty.mouse.down = false;
	    // Revokes GlobalMouseHold event.
	    Crafty.unbind("EnterFrame", Crafty.mouse.triggerGlobalMouseHold);
	};
	// Add handler to relevant events.
	Crafty.addEvent(Crafty, c, "mouseup", up);
	Crafty.addEvent(Crafty, c, "mouseout", up);
	
	// Function for when mouse moves. This sets the coordinates.
	var move = function(e) {
	    Crafty.mouse.px = Crafty.mouse.x;
	    Crafty.mouse.py = Crafty.mouse.y;
	    Crafty.mouse.x = e.offsetX;
	    Crafty.mouse.y = e.offsetY;
	};
	// Add handler to relevant event.
	Crafty.addEvent(Crafty, c, "mousemove", move);
    }
    
    
    // Scenes: //
    
    // Loading scene.
    Crafty.scene("loading", function() {
	
	// Loading assets.
	Crafty.load(["static.png", "animated.png"], function() {
	    Crafty.scene("main"); //when everything is loaded, run the main scene
	});
	
	// Defining sprites.
	Crafty.sprite(24, "static.png", {
	    sprite_adventurer: [5, 2],
	    sprite_bat: [5, 14],
	    sprite_brick: [1, 39]
	});
    
    });
    
    // Main scene.
    Crafty.scene("main", function() {
	test();
    });

    // Load the loading scene.
    Crafty.scene("loading");
    
    
    // Components: //
    
    // move:
    // This components keeps track of all relevant states for movement, 
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
    
    // A player entity.
    player = Crafty.e("2D, Canvas, sprite_adventurer, move")
	.attr({x: 160, y: 96, w: 24, h: 24}) // for Component 2D
    // Mouse-based controls for player entity.
    Crafty.bind("GlobalMouseHold", function() { 
	// Calculate cursor position relative to entity.
	var x = Crafty.mouse.x - player.x - player.w/2;
	var y = Crafty.mouse.y - player.y - player.h/2;
	// Initiate entity move based of relative location.
	if ( Math.abs(x) > Math.abs(y) )
	    if ( x > 0 )
		player.move(1);
	    else
		player.move(3);
	else
	    if ( y > 0 )
		player.move(2);
	    else
		player.move(4);
    });
	
}
