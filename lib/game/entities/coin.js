ig.module("game.entities.coin")
    .requires("impact.entity")
    .defines(function() {
        // Subclase de ig.Enitity
        EntityCoin = ig.Entity.extend({
            // Establece las dimensiones y distancias para la colisión
            size: { x: 12, y: 12 },
            gravityFactor: 0,

            points: 0,

            checkAgainst: ig.Entity.TYPE.A,

            // Carga una hoja de animaciones
            animSheet: null,

            init: function(x, y, settings) {
                // Llama al constructor del padre
                this.parent(x, y, settings);

                this.points = 10;
                this.animSheet = new ig.AnimationSheet("media/coin.png", 12, 12);
                if(settings.special){
                    this.points = 20;
                    this.animSheet = new ig.AnimationSheet("media/coin2.png", 12, 12);
                }

                // Añade animaciones para la hoja de animación
                this.addAnim("idle", 1, [0]);

            },
            check: function(other) {
                other.addPoints(this.points);
                this.kill();
            },
        });
    });