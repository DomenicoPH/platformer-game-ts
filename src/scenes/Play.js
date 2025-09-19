import Phaser from 'phaser';

class Play extends Phaser.Scene {
    constructor(){
        super('PlayScene');
    }

    create(){
        const map = this.make.tilemap({ key: 'map' });
        const tileset1 = map.addTilesetImage('main_lev_build_1', 'tiles-1'); //(name in Tiled, key in preload)
        //const tileset2 = map.addTilesetImage('main_lev_build_2', 'tiles-2'); //(name in Tiled, key in preload)

        map.createStaticLayer('environment', tileset1);
        map.createStaticLayer('platforms', tileset1);
    }
}
export default Play;