ig.module("game.entities.rat")
    .requires("game.entities.enemy")
    .defines(function() {
        // Subclase de ig.Enitity
        EntityRat = EntityEnemy.extend({
            // Establece las dimensiones y distancias para la colisión
            size: { x: 18, y: 14 },
            movementDistance: 70,
            movingForward: true,            
            gravityFactor: 1,
            startPoint: 0,
            points: 10,

            // Carga una hoja de animaciones
            animSheet: new ig.AnimationSheet("media/enemies/Rat/animaciones.png", 20, 14),

            init: function(x, y, settings) {
                // Llama al constructor del padre
                this.parent(x, y, settings);
                this.addAnim("run", 0.1, [0,1,2,3,4,5]);
                this.addAnim("die", 0.1, [6,7,8,9,10,10,10,10,10,10],true);
                this.currentAnim = this.anims.run;
                this.startPoint = x;
            },

            // Se llama a este método en cada frame de cada entidad.
            update: function() {
                this.parent();
                if(!this.death){
                    //Avanzando
                    if(this.movingForward){
                        this.pos.x += 1.5;
                        if(this.pos.x >= this.startPoint + this.movementDistance){
                            this.movingForward = false;
                        }
                    }
                    //Retrocediendo
                    else{
                        this.pos.x -= 1.5;
                        if(this.pos.x <= this.startPoint - this.movementDistance){
                            this.movingForward = true;
                        }
                    }
                    this.currentAnim.flip.x = !this.movingForward;

                }
            }
        });
    });