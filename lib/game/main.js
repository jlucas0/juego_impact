ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'impact.font',

	'game.levels.test',
	'game.levels.test2'
)
.defines(function(){

	MyGame = ig.Game.extend({
		
		// Load a font
		coverImage: new ig.Image('media/menus/portada.png'),
		menuImage: new ig.Image('media/menu.png'),
		font: new ig.Font( 'media/04b03.font.png' ),
		gravity: 150,
		levels: [[LevelTest,60,'musicA'],[LevelTest2,80,'musicB']], //Niveles, tiempo en segundos para cada uno y música de fondo
		timer: undefined,
		lastTime: undefined,
		currentLevel: -1,
		titleBlink: false,
		time: [0,0],
		paused: false,
		end: false,
		
		init: function() {
			ig.input.bind(ig.KEY.LEFT_ARROW, "left");
            ig.input.bind(ig.KEY.RIGHT_ARROW, "right");
            ig.input.bind(ig.KEY.SPACE, "jump");
            ig.input.bind(ig.KEY.ESC, "reload");
            ig.input.bind(ig.KEY.ENTER, "next");

            ig.music.add( 'media/sounds/music/portada.ogg','portada' );
			ig.music.add( 'media/sounds/music/levels/musicA.ogg','musicA' );
			ig.music.add( 'media/sounds/music/levels/musicB.ogg','musicB' );
			ig.music.add( 'media/sounds/music/portada.ogg','pausa' );
			ig.music.add( 'media/sounds/music/gameOver.ogg','gameover' );

			ig.music.loop = true;
			ig.music.volume = 0.4;
			ig.music.play();

            setInterval(()=>{
					if(this.titleBlink){
						this.titleBlink = false;
					}else{
						this.titleBlink = true;
					}
				},500);
		},
		
		update: function() {
			// Update all entities and backgroundMaps
			this.parent();
			
			// Add your own, additional update code here
            if (this.player) {
                this.screen.x = this.player.pos.x + 100 - ig.system.width / 2;
                this.screen.y = this.player.pos.y - 50 - ig.system.height / 2;
            }


            if(this.currentLevel < 0 && ig.input.pressed("jump")){
            	this.currentLevel++;
            	this.levelLoader();
            }
            if(this.currentLevel>=0){
            	//Recarga de nivel y pausa
	            if(!this.player.death && ig.input.pressed("reload") && !this.end){
	            	this.pauseGame();
	            }
	            
	            if(this.player.death && ig.input.pressed("reload")){
	            	this.levelLoader();
	            }


	            if(this.end && ig.input.pressed("next")){
	            	this.pauseGame();
	            	this.end = false;
	            	this.currentLevel++;
	            	this.levelLoader();
	            }

            	//Gestor del timer
				let delta = this.timer.delta()*-1;

				this.time[0] = Math.floor(delta / 60);
				this.time[1] = Math.floor(delta - this.time[0]*60);

				if(delta<=0 && !this.player.death){
					this.player.timeout();
					this.timer.pause();
				}
				if(this.time[0]<0){
					this.time[0] = 0;
					this.time[1] = 0;
				}
            	//Restar puntos por tiempo
				if(this.player.points > 0){
					if(this.lastTime == undefined){
						this.lastTime = Math.floor(delta);
					}
					if(Math.floor(delta) < this.lastTime){
						this.player.points--;
						this.lastTime = Math.floor(delta);
					}
				}
            }

		},
		
		draw: function() {
			// Draw all entities and backgroundMaps
			this.parent();
			
			if(this.currentLevel>=0){

				// Add your own drawing code here
				this.font.draw( 'Puntos: '+this.player.points, 50, 10, ig.Font.ALIGN.CENTER );


				
				this.font.draw( 'Tiempo: '+this.time[0]+':'+(this.time[1] < 10 ? '0' : '' )+this.time[1], ig.system.width - 50, 10, ig.Font.ALIGN.CENTER );
				if(this.paused){
					this.menuImage.draw(0,0);
					if(this.end){
						this.font.draw( "PUNTOS", ig.system.width/2, ig.system.height / 2  - 20, ig.Font.ALIGN.CENTER );
						this.font.draw( this.player.points, ig.system.width/2, ig.system.height / 2, ig.Font.ALIGN.CENTER );
						this.font.draw( "PULSA ENTER PARA CONTINUAR", ig.system.width/2, ig.system.height / 2  + 20, ig.Font.ALIGN.CENTER );
					}else{
						this.font.draw( "PAUSA", ig.system.width/2, ig.system.height / 2, ig.Font.ALIGN.CENTER );
					}
				}
				else if(this.player.death){
					this.font.draw( "Pulsa ESC para reiniciar", ig.system.width/2, ig.system.height / 2, ig.Font.ALIGN.CENTER );
				}
			}
			else{
			
				this.coverImage.draw(ig.system.width/2-(this.	coverImage.width/2),0);
				if(this.titleBlink){
					this.font.draw( "Pulsa ESPACIO para comenzar", ig.system.width/2, ig.system.height / 2+30, ig.Font.ALIGN.CENTER );
				}
				this.font.draw( "CONTROLES", 30, ig.system.height -40, ig.Font.ALIGN.LEFT );
				this.font.draw( "ESPACIO para saltar", 30, ig.system.height -30, ig.Font.ALIGN.LEFT );
				this.font.draw( "FLECHAS para moverse", 30, ig.system.height -20, ig.Font.ALIGN.LEFT );
				this.font.draw( "ESC para pausar", 30, ig.system.height -10, ig.Font.ALIGN.LEFT );
			}
			
		},

		levelLoader: function(){
			this.loadLevel(this.levels[this.currentLevel][0]);
            this.timer = new ig.Timer();
            this.timer.set(this.levels[this.currentLevel][1]);
            this.lastTime = undefined;
            this.player = this.getEntitiesByType(EntityPlayer)[0];
            ig.music.play(this.levels[this.currentLevel][2]);
		},
		pauseGame: function(){
			if(!this.paused){
				this.paused = true;
				this.timer.pause();
				ig.music.play('pausa');
			}else{
				this.paused = false;
				this.timer.unpause();
				ig.music.play(this.levels[this.currentLevel][2]);
			}
		},
		endLevel: function(){
			this.pauseGame();
			this.end = true;
		}
	});


	// Start the Game with 60fps, a resolution of 320x240, scaled
	// up by a factor of 2
	ig.main( '#canvas', MyGame, 60, 580, 260, 2 );

});
