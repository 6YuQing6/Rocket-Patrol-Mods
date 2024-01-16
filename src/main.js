
let config = { //object type
    type: Phaser.AUTO, //type tells phaser what graphic context to use to render the game 
    width: 640, //game window width
    height: 480, //game window height
    scene: [Menu,Play]
  }

let game = new Phaser.Game(config) //puts config object into phaser game

// set UI sizes
let borderUISize = game.config.height / 15
let borderPadding = borderUISize / 3

// reserve keyboard bindings
let keyFIRE, keyRESET, keyLEFT, keyRIGHT