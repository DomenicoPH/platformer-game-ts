import Phaser from 'phaser';
import initAnimations from './anims/playerAnims';
import collidable from '../mixins/collidable';

class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y){
        super(scene, x, y, 'player');
        
        scene.add.existing(this);
        scene.physics.add.existing(this);

        Object.assign(this, collidable);

        this.init();
        this.initEvents();
    };

    init(){
        this.gravity = 500;
        this.playerSpeed = 150;
        this.jumpCount = 0;
        this.consecutiveJumps = 1;
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        this.body.setSize(20, 35);
        this.body.setGravityY(this.gravity);
        this.setCollideWorldBounds(true);
        this.setOrigin(0.5, 1);
        initAnimations(this.scene.anims);
    };

    initEvents(){
        this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this);
    }

    update(){

        const { left, right, up, space } = this.cursors;
        const isSpaceJustDown = Phaser.Input.Keyboard.JustDown(space);
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
        if( isSpaceJustDown && (onFloor || this.jumpCount < this.consecutiveJumps) ){
            this.setVelocityY(-this.playerSpeed * 2)
            this.jumpCount++;
        }
        if(onFloor){
            this.jumpCount = 0;
        }

        onFloor 
            ? this.body.velocity.x !== 0
                ? this.play('run', true)
                : this.play('idle', true)
            : this.play('jump', true);
    }
    
}

export default Player;