/*
This entity calls the triggeredBy( entity, trigger ) method of each of its
targets. #entity# is the entity that triggered this trigger and #trigger# 
is the trigger entity itself.


Keys for Weltmeister:

checks
        Specifies which type of entity can trigger this trigger. A, B or BOTH 
        Default: A

wait
        Time in seconds before this trigger can be triggered again. Set to -1
        to specify "never" - e.g. the trigger can only be triggered once.
        Default: -1
        
target.1, target.2 ... target.n
        Names of the entities whose triggeredBy() method will be called.
*/

ig.module(
        'game.entities.trigger'
)
.requires(
        'impact.entity'
)
.defines(function(){

EntityTrigger = ig.Entity.extend({
        size: {x: 16, y: 16},
        
        _wmScalable: true,
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(196, 255, 0, 0.7)',
        
        target: null,
        wait: -1,
        waitTimer: null,
        canFire: true,
        
        type: ig.Entity.TYPE.NONE,
        checkAgainst: ig.Entity.TYPE.A,
        collides: ig.Entity.COLLIDES.NEVER,
        
        
        init: function( x, y, settings ) {
                this.parent( x, y, settings );
        },
        
        
        check: function( other ) {
                //TODO: mostrar menú
                ig.game.currentLevel++;
                ig.game.levelLoader();
                this.kill();
        },
        
        
        update: function(){}
});

});