window.onload = function () {
    init();
};



// This function will be run once to set-up the game.
init = function() {								
    
    // Sets up Crafty.
    setup: { 
	
	// Pre-reads map to get its dimensions.					//TODO:
	var map_width = 10;
	var map_height = 10;
	var scroll_width = 10;
	var scroll_height = 10;
	
	// Calculate viewport dimensions.
	unit = 24;
	width = map_width*unit;
	height = map_height*unit;
	
	// Initialize Crafty.
	Crafty.init(width, height);
	Crafty.canvas.init();
	
	// Resize container by scrolling-leeway.				//TODO:
	
    }
	
    // Extend Crafty for custom use.
    extend: {
    
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
	set_global_mouse: {
	    
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
    
    }
    
    // Defines and sets-up scenes for the game.
    scenes: {
	
	// Loading scene.
	Crafty.scene("loading", function() {
	    
	    // Loading assets.
	    Crafty.load(["static.png", "animated.png"], function() {
		Crafty.scene("main"); //when everything is loaded, run the main scene
	    });
	    
	    // Defining sprites.
	    Crafty.sprite(24, "static.png", {
		sprite_brick: [1, 39],
		sprite_floor1: [4, 42],
		sprite_floor2: [4, 43],
		sprite_floor3: [10, 42],
		sprite_floor4: [10, 43],
		sprite_trapoff: [3, 49],
		sprite_trapon: [4, 49],
		sprite_dooroff: [1, 38],
		sprite_dooron: [2, 38],
		sprite_switchoff: [3, 37],
		sprite_switchon: [4, 37]
	    });
	    Crafty.sprite(24, "animated.png", {
		sprite_adventurer: [5, 1]
	    });
	
	});
	
	// Main scene.
	Crafty.scene("main", function() {
	    test();								//DEBUG:
	});

	// Load the loading scene.
	Crafty.scene("loading");
    
    }

};



// This function is used for debugging, and run just after the game is set-up.	
test = function() {								//DEBUG:
    
    // A player entity.
    player = createPlayer(120, 120);
    
    // Brick walls.
    for ( var x = 0; x < Crafty.viewport.width; x+=24 ) {
	createWall(x, 0);
	createWall(x, Crafty.viewport.height-24);
    }
    for ( var y = 24; y < Crafty.viewport.height-24; y+=24 ) {
	createWall(0, y);
	createWall(Crafty.viewport.width-24, y);
    }
	
}



// Implements Components.
components: {
    
    // move:
    // This components keeps track of all relevant states for movement, 
    // such as "impulses" to discrete now and target position, 
    // and also the ticking movement function.
    // Depends on: 2D, Collision
    Crafty.c("move", {
	speed: 2,		// Peak speed for entity.
	_move: {		// Namespace for internal storage.		// Object properties MUST be cloned lest they all sync!
	    mx: 0,		// Impulse along x axis in grid units.
	    my: 0,		// Ditto for y.
	    nx: 0,		// Storage for current/previous entity position in pixels by discrete grid units, x.
	    ny: 0,		// Ditto for y.
	    ox: 0,		// Storage for target entity position in pixels by discrete grid units, x.
	    oy: 0,		// Ditto for y.
	    state: 0,		// State to control movement: 0 = ready to move. 1 = moving.
	    speed: 0,		// Current speed.
	    tick: function() {	// Repeating function that does the actual movement.
		
		switch ( this._move.state ) {
		    
		    case 0:	// Entity is ready to move.

			// Reset speed to zero.
			this._move.speed = 0;

			// Trigger an event.
			this.trigger("MovementReady");
			
			return;
			break;
		
		    case 1: 	// If entity is moving:
		    
			// Regulate speed.
			if ( this._move.speed < this.speed )
			    this._move.speed += 0.2;
			else
			    this._move.speed = this.speed;

			// Move entity.
			this.x += this._move.mx*this._move.speed;
			this.y += this._move.my*this._move.speed;

			// Snap entity to target if reached.
			if ( (this._move.mx > 0 && this.x >= this._move.ox) || (this._move.mx < 0 && this.x <= this._move.ox) )
			    this.x = this._move.ox;
			if ( (this._move.my > 0 && this.y >= this._move.oy) || (this._move.my < 0 && this.y <= this._move.oy) )
			    this.y = this._move.oy;
			
			// If target reached: 
			if ( this.x == this._move.ox && this.y == this._move.oy ) {
			    // Change state back to 0.
			    this._move.state = 0;
			}
			
			return;
			break;
		
		}
		
	    },
	    hit: function(array) {
		// If colliding with solid object, revoke entity movement.
		this._move.ox = this._move.nx;
		this._move.oy = this._move.ny;
	    }
	},
	move: function( direction ) {	// Function to initiate movement.
	    
	    // direction:
	    //	 1 = right
	    //	 2 = down
	    //	 3 = left
	    //   4 = up
	    
	    if ( this._move.state == 0 ) { // If entity ready to move.

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
	    // Add dependencies if not present.				//BUG: This should NOT be necessary. I've added `move` after `Collision` on the entity.
	    this.addComponent("Collision");
	    // Clone the internal namespace object.
	    this._move = Crafty.clone(this._move);
	    // Bind the tick.
	    this.bind("EnterFrame", this._move.tick);
	    // Bind hit to collision handler.
	    this.onHit("solid", this._move.hit);
	}
    });
    
    // ctrl_mouse:
    // This component is essentially a non-diagonal fourway joystick
    // that moves the entity based on the clicked mouse's relative position.
    // Depends on: move
    Crafty.c("ctrl_mouse", {
	init: function() {
	    
	    var entity = this;
	    
	    Crafty.bind("GlobalMouseHold", function() { 
		// Calculate cursor position relative to entity.			// Since camera does not follow, entity reaches cursor, and jitters.
		var x = Crafty.mouse.x - entity.x - entity.w/2;
		var y = Crafty.mouse.y - entity.y - entity.h/2;
		// Initiate entity move based of relative location.
		if ( Math.abs(x) > Math.abs(y) )
			if ( x > 0 )
			    entity.move(1);
			else
			    entity.move(3);
		else
		    if ( y > 0 )
			entity.move(2);
		    else
			entity.move(4);
	    });
	    
	}
    });
    
    // ctrl_scroll:
    // What we're here for-- A component that will move the entity by scrolling the window.
    // Depends on: move
    Crafty.c("ctrl_scroll", {
	_ctrl_scroll: {		// Internal storage.
	    ix: 0,		// Internal non-discrete position, x.
	    iy: 0,		// Ditto, y.
	    lx: 0,		// Last horizontal scroll position.
	    ly: 0,		// Ditto vertical.
	    commands: [],	// Stack of movement commands calculated from scrolling.
	    command: function() { 	// Will move the entity from the topmost command on stack.
		this.move(this._ctrl_scroll.commands.pop());	    
	    },
	},	    
	init: function() {
	    
	    // Clone internal storage.
	    this._ctrl_scroll = Crafty.clone(this._ctrl_scroll);

	    // Set shorthands.
	    var ctrl_scroll = this._ctrl_scroll;
	    var entity = this;
	    
	    // Initialize internal non-discrete positions to zero.
	    ctrl_scroll.ix = 0;
	    ctrl_scroll.iy = 0;
	    
	    // Set previous-scroll.
	    ctrl_scroll.lx = window.scrollX;
	    ctrl_scroll.ly = window.scrollY;
	    
	    // Handler for when the page is scrolled.
	    var scroll = function(e) {
		
		// Update internal non-discrete position.
		ctrl_scroll.ix += window.scrollX - ctrl_scroll.lx;
		ctrl_scroll.iy += window.scrollY - ctrl_scroll.ly;

		// Update previous scroll-positions.
		ctrl_scroll.lx = window.scrollX;
		ctrl_scroll.ly = window.scrollY;
		
		// Move either horizontally of vertically:
		if ( Math.abs(ctrl_scroll.ix) > Math.abs(ctrl_scroll.iy) ) {
		    
		    // Calculate distance scrolled in units.
		    var d = Math.abs(ctrl_scroll.ix)/unit;
		    
		    // If it is more than one:
		    if ( d >= 1 ) {
			
			// Calculate direction.
			var m = ctrl_scroll.ix > 0 ? 1 : 3;
			
			// For everx unit of scroll:
			for ( var i = 0; i < d; i++ ) {
			    
			    // Add direction to move commands list.
			    if ( ctrl_scroll.commands.length > 0 ) { 
				if ( m == 1 ) {
				    if ( ctrl_scroll.commands[ctrl_scroll.commands.length-1] == 3 ) { 
					ctrl_scroll.commands.pop(); // If last command is opposite of current direction, nullifx both.
				    } else { 
					ctrl_scroll.commands.push(m); // Else, append command.
				    }
				}
				if ( m == 3 ) {
				    if ( ctrl_scroll.commands[ctrl_scroll.commands.length-1] == 1 ) {
					ctrl_scroll.commands.pop();
				    } else {
					ctrl_scroll.commands.push(m);
				    }
				}
			    } else {
				ctrl_scroll.commands.push(m);
			    }
			    
			    // And revert internal position for that amount.
			    ctrl_scroll.ix -= ctrl_scroll.ix > 0 ? unit : -1*unit;
			}
		    }
		    
		} else {
		    
		    // Calculate distance scrolled in units.
		    var d = Math.abs(ctrl_scroll.iy)/unit;
		    
		    // If it is more than one:
		    if ( d >= 1 ) {
			
			// Calculate direction.
			var m = ctrl_scroll.iy > 0 ? 2 : 4;
			
			// For every unit of scroll:
			for ( var i = 0; i < d; i++ ) {
			    
			    // Add direction to move commands list.
			    if ( ctrl_scroll.commands.length > 0 ) { 
				if ( m == 2 ) {
				    if ( ctrl_scroll.commands[ctrl_scroll.commands.length-1] == 4 ) { 
					ctrl_scroll.commands.pop(); // If last command is opposite of current direction, nullify both.
				    } else { 
					ctrl_scroll.commands.push(m); // Else, append command.
				    }
				}
				if ( m == 4 ) {
				    if ( ctrl_scroll.commands[ctrl_scroll.commands.length-1] == 2 ) {
					ctrl_scroll.commands.pop();
				    } else {
					ctrl_scroll.commands.push(m);
				    }
				}
			    } else {
				ctrl_scroll.commands.push(m);
			    }
			    
			    // And revert internal position for that amount.
			    ctrl_scroll.iy -= ctrl_scroll.iy > 0 ? unit : -1*unit;
			}
		    }
		    
		}		
		
	    };
	    // Add handler to relevant event.
	    Crafty.addEvent(Crafty, window, "scroll", scroll);
	    
	    
	    // Bind command function to when entity is ready to move.
	    this.bind("MovementReady", ctrl_scroll.command);	
	
	}
    });

    // fow:
    // Component that would simulate a fog-of-war.
    // Entities with this component will begin invisibly. 
    // Additionally, they serve as labels for collision with player, which renders them visible again.
    // Depends on: 2D
    Crafty.c("fow", {
	init: function() {		
	    //this.visible = false;						//DEBUG: Visibility toggling not yet implemented yet. So we'll keep it visible.
	}
    });
    
    // eye:
    // Has behavior that would render nearby entities with fow components visible upon collision.
    // Depends on: collision
    Crafty.c("eye", {
	init: function() {		
									    //TODO:
									    // This is unacceptable. Fow visibility toggles should be based upon proximity alone.
									    // Using MovementReady; event and making all nearby fow entities by component.
									    
	    /*// Add dependencies if not present.				//BUG: This should NOT be necessary. I've added `move` after `Collision` on the entity.
	    this.addComponent("Collision");
	    
	    // Handler for collision with fow entities.
	    var hit_fow = function(list) {
		//console.log("ahem");
		for ( var i = 0; i < list.length; i++ )
		    list[i].obj.visible = true;
	    };
	    
	    // Bind collision-handler with fow entities.
	    this.onHit("fow", hit_fow);*/
	    
	}
    });

    // solid:
    // A label-only component for entities that are solid and impede movement.

    // trap:								//TODO:
    
    // door:								//TODO:

}



// Implements Assemblage functions for Entities.
assemblages: {
    
    // The player object.
    createPlayer = function(x, y) {
	// Set constants.
	var margin = 2;
	// Create entity with specific components.
	var player = Crafty.e("2D, Canvas, sprite_adventurer, move, SpriteAnimation, Collision, solid, ctrl_scroll, ctrl_mouse, player")	
									    //DEBUG: `ctrl_mouse` is for debug purposes only.
	    .attr({x: x, y: y, z: 10, w: unit, h: unit}) 	// Set position and size.
	    .animate("sprite_adventurer_animated", 5, 1, 6)	// Define animation sequence.
	    .animate("sprite_adventurer_animated", 45, -1) 	// Set animation to play on loop.
	    .collision([margin, margin], [margin, unit-margin], [unit-margin, unit-margin], [unit-margin, margin]);
	return player;
    };
    
    // Impassable wall tile.
    createWall = function(x, y) {
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, solid, sprite_brick, fow")
	    .attr({x: x, y: y, z: 0, w: unit, h: unit});
	return tile;
    };
    
    // Randomly styled floor tile.
    createFloor = function(x, y) {
	// Randomize floor type.
	var sprite_no = Math.floor(Math.random()*4)+1;
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, sprite_floor"+sprite_no)
	    .attr({x: x, y: y, z: 0, w: unit, h: unit});
	return tile;
    };
    
    // A floor trap that springs when a live entity walks over it.
    createTrap = function(x, y) {
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, fow, trap")			//TODO: trap component unimplemented
	    .attr({x: x, y: y, z: 1, w: unit, h: unit});
	return tile;
    };
    
    // A switch that toggles the specified entity.
    createSwitch = function(x, y, target) {
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, fow, switch")			//TODO: switch component unimplemented
	    .attr({x: x, y: y, z: 1, w: unit, h: unit});
	return tile;
    };
    
    // A door that may or may not impede entry.
    createDoor = function(x, y, target) {
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, fow, door")			//TODO: door component unimplemented
	    .attr({x: x, y: y, z: 1, w: unit, h: unit});
	return tile;
    };

}
