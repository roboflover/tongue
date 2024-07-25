import Phaser from 'phaser';
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';
import Player from './Player';
import Enemy from './Enemy';
import UIScene from './UIScene'

export default class GameScene extends Phaser.Scene {

    [x: string]: any;
    path: { t: number; vec: Phaser.Math.Vector2; };
    private ui!: UIScene;    

    constructor() {
      super('hello-world')
      this.path = { t: 0, vec: new Phaser.Math.Vector2() }
    }

  preload()
    {
      this.load.image('background', 'assets/background.jpg')
      this.load.spritesheet('cube', 'assets/pchelka.png', { frameWidth: 134, frameHeight: 120 })
      this.load.spritesheet('player', 'assets/player.png', { frameWidth: 134, frameHeight: 120 })
    }

    create()
    {
      console.log('Creating GameScene');
      this.ui = new UIScene(this);
      this.background = this.add.tileSprite(0, 0, 1000, 1000, 'background').setOrigin(0)
      this.player = new Player(this);
      this.enemyClass = new Enemy(this, this.player)
      this.camera = this.cameras.main;      
    }

    resizeHandler() {        
      const windowWidth = this.scale.width;
      const windowHeight = this.scale.height;
      this.background.displayWidth = windowWidth
      this.background.displayHeight = windowHeight

      if (document.fullscreenElement) {
        this.scale.startFullscreen();
      } else {
        this.scale.stopFullscreen();
      }
    };

    update() {
        this.resizeHandler()

        if (this.player) {
            this.player.update();
          }
       }
}
