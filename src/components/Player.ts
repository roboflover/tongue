import Phaser from 'phaser'
import MoveTo from 'phaser3-rex-plugins/plugins/moveto.js';
import EventListeners from './EventListeners';

export default class Player extends Phaser.Physics.Arcade.Sprite {
    playerGraphics!: Phaser.GameObjects.Graphics;
    rectWidth: number;
    rectHeight: number;
    centerX: number;
    bottomY: number;
    targetX: number;
    targetY: number;
    eventListeners: any; // Убедитесь, что у вас есть правильный тип для eventListeners
    tooglePlayerScale: boolean;
    targetWidth: number;
    targetHeight: number;
    minWidth: number;
    maxWidth: number;
    newWidth: number;
    currentWidth: number; // Добавляем свойство currentWidth
    angle: number;
    endPointX: number;
    endPointY: number;
    private isFire: boolean = false;

    constructor(scene: Phaser.Scene) {
        super(scene, 0, 0, 'player');
        this.rectWidth = 50;
        this.rectHeight = 50;
        this.centerX = scene.scale.width / 2;
        this.bottomY = scene.scale.height - this.rectHeight;
        this.targetX = 0;
        this.targetY = 0;
        this.endPointX = 0;
        this.endPointY = 0;
        this.tooglePlayerScale = false;
        this.targetWidth = 100; // Пример значения
        this.targetHeight = 20
        this.minWidth = 50; // Пример значения
        this.maxWidth = 2500
        this.newWidth = 50; // Пример значения
        this.currentWidth = 50; // Начальное значение текущей ширины
        this.angle = 0;
        this.create();
        this.isFire = false
    }

    setFireState(isFire: boolean): void {
        this.isFire = isFire;
    }

    updateFireState(isFire: boolean) {
        this.isFire = isFire;
    }

    create(){

        const windowWidth = this.scene.scale.width 
        const windowHeight = this.scene.scale.height 
        
        const rectWidth = 50  
        const rectHeight = 20 
        const offset = 10 

        this.centerX = (windowWidth - rectWidth) / 2;
        this.bottomY = windowHeight - rectHeight - offset;

        this.playerGraphics = this.scene.add.graphics({ fillStyle: { color: 0xff0000 } });
        // this.playerGraphics.fillRect(0, 0, rectWidth, rectHeight);
        this.playerGraphics.setPosition(this.centerX, this.bottomY);

        const config = {
            targetX: this.targetX,
            targetY: this.targetY,
            targetWidth: this.targetWidth,
            maxWidth: this.maxWidth,
            minWidth: this.minWidth,
            tooglePlayerScale: this.tooglePlayerScale
        };

        this.eventListeners = new EventListeners(this.scene, this.playerGraphics, config);

        this.targetWidth = 50;
        this.targetHeight = 20;
        this.maxWidth = 2500; 

        this.scene.input.on('pointerdown', (pointer) => {
            if(!this.isFire){
            const dx = pointer.x - this.playerGraphics.x
            const dy = pointer.y - this.playerGraphics.y
            this.endPointX = pointer.x
            this.endPointY = pointer.y
            const distance = Math.sqrt(dx * dx + dy * dy);
    
            this.targetWidth = Math.min(distance, this.maxWidth);
            this.tooglePlayerScale = true
            setTimeout(()=>{this.tooglePlayerScale = false}, 500)
            }
        });

        this.scene.input.on('pointerup', (pointer) => {
            this.playerGraphics.clear();
            // this.playerGraphics.fillRect(0, 0, this.minWidth, 20);
        });

        const playerSprite = this.scene.add.sprite(this.playerGraphics.x, this.playerGraphics.y - 120, 'player');
        playerSprite.scale = 3;

        let isMouseDown = false;

        this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            isMouseDown = true;
            let newFrame = 0;
            if (pointer.x > this.scene.scale.width / 2) {
                newFrame = 1;
            } else {
                newFrame = 2;
            }
            playerSprite.setFrame(newFrame);
            this.scene.time.delayedCall(2500, () => {
                playerSprite.setFrame(0);
                isMouseDown = false;
            });
        });
        
        if(this.isFire){
                if (!isMouseDown) {
                    playerSprite.setFrame(3)
                    // this.scene.time.delayedCall(300, () => {
                    //     if (!isMouseDown) {
                    //         playerSprite.setFrame(0);
                    //     }
                    // });
                } else {
                    playerSprite.setFrame(0)
                }
        }
    }

    getPlayerBounds() {
        return {
            startPointX: this.playerGraphics.x,
            startPointY: this.playerGraphics.y-170,
            lineDistance: this.targetWidth,
            angle: this.angle,
            endPointX: this.endPointX,
            endPointY: this.endPointY
        }
    }

    updateWidth(newWidth: number) {
        // this.rectWidth = newWidth;
        // this.playerGraphics.clear();
        // this.playerGraphics.fillStyle(0xff0000);
        // this.playerGraphics.fillRect(0, 0, this.rectWidth, this.rectHeight);
    }

    update() {

     }

     
  }