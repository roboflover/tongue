import Phaser from 'phaser';
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';
import Player from './Player';
import Enemy from './Enemy';

export default class GameScene extends Phaser.Scene {
    private fullscreenKey: Phaser.Input.Keyboard.Key | undefined;

    [x: string]: any;
    path: { t: number; vec: Phaser.Math.Vector2; };

    constructor() {
        super('hello-world');
        this.path = { t: 0, vec: new Phaser.Math.Vector2() };
    }

	preload()
    {
        this.load.image('star', 'assets/star3.png');
        this.load.image('background', 'assets/background.jpg')
        this.load.spritesheet('cube', 'assets/frames.png', { frameWidth: 134, frameHeight: 120 });

    }

    create()
    {
        this.background = this.add.tileSprite(0, 0, 1000, 1000, 'background').setOrigin(0);
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
