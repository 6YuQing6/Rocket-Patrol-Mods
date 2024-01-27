// Sunny Han
// Rocket Patrol - Space Fish
// Hours: 10 hours 
/* 
Mods:
Create a new enemy Spaceship type (w/ new artwork) that's smaller, moves faster, and is worth more points (5)
Use Phaser's particle emitter to create a particle explosion when the rocket hits the spaceship (5)
Display the time remaining (in seconds) on the screen (3)
Create a new title screen (e.g., new artwork, typography, layout) (3)
Implement parallax scrolling for the background (3)
Allow the player to control the Rocket after it's fired (1)
Create a new scrolling tile sprite for the background (1)
Add your own (copyright-free) looping background music to the Play scene (keep the volume low and be sure that multiple instances of your music don't play when the game restarts) (1)
Track a high score that persists across scenes and display it in the UI (1)
*/
/*
Credits: 
Music:
      Heart Of The Ocean by Purrple Cat | https://purrplecat.com/
      Music promoted by https://www.chosic.com/free-music/all/
      Creative Commons CC BY-SA 3.0
      https://creativecommons.org/licenses/by-sa/3.0/
Sources:
https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\explode%20emitter.js

*/
let config = { //object type
    type: Phaser.AUTO, //type tells phaser what graphic context to use to render the game 
    width: 640, //game window width
    height: 480, //game window height
    render: {
      pixelArt: true
    },
    autoCenter: true,
    scene: [Menu,Play]
  }

let game = new Phaser.Game(config) //puts config object into phaser game

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT
let highscore = 0