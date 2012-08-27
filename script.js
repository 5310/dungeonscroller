window.onload = function () {
    init();
};



// This function will be run once to set-up the game.
init = function() {								
    
    // Sets up Crafty.
    setup: { 
	
	// Load mapdata.							//TODO:
	
	// Pre-reads map to get its dimensions.
	map_width = mapdata.size.x;
	map_height = mapdata.size.y;
	scroll_width = mapdata.scroll.x;
	scroll_height = mapdata.scroll.y;
	origin_width = mapdata.origin.x;
	origin_height = mapdata.origin.y;
	
	// Calculate viewport dimensions.
	unit = 24;
	width = map_width*unit;
	height = map_height*unit;
	
	// Initialize Crafty.
	Crafty.init(width, height);
	Crafty.canvas.init();
	
	// Resize container by scrolling-leeway.
	// Add margins to Crafty stage in order to center it.
	var c = Crafty.stage.elem;
	c.style.marginLeft = c.style.marginRight = ( ( window.innerWidth + (scroll_width-map_width)*unit  ) / 2 )+"px";
	c.style.marginTop = c.style.marginBottom = ( ( window.innerHeight + (scroll_height-map_height)*unit ) / 2 ) +"px";
	// Resize body horizontally, since it doesn't fit otherwise.
	document.body.style.width = ( window.innerWidth + scroll_width*unit )+"px";
	// Scroll document to center origin.
	window.scrollBy(mapdata.origin.x*unit, mapdata.origin.y*unit);
    }
	
    // Extend Crafty for custom use.
    extend: {
	
	// Global score variable.
	Crafty.extend({
	    score: 0,
	    total: 0
	});
    
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
	    Crafty.load(["sprites.png", "sprites_new.png"], function() {
		Crafty.scene("main"); //when everything is loaded, run the main scene
	    });
	    
	    // Defining sprites.
	    Crafty.sprite(24, "sprites.png", {
		sprite_brick: [3, 1],
		sprite_floor1: [0, 1],
		sprite_floor2: [0, 2],
		sprite_floor3: [1, 1],
		sprite_floor4: [1, 2],
		sprite_trapoff: [0, 3],
		sprite_trapon: [1, 3],
		sprite_dooroff: [2, 2],
		sprite_dooron: [3, 2],
		sprite_switchoff: [2, 3],
		sprite_switchon: [3, 3],
		sprite_gold: [3, 0],
		sprite_skull: [2, 0],
		sprite_adventurer: [0, 0]
	    });
	    
	    /*// Defining sprites.
	    Crafty.sprite(24, "sprites_new.png", {
		sprite_brick: [3, 1],
		sprite_floor1: [0, 1],
		sprite_floor2: [0, 2],
		sprite_floor3: [1, 1],
		sprite_floor4: [1, 2],
		sprite_rock1: [2, 2],
		sprite_rock2: [3, 2],
		sprite_trap: [2, 1],
		sprite_gold: [3, 0],
		sprite_skull: [2, 0],
		sprite_adventurer: [0, 0]
	    });*/
	
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
    player = createPlayer(mapdata.origin.x*unit, mapdata.origin.y*unit);
    
    // Draw map.
    createMap(mapdata);
	
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
	    // Add dependencies if not present.					//BUG: This should NOT be necessary. I've added `move` after `Collision` on the entity.
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
		// Calculate cursor position relative to entity.		// Since camera does not follow, entity reaches cursor, and jitters.
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

    // player:
    // The player entity. Used as a label by a lot of components, and checks if player has hit a trap.
    // Depends on: 2D, Collision, move
    Crafty.c("player", {
	init: function (hitlist) {
	
	    // Hit handler.
	    var hit = function (hitlist) {
		for ( var i = 0; i < hitlist.length; i++ ) {
		    if ( hitlist[i].obj.active ) {
			if ( this.visible ) {
			    this.visible = false;
			    this.speed = 0;
			    createDeath();
			    Crafty.e("2D, Canvas, sprite_skull").attr({x: this.x, y: this.y, z: 10, w: unit, h: unit});
			}
			return;
		    }
		}
	    };
	
	    // Bind handler.
	    this.onHit("trap", hit);
	    
	}
    });

    // fow:
    // Component that would simulate a fog-of-war.
    // Entities with this component will begin invisibly. 
    // Additionally, they serve as labels for collision with player, which renders them visible again.
    // Depends on: 2D
    Crafty.c("fow", {
	init: function() {		
	    this.visible = false;						//DEBUG: Visibility toggling not yet implemented yet. So we'll keep it visible.
	}
    });
    
    // eye:
    // Has behavior that would render nearby entities with fow components visible upon collision.
    // Depends on: collision, move
    Crafty.c("eye", {
	init: function() {	
	    
	    var makeVisible = function() {
		// Collect ids of all fow entities and iterate through them:
		var fows = Crafty("fow");
		for ( var i = 0; i < fows.length; i++ ) {
		    // Get the actual entity.
		    var fow = Crafty(fows[i]);
		    // If entity is close enough to this entity, make it visible.
		    if ( Math.sqrt( Math.pow(fow.x-this.x, 2) + Math.pow(fow.y-this.y, 2) ) <= 2*unit )
			fow.visible = true;
		}
	    }
	    
	    // Bind command function to when entity is ready to move.
	    this.bind("MovementReady", makeVisible);
	    
	}
    });

    // solid:
    // A label-only component for entities that are solid and impede movement.
    
    // heavy:
    // A label-only component that should be used by anything that moves to trigger switches.
    
    // voh:
    // This component hides the entity when touched by the player and creates a floor-tile instead.
    // Depends on: collision
    Crafty.c("voh", {
	init: function() {
	    
	    // Add Collision component.
	    this.addComponent("Collision");
	    
	    // Destory and floor function.
	    var hit = function() {
		createFloor(this.x, this.y);
		this.destroy();
	    }
	    
	    // Bind vanishing function to hit.
	    this.onHit("player", hit);
	    
	}
    });
    
    // signal:
    // A simple value component that will denote the channel of signals to use for an Entityś other components.
    Crafty.c("signal", {signal: 0});

    // trap:
    // This component makes the entity a trap that listens to whatever signal channel has been set and toggles itself.
    // Depends on: signal
    Crafty.c("trap", {
	active: true,
	init: function() {
	    
	    // Add Collision component.
	    this.addComponent("sprite_trapon");
	    
	    // Set scope for global event handler.
	    var self = this;
	    
	    // Bind the handler to the event.
	    Crafty.bind("GlobalSwitchToggle"+this.signal, function() {	
		if ( self.has("sprite_trapon") ) {
		    self.removeComponent("sprite_trapon", false);
		    self.addComponent("sprite_trapoff");
		    self.active = false;
		} else {
		    self.removeComponent("sprite_trapoff", false);
		    self.addComponent("sprite_trapon");
		    self.active = true;
		}
	    });
	    
	}	
		
    });
    
    // door:
    // This component makes the entity a door that listens to whatever signal channel has been set and toggles itself.
    // Depends on: signal
    Crafty.c("door", {
	
	init: function() {
	    
	    // Add Collision component.
	    this.addComponent("sprite_dooron, solid");
	    
	    // Set scope for global event handler.
	    var self = this;
	    
	    // Bind the handler to the event.
	    Crafty.bind("GlobalSwitchToggle"+this.signal, function() {		
		if ( self.has("sprite_dooron") ) {
		    self.removeComponent("sprite_dooron", false);
		    self.removeComponent("solid", false);
		    self.addComponent("sprite_dooroff");
		} else {
		    self.removeComponent("sprite_dooroff", false);
		    self.addComponent("sprite_dooron");
		    self.addComponent("solid");
		}
	    });
	    
	}	
		
    });
    
    // switch:
    // A tile that will trigger a certain signal when stepped on by anything heavy.
    // Depends on: collision, signal
    Crafty.c("switch", {
	_switch: {
	    active: true,
	    ready: true,
	    toggle: function() {
		// If ready, toggle.
		if ( this._switch.ready ) {
		    if ( this._switch.active ) {
			this.removeComponent("sprite_switchon", false);
			this.addComponent("sprite_switchoff");
			this._switch.active = false;
			Crafty.trigger("GlobalSwitchToggle"+this.signal);
		    } else {
			this.removeComponent("sprite_switchoff", false);
			this.addComponent("sprite_switchon");
			this._switch.active = true;
			Crafty.trigger("GlobalSwitchToggle"+this.signal);
		    }
		    this._switch.ready = false;
		    // Wait 1sec to become ready again.
		    this.timeout( 
			function() { this._switch.ready = true }, 1000);	// Using this.timeout instead of setTimeOut directly preserves 'this' to the entity.
		}
	    }
	},
	init: function() {
	    
	    // Add Collision component.
	    this.addComponent("sprite_switchon, Collision");
	    
	    // Clone the internal namespace object.
	    this._switch = Crafty.clone(this._switch);
	    
	    var that = this;
	    
	    // Bind the handlers to the events.
	    this.onHit("heavy", this._switch.toggle);
	    
	}		
    });

    // gold:
    // When walked over by player, increments score.
    // Depends on: Collision
    Crafty.c("point", {
	init: function() {
	    
	    // Add Collision component.
	    this.addComponent("Collision");
	   
	    // Destory and floor function.
	    var hit = function() {
		Crafty.score += 1
		createFloor(this.x, this.y);
		this.destroy();
	    }
	    
	    // Bind function to hit.
	    this.onHit("player", hit);
	   
	}
    });

}



// Implements Assemblage functions for Entities.
assemblages: {
    
    // The player object.
    createPlayer = function(x, y) {
	// Set constants.
	var margin = 2;
	// Create entity with specific components.
	var player = Crafty.e("2D, Canvas, sprite_adventurer, move, SpriteAnimation, Collision, solid, ctrl_scroll, player, eye, heavy")
	    .attr({x: x, y: y, z: 10, w: unit, h: unit}) 	// Set position and size.
	    .animate("sprite_adventurer_animated", 0, 0, 1)	// Define animation sequence.
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
    
    // Passable wall tile.
    createWallSecret = function(x, y) {
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, sprite_brick, voh, fow")
	    .attr({x: x, y: y, z: 1, w: unit, h: unit});
	return tile;
    };
    
    // Gold!
    createGold = function(x, y) {
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, sprite_gold, fow, point")
	    .attr({x: x, y: y, z: 1, w: unit, h: unit});
	return tile;
    };
    
    // Randomly styled floor tile.
    createFloor = function(x, y) {
	// Randomize floor type.
	var sprite_no = Math.floor(Math.random()*4)+1;
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, fow, sprite_floor"+sprite_no)
	    .attr({x: x, y: y, z: 0, w: unit, h: unit});
	return tile;
    };
    
    // A floor trap that springs when a live entity walks over it.
    createTrap = function(x, y, signal, state) {
	// Set state for the togglable entity.
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, fow")
	    .attr({x: x, y: y, z: 1, w: unit, h: unit})
	    .attr({signal: signal})
	    .addComponent("trap");
	// Set entity to off if asked.
	if ( typeof(state) !== 'undefined' && !state ) {
	    tile.removeComponent("sprite_trapon", false);
	    tile.addComponent("sprite_trapoff");
	    tile.active = false;
	}
	return tile;
    };
    
    // A switch that toggles the specified entity.
    createSwitch = function(x, y, signal, state) {
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, fow, switch")
	    .attr({x: x, y: y, z: 1, w: unit, h: unit})
	    .attr({signal: signal})
	    .addComponent("switch");
	// Set entity to off if asked.
	if ( typeof(state) !== 'undefined' && !state ) {
	    tile.removeComponent("sprite_switchon", false);
	    tile.addComponent("sprite_switchoff");
	    tile._switch.active = false;
	}
	return tile;
    };
    
    // A door that may or may not impede entry.
    createDoor = function(x, y, signal, state) {
	// Create entity with specific components.
	var tile = Crafty.e("2D, Canvas, fow")
	    .attr({x: x, y: y, z: 1, w: unit, h: unit})
	    .attr({signal: signal})
	    .addComponent("door");
	// Set entity to off if asked.
	if ( typeof(state) !== 'undefined' && !state ) {
	    tile.removeComponent("sprite_dooron", false);
	    tile.removeComponent("solid", false);
	    tile.addComponent("sprite_dooroff");
	}
	return tile;
    };
    
    // Draw the map from mapdata. This toos hould be run only once.
    createMap = function(mapdata) {
	
	// Iterate through mapdata:
	for ( var y = 0; y < mapdata.map.length; y++ ) {
	    var row = mapdata.map[y].split('');
	    for ( var x = 0; x < row.length; x++ ) {
		// For specific code of tiles:
		switch(row[x]) {
		    
		    case ".": 	//floor
			createFloor(x*unit, y*unit);
			break;
			
		    case "X": 	//wall
			createWall(x*unit, y*unit);
			break;
			
		    case "x": 	//secretwall
			createWallSecret(x*unit, y*unit);		
			break;
			
		    case "1": 	//switch 1
			createSwitch(x*unit, y*unit, 1);	
			break;
		    case "2": 	//switch 2
			createSwitch(x*unit, y*unit, 2);	
			break;
		    case "3": 	//switch 3
			createSwitch(x*unit, y*unit, 3);	
			break;
			
		    case "A": 	//trap on
			createTrap(x*unit, y*unit, 1);
			break;
		    case "B": 	//trap on
			createTrap(x*unit, y*unit, 2);
			break;
		    case "C": 	//trap on
			createTrap(x*unit, y*unit, 3);
			break;
			
		    case "a": 	//trap off
			createTrap(x*unit, y*unit, 1, false);
			break;
		    case "b": 	//trap off
			createTrap(x*unit, y*unit, 2, false);
			break;
		    case "c": 	//trap off
			createTrap(x*unit, y*unit, 3, false);
			break;
			
		    case "H": 	//door closed
			createDoor(x*unit, y*unit, 1);
			break;
		    case "J": 	//door closed
			createDoor(x*unit, y*unit, 2);
			break;
		    case "K": 	//door closed
			createDoor(x*unit, y*unit, 3);
			break;
			
		    case "h": 	//door open
			createDoor(x*unit, y*unit, 1, false);
			break;
		    case "j": 	//door open
			createDoor(x*unit, y*unit, 2, false);
			break;
		    case "k": 	//door open
			createDoor(x*unit, y*unit, 3, false);
			break;
			
		    case "$":	//gold
			createGold(x*unit, y*unit, 3);
			Crafty.total += 1;
			break;
			
		    default:	//nothing
			break;
			
		}
		
	    }
	}
	
    };

    // Draws the death-message on screen with score.
    createDeath = function() {
	// Set scores.
	document.getElementById("goldcollected").innerHTML= ""+Crafty.score;
	document.getElementById("goldtotal").innerHTML= ""+Crafty.total;
	// Display message.
	document.getElementById("deathmessage").style.visibility = "visible";
    }

}
