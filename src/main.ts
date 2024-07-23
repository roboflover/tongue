import Phaser from 'phaser'
import gameConfig from './config';

const game = new Phaser.Game(gameConfig);

function resizeGame() {
    game.scale.resize(window.innerWidth, window.innerHeight);
}

window.addEventListener('resize', resizeGame);

export default game;
