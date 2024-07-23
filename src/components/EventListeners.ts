// Класс EventListeners
export default class EventListeners {
    private scene: Phaser.Scene;
    private playerGraphics: Phaser.GameObjects.Graphics;
    private _targetX: number;
    private _targetY: number;
    private tween: Phaser.Tweens.Tween | null;
    private targetWidth: number;
    private maxWidth: number;
    private minWidth: number;
    private tooglePlayerScale: boolean;

    constructor(scene: Phaser.Scene, playerGraphics: Phaser.GameObjects.Graphics, config: any) {
        this.scene = scene;
        this.playerGraphics = playerGraphics;
        this._targetX = config.targetX;
        this._targetY = config.targetY;
        this.tween = null;
        this.targetWidth = config.targetWidth;
        this.maxWidth = config.maxWidth;
        this.minWidth = config.minWidth;
        this.tooglePlayerScale = config.tooglePlayerScale;

        this.initListeners();
    }

    private initListeners() {
        const isMobile = /Mobi|Android/i.test(navigator.userAgent);

        if (isMobile) {
            this.scene.input.on('pointerdown', this.handlePointerDown.bind(this));
        } else {
            this.scene.input.on('pointermove', this.handlePointerMove.bind(this));
        }

        this.scene.input.on('pointerup', this.handlePointerUp.bind(this));
    }

    private handlePointerDown(pointer: Phaser.Input.Pointer) {
        if (this.tween) {
            this.tween.remove();
            this.tween = null;
        }
        this._targetX = pointer.x; 
        this._targetY = pointer.y; 
    }

    public handlePointerMove(pointer: Phaser.Input.Pointer) {
        if (this.tween) {
            this.tween.remove();
            this.tween = null;
        }
        this._targetX = pointer.x; 
        this._targetY = pointer.y; 
    }

    private handlePointerUp(pointer: Phaser.Input.Pointer) {
        this.playerGraphics.clear();
        this.playerGraphics.fillRect(0, 0, this.minWidth, 20);
    }

    get targetX() {
        return this._targetX;
    }

    get targetY() {
        return this._targetY;
    }
}