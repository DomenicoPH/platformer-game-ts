import Phaser from 'phaser';

class Play extends Phaser.Scene {
    constructor(){
        super('PlayScene');
    }

    create(){
        const map = this.createMap();
        const layers = this.createLayer(map);
    }

    //Custom methods

    createMap(){
        const map = this.make.tilemap({ key: 'map' });
        map.addTilesetImage('main_lev_build_1', 'tiles-1'); //(name in Tiled, key in preload)
        return map;
    }
    
    createLayer(map){
        const tileset = map.getTileset('main_lev_build_1');
        const environment = map.createStaticLayer('environment', tileset);
        const platforms = map.createDynamicLayer('platforms', tileset);
        return { environment, platforms }
    }
}
export default Play;
