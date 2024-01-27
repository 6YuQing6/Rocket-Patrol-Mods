class Play extends Phaser.Scene {
    constructor() {
      super("playScene")
    }
    
    create() {
      // place tile sprite
      //this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0)
      this.clouds = this.add.tileSprite(0, 0, 640, 480, 'clouds').setOrigin(0, 0);
      this.stars = this.add.tileSprite(0, 0, 640, 480, 'stars').setOrigin(0, 0);
      this.moon = this.add.tileSprite(0, 0, 640, 480, 'moon').setOrigin(0, 0);

      //background music
      this.bkgMusic = this.sound.add('bkg-music', {volume: 0.1, loop: true});
      this.bkgMusic.play();

      // green UI background
      this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x0C2D48).setOrigin(0, 0)
      // white borders
      this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
      this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0)
      this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
      this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0)

      // add rocket (p1)
      this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0)
        // add spaceships (x3)
      this.ship01 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4,  'spaceship', 0, 20).setOrigin(0, 0)
      this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 30).setOrigin(0,0)
      this.ship03 = new Spaceship(this, game.config.width + borderUISize*2, borderUISize*8 + borderPadding*2, 'spaceship', 0, 10).setOrigin(0,0)
      this.ship04 = new FastSpaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship2', 0, 40).setOrigin(0,0)

      // define keys
      keyFIRE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F)
      keyRESET = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R)
      keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT)
      keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT)

      // initialize score
      this.p1Score = 0  
      // display score
      let scoreConfig = {
        fontFamily: 'Courier',
        fontSize: '28px',
        backgroundColor: '#2E8BC0',
        color: '#FFFFFF',
        align: 'right',
        padding: {
          top: 5,
          bottom: 5,
        },
        fixedWidth: 100
      }
      this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, scoreConfig)

      this.gameOver = false;
      // 60-second play clock
      scoreConfig.fixedWidth = 0
      this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
          this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5)
          this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5)
          this.gameOver = true
      }, null, this)
      this.timerText = this.add.text(borderUISize*15, borderUISize + borderPadding*2, 'time left: ',scoreConfig).setOrigin(0.5,0)
      
    }
    update() {
      //timer text
      this.timerText.setText(`time left: ${this.clock.getRemainingSeconds().toString().substr(0,4)}`);

      // check key input for restart
      if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyRESET)) {
          this.scene.restart()
      }
      if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
        this.scene.start("menuScene")
        this.bkgMusic.stop();
      }
      if (!this.gameOver){
        this.clouds.tilePositionX += 1;
        this.moon.tilePositionX += 0.5;
        this.stars.tilePositionX += 0.3;
        this.p1Rocket.update();
        this.ship01.update()               // update spaceships (x3)
        this.ship02.update()
        this.ship03.update()
        this.ship04.update()
      }

      // check collisions
      if(this.checkCollision(this.p1Rocket, this.ship03)) {
        this.p1Rocket.reset()
        this.shipExplode(this.ship03)
      }
      if (this.checkCollision(this.p1Rocket, this.ship02)) {
        this.p1Rocket.reset()
        this.shipExplode(this.ship02)
      }
      if (this.checkCollision(this.p1Rocket, this.ship01)) {
        this.p1Rocket.reset()
        this.shipExplode(this.ship01)
      }
      if (this.checkCollision(this.p1Rocket, this.ship04)) {
        this.p1Rocket.reset()
        this.shipExplode(this.ship04)
      }
    }

    checkCollision(rocket, ship) {
      // simple AABB checking
      if (rocket.x < ship.x + ship.width && 
        rocket.x + rocket.width > ship.x && 
        rocket.y < ship.y + ship.height &&
        rocket.height + rocket.y > ship. y) {
        return true
      } else {
        return false
      }
    }
    shipExplode(ship) {
      // temporarily hide ship
      ship.alpha = 0
      // create explosion sprite at ship's position
      let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
      boom.anims.play('explode')             // play explode animation
        //particles explosion : https://labs.phaser.io/edit.html?src=src\game%20objects\particle%20emitter\explode%20emitter.js
      const emitter = this.add.particles(ship.x,ship.y, 'particles', {
        lifespan: 4000,
        speed: {min: 250, max: 450},
        scale: {start: 0.8, end: 0.0},
        gravityY: 300,
        emitting: false
      });
      emitter.explode(32); //adds particle explosion
      boom.on('animationcomplete', () => {   // callback after anim completes
        ship.reset()                         // reset ship position
        ship.alpha = 1                       // make ship visible again
        boom.destroy()                       // remove explosion sprite
      })
      // score add and text update
      this.p1Score += ship.points
      if (this.p1Score > highscore){
        highscore = this.p1Score;
      }
      this.scoreLeft.text = this.p1Score          
      this.sound.play('sfx-explosion') 
    }
  }