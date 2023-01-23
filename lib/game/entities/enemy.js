ig.module("game.entities.enemy")
    .requires("impact.entity")
    .defines(function() {
        // Subclase de ig.Enitity
        EntityEnemy = ig.Entity.extend({
            // Establece las dimensiones y distancias para la colisión
            size: { x: 0, y: 0 },
            gravityFactor: 0,

            checkAgainst: ig.Entity.TYPE.A,
            death: false,
            // Carga una hoja de animaciones
            animSheet: null,

            init: function(x, y, settings) {
                // Llama al constructor del padre
                this.parent(x, y, settings);

            },

            // Se llama a este método en cada frame de cada entidad.
            update: function() {
                this.parent();
                if(this.currentAnim == this.anims.die && (this.currentAnim.frame == this.currentAnim.sequence.length-1)){
                    this.kill();
                }
            },
            check: function(other) {
                other.hit();
                if(this.currentAnim != this.anims.die){
                    this.currentAnim = this.anims.die;
                    this.currentAnim.rewind();
                    this.death = true;
                }
            },
        });
    });