import Phaser from 'phaser';
import Player from './Player';

export default class Enemy extends Phaser.Physics.Arcade.Sprite {
    [x: string]: any;
    enemyGraphics!: Phaser.GameObjects.Sprite;
    enemies: Phaser.GameObjects.Sprite[] = [];
    sineWaveOffsets: number[] = [];
    playerGraphics: Player;
    graphics!: Phaser.GameObjects.Graphics;
    progress: number = 0;
    isIncreasing: boolean = true;
    speed: number = 0.01;
    private isAnimating: boolean = false;
    private isFire: boolean = false;
    private trackingCircle!: Phaser.GameObjects.Graphics;

    constructor(scene: Phaser.Scene, playerGraphics: Player) {
        super(scene, -100, -100, 'enemy')
        this.create()
        this.playerGraphics = playerGraphics
        this.isAnimating = false
        this.scene.add.existing(this)
        this.trackingCircle
    }

    create() {
        this.graphics = this.scene.add.graphics({ lineStyle: { width: 20, color: 0xff0000 } })
        this.scene.anims.create({
            key: 'rotate',
            frames: this.scene.anims.generateFrameNumbers('cube', { frames: [0, 1, 2, 3, 4] }),
            frameRate: 10,
            repeat: -1
        });

        for (let i = 0; i < 10; i++) {
            let x, y;
            let validPosition = false;

            while (!validPosition) {
                x = Phaser.Math.Between(100, this.scene.scale.width - 50);
                y = Phaser.Math.Between(50, 1000);
                validPosition = true;

                for (const enemy of this.enemies) {
                    const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
                    if (distance < 100) {
                        validPosition = false;
                        break;
                    }
                }
            }

            const enemy = this.scene.add.sprite(x, y, 'cube');
            enemy.play('rotate');

            this.scene.physics.world.enable(enemy);
            const body = enemy.body as Phaser.Physics.Arcade.Body;
            body.setImmovable(true);
            body.setAllowGravity(false);

            this.enemies.push(enemy);
            this.sineWaveOffsets.push(Phaser.Math.FloatBetween(0, Math.PI * 2));
        }

        this.scene.input.on('pointerdown', () => {
            this.graphics.clear(); 
            this.enemies.forEach((enemy) => {
                const playerBounds = this.playerGraphics.getPlayerBounds();
                const line = new Phaser.Geom.Line(
                    playerBounds.startPointX,
                    playerBounds.startPointY,
                    playerBounds.endPointX,
                    playerBounds.endPointY
                );
                this.graphics.strokeLineShape(line);
            });
        });

        this.scene.input.on('pointerdown', (pointer) => {
            this.isFire = true
        });

        this.trackingCircle = this.scene.add.graphics({ fillStyle: { color: 0xff0000 } })
        this.trackingCircle.fillCircle(0, 0, 10)
    }

    preUpdate(time: number, delta: number) {
        super.preUpdate(time, delta);

        const amplitude = 5;
        const frequency = 0.01; 
        this.enemies.forEach((enemy, index) => {
            const offset = this.sineWaveOffsets[index];
            enemy.y += amplitude * Math.sin(frequency * time + offset);
        });

        if (this.isIncreasing && this.isFire) {
            this.progress += this.speed;
            if (this.progress >= 1) {
                this.progress = 1;
                this.isIncreasing = false;
            }
        } else {
            this.progress -= this.speed;
            if (this.progress <= 0) {
                this.progress = 0;
                this.isIncreasing = true;
            }
        }

        if(this.playerGraphics){
            const playerBounds = this.playerGraphics.getPlayerBounds();
            const startX = playerBounds.startPointX;
            const startY = playerBounds.startPointY;
            const endX = playerBounds.endPointX;
            const endY = playerBounds.endPointY;

            if(this.progress < 0.05 && !this.isIncreasing){
                this.isAnimating = false;
                this.isFire = false;
            } 

            const currentX = Phaser.Math.Linear(startX, endX, this.progress)
            const currentY = Phaser.Math.Linear(startY, endY, this.progress)
            this.trackingCircle.clear()

            if(!this.isFire){
                this.trackingCircle.fillCircle(1000, 1000, 10)
            } else {
                this.trackingCircle.fillCircle(currentX, currentY, 10)
            }

            this.graphics.clear();
            const line = new Phaser.Geom.Line(startX, startY, currentX, currentY);
            this.graphics.strokeLineShape(line);

            this.enemies.forEach((enemy) => {
                const enemyBounds = enemy.getBounds();
                if (Phaser.Geom.Rectangle.Contains(enemyBounds, currentX, currentY)) {
                    enemy.x = 10000;
                    const body = enemy.body as Phaser.Physics.Arcade.Body;
                    body.updateFromGameObject();
                    
                    // Эмитим событие уничтожения врага
                    this.scene.events.emit('enemy-destroyed');
                }
            });

            // Обновление состояния огня для Player
            this.playerGraphics.setFireState(this.isFire);
        }
    }
}