ig.module("game.entities.skull")
    .requires("game.entities.enemy")
    .defines(function() {
        // Subclase de ig.Enitity
        EntitySkull = EntityEnemy.extend({
            // Establece las dimensiones y distancias para la colisión
            size: { x: 10, y: 10 },
            movementDistance: 100,
            movingForward: true,            
            movingUp: true,            
            gravityFactor: 0,
            startPointX: 0,
            startPointY: 0,
            points: 50,

            // Carga una hoja de animaciones
            animSheet: new ig.AnimationSheet("media/enemies/Skull/animaciones.png", 10, 10),

            init: function(x, y, settings) {
                // Llama al constructor del padre
                this.parent(x, y, settings);
                this.addAnim("idle", 0.1, [0,1,2,3]);
                this.addAnim("fly", 0.1, [4,5,6,7,8,9,10,11]);
                this.addAnim("falling", 0.1, [12,13,14,15],true);
                this.addAnim("die", 0.1, [16,17,18,19,20,21,21,21,21],true);
                this.currentAnim = this.anims.idle;
                this.startPointX = x;
                this.startPointY = y;
            },

            // Se llama a este método en cada frame de cada entidad.
            update: function() {
                this.parent();
                if(!this.death){
                    //Si  el jugador está dentro del rango de movimiento
                    if(Math.abs(ig.game.player.pos.x - this.startPointX) < this.movementDistance && Math.abs(ig.game.player.pos.y - this.startPointY) < this.movementDistance){
                        this.currentAnim = this.anims.fly;
                        if(this.pos.x < ig.game.player.pos.x){
                            this.vel.x = this.speed;
                            this.currentAnim.flip.x = false;
                        }
                        else if(this.pos.x > ig.game.player.pos.x){
                            this.vel.x = this.speed*-1;
                            this.currentAnim.flip.x = true;
                        }
                        if(this.pos.y < ig.game.player.pos.y){
                            this.vel.y = this.speed;
                        }
                        else if(this.pos.y > ig.game.player.pos.y){
                            this.vel.y = this.speed*-1;
                        }
                    }
                    else{
                        if(this.pos.x>this.startPointX){
                            this.vel.x = this.speed/2*-1;
                            this.currentAnim.flip.x = true;
                        }else if(this.pos.x<this.startPointX){
                            this.vel.x = this.speed/2;
                            this.currentAnim.flip.x = false;
                        }
                        if(this.pos.y>this.startPointY){
                            this.vel.y = this.speed/2*-1;
                        }else if(this.pos.y<this.startPointY){
                            this.vel.y=this.speed/2;
                        }
                        
                        if(Math.abs(this.pos.x - this.startPointX) < 1){
                            this.pos.x = this.startPointX;
                            this.vel.x = 0;
                        }
                        if(Math.abs(this.pos.y - this.startPointY) < 1){
                            this.pos.y = this.startPointY;
                            this.vel.y = 0;
                        }
                        if(this.pos.x == this.startPointX && this.pos.y == this.startPointY){
                            this.currentAnim = this.anims.idle;
                        }
                        
                    }
                }
                if(this.currentAnim == this.anims.falling && this.currentAnim.frame == this.currentAnim.sequence.length-1 && this.standing){
                    this.currentAnim = this.anims.die;
                    this.currentAnim.rewind();
                }
            },
            check: function(other) {
                if(!this.death && this.currentAnim != this.anims.falling){
                    this.vel.x = 0;
                    this.vel.y = 0;
                    other.hit(this.points);
                    this.currentAnim = this.anims.falling;
                    this.gravityFactor = 1;
                    this.currentAnim.rewind();
                    this.death = true;
                }
            }
        });
    });