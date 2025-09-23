import Phaser from 'phaser';
import Player from '../entities/Player';

class Play extends Phaser.Scene {
    constructor(config){
        super('PlayScene');
        this.config = config;
    }

    create(){
        const map = this.createMap();
        const layers = this.createLayer(map);
        const player = this.createPlayer();

        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders
            }
        });

        this.setupFollowupCamera(player);
    };

    //Custom methods

    createMap(){
        const map = this.make.tilemap({ key: 'map' });
        map.addTilesetImage('main_lev_build_1', 'tiles-1'); //(name in Tiled, key in preload)
        return map;
    }
    
    createLayer(map){
        const tileset = map.getTileset('main_lev_build_1');
        // order: last will show first
        const platformsColliders = map.createStaticLayer('platforms_colliders', tileset);
        const environment = map.createStaticLayer('environment', tileset);
        const platforms = map.createDynamicLayer('platforms', tileset);
        const playerZones = map.getObjectLayer('player_zones').objects;

        //platformsColliders.setCollisionByExclusion(-1, true);
        platformsColliders.setCollisionByProperty({collides: true});

        return { environment, platforms, platformsColliders, playerZones }
    }

    createPlayer(){
        return new Player(this, 100, 250);
    }

    createPlayerColliders(player, { colliders }){
        player
            .addCollider(colliders.platformsColliders);
    }

    setupFollowupCamera(player){
        const { height, width, mapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
        this.cameras.main.setBounds(0, 0, width + mapOffset, height).setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }

}
export default Play;
