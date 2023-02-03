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
		levels: [[LevelTest,60]], //Niveles y tiempo en segundos para cada uno
		timer: undefined,
		lastTime: undefined,
		
		init: function() {
			ig.input.bind(ig.KEY.LEFT_ARROW, "left");
            ig.input.bind(ig.KEY.RIGHT_ARROW, "right");
            ig.input.bind(ig.KEY.SPACE, "jump");

            this.loadLevel(this.levels[0][0]);
            this.timer = new ig.Timer();
            this.timer.set(this.levels[0][1]);
            
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


			//Gestor del timer
			let delta = this.timer.delta()*-1;

			let min = Math.floor(delta / 60);
			let seg = Math.floor(delta - min*60);

			if(delta<=0 && !this.player.death){
				this.player.timeout();
				this.timer.pause();
			}
			if(min<0){
				min = 0;
				seg = 0;
			}
			this.font.draw( 'Tiempo: '+min+':'+(seg < 10 ? '0' : '' )+seg, ig.system.width - 50, 10, ig.Font.ALIGN.CENTER );

			//Restar puntos por tiempo
			if(this.player.points > 0){
				console.log(Math.floor(delta));
				if(this.lastTime == undefined){
					this.lastTime = Math.floor(delta);
				}
				if(Math.floor(delta) < this.lastTime){
					this.player.points--;
					this.lastTime = Math.floor(delta);
				}
			}
		}
	});


	// Start the Game with 60fps, a resolution of 320x240, scaled
	// up by a factor of 2
	ig.main( '#canvas', MyGame, 60, 580, 260, 2 );

});
