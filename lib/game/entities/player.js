ig.module("game.entities.player")
    .requires("impact.entity")
    .defines(function() {
        // Subclase de ig.Enitity
        EntityPlayer = ig.Entity.extend({
            // Establece las dimensiones y distancias para la colisión
            size: { x: 20, y: 30 },
            offset: { x: 6, y: 1 },
            flip: false,
            gravityFactor: 1,
            maxVel: { x: 300, y: 150 },
            friction: { x: 400, y: 0 },
            font: new ig.Font( 'media/04b03.font.png' ),
            speed: 0,
            accel: 4,
            jump_speed: -600,

            death: false,
            damage: {points:0,duration:3,timer:undefined,blink:{active:false,last:0,interval:0.2}},

            type: ig.Entity.TYPE.A,

            points: 0,
            // Carga una hoja de animaciones
            animSheet: new ig.AnimationSheet("media/player/AnimationSheet_Character.png", 32, 32),

            init: function(x, y, settings) {
                // Llama al constructor del padre
                this.parent(x, y, settings);

                // Añade animaciones para la hoja de animación
                this.addAnim("idle", 0.3, [0,1]);
                this.addAnim('walk', 0.1, [24,25,26,27,28,29,30,31]);
                this.addAnim('jump', 0.2, [40,41,42,43,44,45,46,47]);
                this.addAnim("die", 0.2, [56,57,58,59,60,61,62,63],true);
            },

            // Se llama a este método en cada frame de cada entidad.
            update: function() {
                this.parent();
                if(!this.death){
                    if(this.standing){
                        if (ig.input.state("right")){
                            if(this.speed < 0){
                                this.speed +=this.accel;
                            }
                            if(this.speed < this.maxVel.x){
                                 this.speed+=this.accel;
                            }
                            this.flip = false;
                        }
                        else if (ig.input.state("left")) {
                            if(this.speed > 0){
                                this.speed -=this.accel;
                            }
                            if(this.speed > this.maxVel.x*-1){
                                 this.speed-=this.accel;
                            }
                            this.flip = true;
                        }
                        else {
                            if(this.speed > 0){
                                if(this.speed < this.accel){
                                    this.speed = 0;
                                }else{
                                    this.speed -= this.accel;
                                }
                            }else if(this.speed < 0){
                                if(this.speed > this.accel){
                                    this.speed = 0;
                                }else{
                                    this.speed += this.accel;
                                }
                            }
                        }
                    }

                    if (ig.input.pressed("jump") && this.standing) {
                        this.vel.y = this.jump_speed;
                    }
                    this.vel.x = this.speed;

                    if (!this.standing) {
                        this.currentAnim = this.anims.jump;
                    } else if (this.vel.x == 0) {
                        this.currentAnim = this.anims.idle;
                    } else {
                        this.currentAnim = this.anims.walk;
                    }

                    this.currentAnim.flip.x = this.flip;

                    //Control de daño

                    if(this.damage.points > 0){
                        //Si no hay timer, arranca
                        if(this.damage.timer == undefined){
                            this.damage.timer = new ig.Timer();
                            this.damage.timer.set(this.damage.duration);
                            this.damage.blink.last = this.damage.duration;
                            this.damage.blink.active = true;
                        }

                        //Cambia el parpadeo según el estado previo cada cierto intervalo de tiempo
                        if(this.damage.blink.last - this.damage.timer.delta()*-1 > this.damage.blink.interval){
                            this.damage.blink.last = this.damage.timer.delta()*-1;
                            if(this.damage.blink.active){
                                this.currentAnim.alpha = 0;
                                this.damage.blink.active = false;
                            }else{
                                this.currentAnim.alpha = 1;
                                this.damage.blink.active = true;
                            }
                        }

                        //Fin del timer
                        if(this.damage.timer.delta()>=0){
                            this.damage.blink.active = false;
                            this.damage.points = 0;
                            this.damage.timer.pause();
                            this.damage.timer = undefined;
                        }

                    }
                    else{
                        this.currentAnim.alpha = 1;
                    }

                }

            },
            handleMovementTrace: function( res ) {
                if( res.collision.x && this.standing) {
                    this.speed=0;
                }else if (res.collision.x && !this.standing && (this.speed>100||this.speed<-100)){
                    if(this.speed>100){
                        this.speed = 50;
                    }else{
                        this.speed = -50;
                    }
                }

                // Continue resolving the collision as normal
                this.parent(res); 
            },
            addPoints: function(points){
                if(!this.death){
                    this.points += points;
                }
            },
            hit: function(points){
                this.points -= points;
                if(this.points < 0){
                    this.timeout();
                }else{
                    this.damage.points = points;
                    //Si estaba activo se resetea
                    if(this.damage.timer != undefined){
                        this.damage.timer.reset();
                        this.damage.blink.last = this.damage.timer.delta()*-1;
                    }
                }
            },
            timeout: function(){
                this.currentAnim = this.anims.die;
                this.currentAnim.rewind();
                this.death = true;
            },
            draw: function() {
                // Draw all entities and backgroundMaps
                this.parent();
                if(this.damage.points>0&&this.damage.blink.active){
                    this.font.draw( '-'+this.damage.points, 193 , 170  , ig.Font.ALIGN.LEFT );
                }
                // Add your own drawing code here
                /*var x = ig.system.width / 2,
                    y = ig.system.height / 2;

                this.font.draw('It Works!', x, y, ig.Font.ALIGN.CENTER);
                */


            }
        });
    });