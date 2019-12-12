class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    create() {

        
        //this.livesLabel2 = this.add.bitmapText(config.width - 50, 20, "pixelFont", "LIVES2 " + this.registry.get('lives2'), 16);
        
        
        this.elevators = this.add.group();
        
        this.elevator1 = new Elevator({
            scene: this,
            x: 170,
            y: 880,
            key: "interior",
            cod: "left"
        });
        
        this.elevator2 = new Elevator({
            scene: this,
            x: 555,
            y: 880,
            key: "interior",
            cod: "right"
        });
        
        this.rightDoors = this.add.group() ;
        this.leftDoors = this.add.group() ;
        
        
        this.rightDoor1 = new Door({
            scene: this,
            x: 705,
            y: 875,
            key: "right-door",
            codDoor: 1,
        });
        
        this.rightDoor2 = new Door({
            scene: this,
            x: 320,
            y: 875,
            key: "right-door",
            codDoor: 1,
        });
        
        this.leftDoor1 = new Door({
            scene: this,
            x: 405,
            y: 875,
            key: "left-door",
            codDoor: 2,
        }); 
        
        this.leftDoor2 = new Door({
            scene: this,
            x: 0,
            y: 875,
            key: "left-door",
            codDoor: 2,
        });
        
        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);
        //this.tile = this.add.tileSprite(config.width/2, 0, config.width, config.height, "wall");
        
        //this.wall = this.add.sprite(config.width / 2, 700, "wall-doors");
        
        this.physics.world.enable(this.elevator1);
        this.physics.world.enable(this.rightDoor1);
        this.physics.world.enable(this.leftDoor1);
        
        this.physics.world.enable(this.elevator2);
        this.physics.world.enable(this.rightDoor2);
        this.physics.world.enable(this.leftDoor2);
        
        var inter = this.add.zone(0, 0, config.width, config.height).setOrigin(0);
        
        this.stopLeft = this.leftDoor1.x;
        this.stopRight = this.rightDoor1.x + 10;
        this.stopLeft2 = this.leftDoor2.x;
        this.stopRight2 = this.rightDoor2.x -10;
        
        
        //this.physics.add.collider(this.leftDoors, this.rightDoors);
        
        this.physics.add.overlap(this.leftDoor2, this.rightDoor2, this.stopDoor, null, this);
        this.physics.add.overlap(this.leftDoor1, this.rightDoor1, this.stopDoor, null, this);
        
        this.zones = this.add.group();
        this.leftElevator = this.add.zone(0, 0, 360, 1280).setOrigin(0);
        this.rightElevator = this.add.zone(360, 0, 360, 1280).setOrigin(0);
        
        this.zones.add(this.rightElevator);
        this.zones.add(this.leftElevator);
        
        this.physics.world.enable([this.elevator1, this.elevator2]);
        
        
        this.leftElevator.setInteractive().on('pointerdown', () => { 
            this.leftDoor2.body.velocity.x = 25;
            this.rightDoor2.body.velocity.x = -25;
            //this.moveElevator(this.elevator1);
        });
        
        this.rightElevator.setInteractive().on('pointerdown', () => { 
            this.leftDoor1.body.velocity.x = 25;
            this.rightDoor1.body.velocity.x = -25;
            //this.moveElevator(this.elevator2);
        });

        //this.initialTime = 10;
        
        //this.timeInSeconds = this.time.addEvent({ delay: 1000, callback: this.onEvent, callbackScope: this, loop: true });
        
        //this.timeLabel = this.add.text(config.width / 2, config.height - 50, 'Countdown: ' + this.formatTime(this.initialTime));
        //console.log(this.timeLabel.y);

        //this.timeInSeconds = 120;
        //this.timeText = this.add.text(config.width / 2, config.height - 50, this.timeInSeconds ,{font: '35px Arial', fill: '#FFFFFF', align: 
        //'center'});
        //this.timer = this.time.events(Phaser.Timer.SECOND, this.updateTimer, this);
        
    }
/*
    updateTimer() {
        this.timeInSeconds--;
        var minutes = Math.floor(this.timeInSeconds / 60);
        var seconds = this.timeInSeconds - (minutes * 60);
        var timeString = this.addZeros(minutes) + ":" + this.addZeros(seconds);
        this.timeLabel.text = timeString;
    
        if (this.timeInSeconds == 0) {
            this.game.state.restart();
        }
    }

    addZeros(num){
        if (num < 10) {
            num = "0" + num;
        }
        return num;
    }
    */
    update() { 
        
        //this.timeLabel.setText('Countdown: ' + this.formatTime(this.initialTime));
        
        if ((this.leftDoor1.x <= this.stopLeft) && (this.rightDoor1.x >= this.stopRight)) {
            this.leftDoor1.body.stop();
            this.rightDoor1.body.stop();
        }
        if ((this.leftDoor2.x <= this.stopLeft2) && (this.rightDoor2.x >= this.stopRight2)) {
            this.leftDoor2.body.stop();
            this.rightDoor2.body.stop();
        }
        
        if ((this.leftDoor2.x >= 107) && (this.rightDoor2.x <= 220)) {
            if(!this.moving) {
                this.events.emit('door1Closed', this.elevator1) ;
            } 
            
            if (this.elevator1.y == 880) {
                this.moving = false;
            }
            
            this.events.on('elevator2Stop', this.openDoor2, this);
            
        }
        
        if ((this.leftDoor1.x >= 501) && (this.rightDoor1.x <= 608)) {
            if(!this.moving) {
                this.events.emit('door2Closed', this.elevator2) ;
            } 
            if (this.elevator2.y == 880) {
                this.moving = false;
            }
            this.events.on('elevator1Stop', this.openDoor1, this);
        }
        
        
        
        this.events.on('door1Closed', this.moveElevator, this) ;
        this.events.on('door2Closed', this.moveElevator, this) ;
        //this.events.on('door1Opened', this.stopElevator, this);
        //console.log(this.rightDoor2.x);
        //console.log(this.stopRight);
        
    }
/*
    formatTime(seconds) {
         // Minutes
        var minutes = Math.floor(seconds/60);
        // Seconds
        var partInSeconds = seconds%60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2,'0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }
    */
    stopDoor(door1, door2) {
        door2.body.velocity.x = 0;
        door1.body.velocity.x = 0;
        
    }
    
    openDoor1() {
        this.leftDoor1.body.setVelocityX(-25);
        this.rightDoor1.body.setVelocityX(25);
        
        this.events.emit('door1Opened') ;
        //this.moving = false;
    }


    openDoor2() {
        this.leftDoor2.body.setVelocityX(-25);
        this.rightDoor2.body.setVelocityX(25);

        //this.moving = false;
    }

    stopElevator() {
        this.moving = false;
    }


    moveElevator(elevator) {

        this.zones.getChildren().forEach(zoneElevator => {
            zoneElevator.disableInteractive();
        });

        this.moving = true;

        var tween = this.tweens.add({
            targets: elevator,
            y: config.height - 1000,
            // The duration will be a variable that depends on the total weight.
            duration: 3000,
            repeat: 0,
            onComplete: function () {
                var tween2 = this.tweens.add({
                    targets: elevator,
                    y: config.height - 400,
                    duration: 2000,
                    repeat: 0,
                    onComplete: function () {
                        this.zones.getChildren().forEach(zoneElevator => {
                            zoneElevator.setInteractive();
                            this.events.emit('elevator1Stop') ;
                            this.events.emit('elevator2Stop') ;
                        });
                    },
                    callbackScope: this
                  });
            },
            callbackScope: this
          });
    }
}