window.onload = function () {
	
    // Initialize.
    init();
    
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
    
};
