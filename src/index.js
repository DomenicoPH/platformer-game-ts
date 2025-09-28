import Phaser from "phaser";
import PlayScene from './scenes/Play';
import PreloadScene from "./scenes/Preload";

const MAP_WIDTH = 1600;
const WIDTH = document.body.offsetWidth;
const HEIGHT = 600;

// Configuración compartida
const SHARED_CONFIG = {
  mapOffset: MAP_WIDTH > WIDTH ? MAP_WIDTH - WIDTH : 0,
  width: WIDTH,
  height: HEIGHT,
  zoomFactor: 1.5,
}

// Lista de escenas del juego
const Scenes = [PreloadScene, PlayScene];
// Instancia cada escena con la configuración compartida
const createScene = scene => new scene(SHARED_CONFIG);
const initScenes = () => Scenes.map(createScene);

const config = {
  type: Phaser.AUTO,
  ...SHARED_CONFIG,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    }
  },
  scene: initScenes() 
};

new Phaser.Game(config);