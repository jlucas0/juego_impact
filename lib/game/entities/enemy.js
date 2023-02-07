ig.module("game.entities.enemy")
    .requires("impact.entity")
    .defines(function() {
        // Subclase de ig.Enitity
        EntityEnemy = ig.Entity.extend({
            gravityFactor: 0,

            checkAgainst: ig.Entity.TYPE.A,
            death: false,
            speed: 100,
            // Carga una hoja de animaciones
            animSheet: null,

            init: function(x, y, settings) {
                // Llama al constructor del padre
                this.parent(x, y, settings);

            },

            // Se llama a este método en cada frame de cada entidad.
            update: function() {
                if(!ig.game.paused){
                    this.parent();
                    if(this.currentAnim == this.anims.die && (this.currentAnim.frame == this.currentAnim.sequence.length-1)){
                        this.kill();
                    }
                }
            },
            check: function(other) {
                if(this.currentAnim != this.anims.die){
                    other.hit(this.points);
                    this.vel.x = 0;
                    this.vel.y = 0;
                    this.currentAnim = this.anims.die;
                    this.currentAnim.rewind();
                    this.death = true;
                }
            },
            handleMovementTrace: function( res ) {
                if( res.collision.x && this.movingForward) {
                    this.movingForward=false;
                }else if (res.collision.x && !this.movingForward){
                    this.movingForward=true;
                }

                if( res.collision.y && this.movingUp) {
                    this.movingUp=false;
                }else if (res.collision.y && !this.movingUp){
                    this.movingUp=true;
                }
                // Continue resolving the collision as normal
                this.parent(res); 
            }
        });
    });