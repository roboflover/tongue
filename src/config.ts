import Phaser from 'phaser'
import MoveToPlugin from 'phaser3-rex-plugins/plugins/moveto-plugin.js';

import GameScene from './components/GameScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 1000,
	height: 600,
	parent: 'main',
	input: {
		keyboard: true
	  },
	scale: {
		mode: Phaser.Scale.RESIZE,
		parent: 'game-container',
		autoCenter: Phaser.Scale.CENTER_BOTH,
	  },
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { x: 0, y: 200 }
		}
	},
	scene: [GameScene],
	plugins: {
        global: [{
            key: 'rexMoveTo',
            plugin: MoveToPlugin,
            start: true
        }]
	}
}

export default config;