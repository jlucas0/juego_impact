ig.module("game.entities.bat")
    .requires("game.entities.enemy")
    .defines(function() {
        // Subclase de ig.Enitity
        EntityBat = EntityEnemy.extend({
            // Establece las dimensiones y distancias para la colisión
            size: { x: 18, y: 16 },
            movementDistance: 40,
            movingForward: true,            
            movingUp: true,            
            gravityFactor: 0,
            startPointX: 0,
            startPointY: 0,
            points: 20,

            // Carga una hoja de animaciones
            animSheet: new ig.AnimationSheet("media/enemies/Bat/animaciones.png", 18, 16),

            init: function(x, y, settings) {
                // Llama al constructor del padre
                this.parent(x, y, settings);
                this.addAnim("fly", 0.1, [0,1,2,3]);
                this.addAnim("falling", 0.1, [4,5,6,7,8,9],true);
                this.addAnim("die", 0.1, [10,11,12,13,14,14,14,14,14,14],true);
                this.currentAnim = this.anims.fly;
                this.startPointX = x;
                this.startPointY = y;
            },

            // Se llama a este método en cada frame de cada entidad.
            update: function() {
                this.parent();
                if(!this.death){
                    //Avanzando
                    if(this.movingForward){
                        this.pos.x += 1.5;
                        if(this.pos.x >= this.startPointX + this.movementDistance){
                            this.movingForward = false;
                        }
                    }
                    //Retrocediendo
                    else{
                        this.pos.x -= 1.5;
                        if(this.pos.x <= this.startPointX - this.movementDistance){
                            this.movingForward = true;
                        }
                    }
                    this.currentAnim.flip.x = !this.movingForward;

                    //Subiendo
                    if(this.movingUp){
                        this.pos.y += 0.5;
                        if(this.pos.y >= this.startPointY + this.movementDistance){
                            this.movingUp = false;
                        }
                    }
                    //Bajando
                    else{
                        this.pos.y -= 0.5;
                        if(this.pos.y <= this.startPointY - this.movementDistance){
                            this.movingUp = true;
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
                    other.hit(this.points);
                    this.currentAnim = this.anims.falling;
                    this.gravityFactor = 1;
                    this.currentAnim.rewind();
                    this.death = true;
                }
            }
        });
    });