ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.levels.test',
)
.defines(function(){

	MyGame = ig.Game.extend({
		
		// Load a font
		font: new ig.Font( 'media/04b03.font.png' ),
		gravity: 200,
		
		init: function() {
			ig.input.bind(ig.KEY.LEFT_ARROW, "left");
            ig.input.bind(ig.KEY.RIGHT_ARROW, "right");
            ig.input.bind(ig.KEY.SPACE, "jump");
            this.loadLevel(LevelTest);
            this.player = this.getEntitiesByType(EntityPlayer)[0];
		},
		
		update: function() {
			// Update all entities and backgroundMaps
			this.parent();
			
			// Add your own, additional update code here
            if (this.player) {
                this.screen.x = this.player.pos.x + 100 - ig.system.width / 2;
                this.screen.y = this.player.pos.y - 50 - ig.system.height / 2;
            }
		},
		
		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();
			
			
			// Add your own drawing code here
			this.font.draw( 'Puntos: '+this.player.points, 50, 10, ig.Font.ALIGN.CENTER );
		}
	});


	// Start the Game with 60fps, a resolution of 320x240, scaled
	// up by a factor of 2
	ig.main( '#canvas', MyGame, 60, 580, 260, 2 );

});
