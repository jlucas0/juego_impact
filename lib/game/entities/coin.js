ig.module("game.entities.coin")
    .requires("impact.entity")
    .defines(function() {
        // Subclase de ig.Enitity
        EntityCoin = ig.Entity.extend({
            // Establece las dimensiones y distancias para la colisión
            size: { x: 16, y: 16 },
            gravityFactor: 0,

            points: 0,

            checkAgainst: ig.Entity.TYPE.A,

            // Carga una hoja de animaciones
            animSheet: null,

            init: function(x, y, settings) {
                // Llama al constructor del padre
                this.parent(x, y, settings);

                this.points = 10;
                this.animSheet = new ig.AnimationSheet("media/objects/coins.png", 16, 16);
                if(settings.special){
                    this.points = 20;
                    this.animSheet = new ig.AnimationSheet("media/objects/coins2.png", 16, 16);
                }

                // Añade animaciones para la hoja de animación
                this.addAnim("idle", 0.1, [0,1,2,3,4,5,6,7,8,9,10,11]);

                //Se le pone un frame random para que no empiecen todas igual
                this.currentAnim.gotoFrame(Math.floor(Math.random()*this.currentAnim.sequence.length-1));

            },
            check: function(other) {
                other.addPoints(this.points);
                this.kill();
            },
        });
    });