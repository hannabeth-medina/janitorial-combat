demo.level3 = function(){};
demo.level3.prototype = {

	preload: function(){
        //Preload all assets needed
        //  --Load in tilemap and tilesets here
        game.load.tilemap('LevelThree', 'assets/levelThree.json', null, Phaser.Tilemap.TILED_JSON);	
        game.load.image('Floor Tiles', 'assets/path (38).png');
        game.load.image('Floor Tiles w Shadows', 'assets/shadow.png');
        game.load.image('Block Tiles Ceiling', 'assets/path (34) (5).png');
        game.load.image('Block Tiles Brick', 'assets/brick wall proto.png');
        game.load.image('Goal Tiles', 'assets/GOAL.png');
        
        //  --Load in spritesheets, art assets, and sound files
        game.load.atlasJSONHash('jan', 'assets/janSpritesheet.png', 'assets/janSpritesheet.json');    
        game.load.image('Trash', 'assets/paperBallRESIZED.png');
        game.load.spritesheet('villain', 'assets/villainSpritesheet.png', 300, 300);
        game.load.audio('bgMusic', 'assets/audio/CrEEP.mp3');
        game.load.audio('monSound', 'assets/audio/monsterSound.mp3');
        game.load.audio('hitSound', 'assets/audio/hitSound.mp3');
        game.load.audio('trashSound', 'assets/audio/trashSound.mp3');
        game.load.audio('killByMon', 'assets/audio/chewDeathSound.mp3');
        
        game.load.image('pause', 'assets/pauseScreen.png');
    },
	create: function(){
        //Set isAttacking and isPushing to false to prevent movement locking
        isAttacking = false;
        isPushing = false;
        
        //Enable physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        //Set up level map
        //  --Load in tilesets, create layers, set collision
        //  --MAKE SURE YOU USE 'blockLayer' and 'goalLayer' for those layers!!!
        // Tilemap and layers to state
        var map = game.add.tilemap('LevelThree');
        map.addTilesetImage('Floor Tiles');
        map.addTilesetImage('Floor Tiles w Shadows');
        map.addTilesetImage('Block Tiles Ceiling');
        map.addTilesetImage('Block Tiles Brick');	
        map.addTilesetImage('Goal Tiles');
        baseLayer = map.createLayer('Floor');
        blockLayer = map.createLayer('Blocks');
        goalLayer = map.createLayer('Goal');
        
        //Set collision on the 'Blocks' layer
        map.setCollisionBetween(5, 6, true, 'Blocks');
        map.setCollisionBetween(9, 10, true, 'Goal');
		
        
        //Create trash
        //  --Change the spawn position as needed
        trash = new Trash(650, 650);
        
        //Create monster
        //  --Change the spawn position as needed
        villain = createMonster(0, 0);
        
        //Create janitor
        //  --Change the spawn position as needed
        janitor = new Janitor(700, 700);
        var jan = janitor.janitor;
        
        //Callback funcitons for pushing and attacking
        //  --Push callback function
        let D = game.input.keyboard.addKey(Phaser.Keyboard.D);
        D.onDown.add(function() {
            if (!isPushing){
                isPushing = true;
                janitor.pushBox.body.enable = true;
                switch (janitor.heading){
                    case 0:
                        jan.animations.play('pushRight', 5, false);
                        trashDirection = 0;
                        break;
                    case 1:
                        jan.animations.play('pushLeft', 5, false);
                        trashDirection = 1;
                        break;
                    case 2:
                        jan.animations.play('pushUp', 5, false);
                        trashDirection = 2;
                        break;
                    case 3:
                        jan.animations.play('pushDown', 5, false);
                        trashDirection = 3;
                        break;
                }
		trashSound.play();
                var pshTimer = game.time.create(true);
                pshTimer.add(300, function (){
                    isPushing = false;
                    janitor.pushBox.body.enable = false;
                    janitor.pushBox.body.reset(0, 0);
                }, this);
                pshTimer.start();
            }
        });
        
        //  --Attack callback funciton
        let A = game.input.keyboard.addKey(Phaser.Keyboard.A);
        A.onDown.add(function() {
            if (!isAttacking){
                isAttacking = true;
                janitor.attackBox.body.enable = true;
                switch (janitor.heading){
                    case 0:
                        jan.animations.play('attackRight', 5, false);
                        break;
                    case 1:
                        jan.animations.play('attackLeft', 5, false);
                        break;
                    case 2:
                        jan.animations.play('attackUp', 5, false);
                        break;
                    case 3:
                        jan.animations.play('attackDown', 5, false);
                        break;
                }
                hitSound.play();
                var atkTimer = game.time.create(true);
                atkTimer.add(300, function(){
                    isAttacking = false;
                    janitor.attackBox.body.enable = false;
                    janitor.attackBox.body.reset(0, 0);
                }, this);
                atkTimer.start();
            }
        });
        
        //Callback function to handle pausing
        let P = game.input.keyboard.addKey(Phaser.Keyboard.P);
        P.onDown.add(function() {
            if (!isPaused){
                isPaused = true;
                bgMusic.stop();
                pause = game.add.sprite(0, 0, 'pause');
            }
            else{
                isPaused = false;
                bgMusic.play();
                pause.destroy();
            }
        });
        
        //Audio
	hitSound = game.add.audio('hitSound');
	trashSound = game.add.audio('trashSound');
	killByMon = game.add.audio('killByMon');
	    // --Background music
	    bgMusic = game.add.audio('bgMusic');
        bgMusic.play();
        //  --Monster sound effects
	    game.time.events.loop(Phaser.Timer.SECOND * getRandomInt(4,10), playMonSound, this);
        monSound = game.add.audio('monSound');
        
    },
	update: function(){
        setupUpdate(janitor, trash, villain, blockLayer, goalLayer);
    }
};
