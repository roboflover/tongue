import Phaser from 'phaser';

export default class UIScene {
    private score: number = 0;
    private scoreText!: Phaser.GameObjects.Text;
    private timerText!: Phaser.GameObjects.Text;
    private timerEvent!: Phaser.Time.TimerEvent;
    private timeLeft: number = 30;

    constructor(private scene: Phaser.Scene) {
        this.create();
    }

    create() {
        const { width } = this.scene.scale;

        // Определяем стиль текста
        const textStyle = {
            fontSize: '64px',
            color: '#fff',
            fontFamily: 'Arial', // Используем Arial или похожий шрифт
            fontWeight: 'bold',  // Делаем шрифт более толстым
            fontStyle: 'italic'  // Делаем шрифт наклонным
        };

        this.scoreText = this.scene.add.text(width - 16, 16, '0', textStyle);
        this.scoreText.setOrigin(1, 0);

        this.timerText = this.scene.add.text(16, 16, '00:30', textStyle);
        
        this.scoreText.setDepth(10);
        this.timerText.setDepth(10);

        this.timerEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
    }

    private updateTimer() {
        this.timeLeft -= 1; // Уменьшаем значение на 1 каждую секунду
        this.timerText.setText(`00:${this.timeLeft}`);
        if (this.timeLeft <= 0) {
            this.timerEvent.remove(false);
            this.timeLeft = 0; // Убедимся, что время не уходит в отрицательные значения
        }
    }

    increaseScore(points: number) {
        this.score += points;
        this.scoreText.setText(`${this.score} CP`);
    }
}