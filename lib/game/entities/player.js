ig.module("game.entities.player")
    .requires("impact.entity")
    .defines(function() {
        // Subclase de ig.Enitity
        EntityPlayer = ig.Entity.extend({
            // Establece las dimensiones y distancias para la colisión
            size: { x: 32, y: 32 },
            flip: false,
            gravityFactor: 1,
            maxVel: { x: 300, y: 150 },
            friction: { x: 600, y: 0 },

            speed: 150,
            jump_speed: -600,

            death: false,
            hit: false,

            // Carga una hoja de animaciones
            animSheet: new ig.AnimationSheet("media/player/AnimationSheet_Character.png", 32, 32),

            init: function(x, y, settings) {
                // Llama al constructor del padre
                this.parent(x, y, settings);

                // Añade animaciones para la hoja de animación
                this.addAnim("idle", 0.3, [0,1]);
                this.addAnim('walk', 0.1, [24,25,26,27,28,29,30,31])
                this.addAnim('jump', 0.2, [40,41,42,43,44,45,46,47]);


            },

            // Se llama a este método en cada frame de cada entidad.
            update: function() {
                this.parent();
                if (ig.input.state("left")) {
                    this.accel.x = -this.speed;
                    this.flip = true;
                } else if (ig.input.state("right")) {
                    this.accel.x = this.speed;
                    this.flip = false;
                } else {
                    this.accel.x = 0;
                }

                if (ig.input.pressed("jump") && this.standing) {
                    this.vel.y = this.jump_speed;
                }

                if (!this.standing) {
                    this.currentAnim = this.anims.jump;
                } else if (this.vel.x == 0) {
                    this.currentAnim = this.anims.idle;
                } else {
                    this.currentAnim = this.anims.walk;
                }

                this.currentAnim.flip.x = this.flip;

            }
        });
    });