import Phaser from 'phaser';
import Player from '../entities/Player';
import Enemies from '../groups/enemies';

class Play extends Phaser.Scene {
    constructor(config){
        super('PlayScene');
        this.config = config;
    }

    create(){
        const map = this.createMap();
        const layers = this.createLayer(map);
        const playerZones = this.getPlayerZones(layers.playerZones);

        const player = this.createPlayer(playerZones.start);
        const enemies = this.createEnemies(layers.enemySpawns);

        // colliders
        this.createPlayerColliders(player, {
            colliders: {
                platformsColliders: layers.platformsColliders
            }
        });
        this.createEnemyColliders(enemies, {
            colliders: {
                platformsColliders: layers.platformsColliders,
                player
            }
        });

        this.createEndOfLevel(playerZones.end, player);
        this.setupFollowupCamera(player);

        this.graphics = this.add.graphics();
        this.line = new Phaser.Geom.Line();
        this.graphics.lineStyle(1, 0x00ff00);

        this.input.on('pointerdown', this.startDrawing, this);
        this.input.on('pointerup', this.finishDrawing, this);
    };

    startDrawing(pointer){
        this.line.x1 = pointer.worldX;
        this.line.y1 = pointer.worldY;
    };

    finishDrawing(pointer){
        this.line.x2 = pointer.worldX;
        this.line.y2 = pointer.worldY;
        this.graphics.strokeLineShape(this.line);
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
        const playerZones = map.getObjectLayer('player_zones');
        const enemySpawns = map.getObjectLayer('enemy_spawns');

        //platformsColliders.setCollisionByExclusion(-1, true);
        platformsColliders.setCollisionByProperty({collides: true});

        return { environment, platforms, platformsColliders, playerZones, enemySpawns }
    }

    // player
    createPlayer(start){
        return new Player(this, start.x, start.y);
    }

    createPlayerColliders(player, { colliders }){
        player
            .addCollider(colliders.platformsColliders);
    }

    // enemies
    createEnemies(spawnLayer){
        const enemies = new Enemies(this);
        const enemyTypes = enemies.getTypes();
        spawnLayer.objects.forEach( spawnPoint => {
            const enemy = new enemyTypes[spawnPoint.type](this, spawnPoint.x, spawnPoint.y);
            enemies.add(enemy)
        })
        return enemies;
    }

    createEnemyColliders(enemies, { colliders }){
        enemies
            .addCollider(colliders.platformsColliders)
            .addCollider(colliders.player)
    }

    setupFollowupCamera(player){
        const { height, width, mapOffset, zoomFactor } = this.config;
        this.physics.world.setBounds(0, 0, width + mapOffset, height + 200);
        this.cameras.main.setBounds(0, 0, width + mapOffset, height).setZoom(zoomFactor);
        this.cameras.main.startFollow(player);
    }

    getPlayerZones(playerZonesLayer){
        const playerZones = playerZonesLayer.objects;
        return {
            start: playerZones.find( zone => zone.name === 'startZone' ),
            end: playerZones.find( zone => zone.name === 'endZone' )
        }
    }

    createEndOfLevel(end, player){
        const endOfLevel = this.physics.add.sprite(end.x, end.y, 'end')
            .setAlpha(0)
            .setOrigin(0.5, 1)
            .setSize(5, 200);

        const eolOverlap = this.physics.add.overlap(player, endOfLevel, () => {
            eolOverlap.active = false;
            console.log('end of level');
        })
    }

}
export default Play;
