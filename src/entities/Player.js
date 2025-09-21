import Phaser from 'phaser';
import initAnimations from './playerAnims';

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.init();
        this.initEvents();
    };

    init(){
        this.gravity = 500;
        this.playerSpeed = 200;
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);

        initAnimations(this.scene.anims);
    };

    initEvents(){
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(){

        const { left, right, up, space } = this.cursors;
        const onFloor = this.body.onFloor();
        
        // move left / move right / idle
        if(left.isDown){
            this.setVelocityX(-this.playerSpeed);
            this.setFlip(true);
        } else if(right.isDown){
            this.setVelocityX(this.playerSpeed);
            this.setFlip(false);
        } else {
            this.setVelocityX(0);
        };

        // jump
        if( (space.isDown || up.isDown) && onFloor ){
            this.setVelocityY(-this.playerSpeed * 1.5)
        }

        this.body.velocity.x !== 0
            ? this.play('run', true)
            : this.play('idle', true);
    }
}

export default Player;