import Phaser from 'phaser';
import Player from '../entities/Player';

class Play extends Phaser.Scene {
    constructor(){
        super('PlayScene');
    }

    create(){
        const map = this.createMap();
        const layers = this.createLayer(map);
        const player = this.createPlayer();

        player.addCollider(layers.platformsColliders);
    }

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

        //platformsColliders.setCollisionByExclusion(-1, true);
        platformsColliders.setCollisionByProperty({collides: true});

        return { environment, platforms, platformsColliders }
    }

    createPlayer(){
        return new Player(this, 100, 250);
    }

}
export default Play;
