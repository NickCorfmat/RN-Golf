// Code Practice: RNGolf
// Name: Nick Corfmat
// Date: 2/2/24

'use strict'

let config = {
    type: Phaser.AUTO,
    width: 640,
    height: 960,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [ Play ]
}

let game = new Phaser.Game(config)

let { width, height } = game.config