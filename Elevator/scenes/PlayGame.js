class PlayGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }

    create() {

        this.background = this.add.tileSprite(0, 0, config.width, config.height, "background");
        this.background.setOrigin(0, 0);

        
        this.elevator1 = this.add.sprite(555, 750, "interior");
        this.elevator2 = this.add.sprite(165, 750, "interior");
        
        this.rightDoors = this.add.group() ;
        this.leftDoors = this.add.group() ;
        
        
        this.rightDoor1 = new Door({
            scene: this,
            x: 605,
            y: 745,
            key: "right-door",
            codDoor: 1,
        });
        
        this.rightDoor2 = new Door({
            scene: this,
            x: 320,
            y: 745,
            key: "right-door",
            codDoor: 1,
        });
        
        this.leftDoor1 = new Door({
            scene: this,
            x: 500,
            y: 745,
            key: "left-door",
            codDoor: 2,
        }); 
        
        this.leftDoor2 = new Door({
            scene: this,
            x: 0,
            y: 745,
            key: "left-door",
            codDoor: 2,
        });

        this.tile = this.add.tileSprite(config.width/2, 0, config.width, config.height, "wall");
        
        this.wall = this.add.sprite(config.width / 2, 700, "wall-doors");
        
        this.physics.world.enable(this.elevator1);
        this.physics.world.enable(this.rightDoor1);
        this.physics.world.enable(this.leftDoor1);
        
        this.physics.world.enable(this.elevator2);
        this.physics.world.enable(this.rightDoor2);
        this.physics.world.enable(this.leftDoor2);

        var inter = this.add.zone(0, 0, config.width, config.height).setOrigin(0);


        inter.setInteractive().on('pointerdown', () => {
            //this.leftDoor1.body.velocity.x = -25;
            //this.rightDoor1.body.velocity.x = 25;
            this.leftDoor2.body.velocity.x = 25;
            this.rightDoor2.body.velocity.x = -25;
         });

        

        
        this.stopLeft = this.leftDoor1.x - 100;
        this.stopRight = this.rightDoor1.x + 100;
        
        
        //this.physics.add.collider(this.leftDoors, this.rightDoors);

        this.physics.add.overlap(this.leftDoor2, this.rightDoor2, this.stopDoor, null, this);
        //this.physics.add.overlap(this.leftDoor1, this.rightDoor1, this.stopDoor, null, this);

        
    }

    update() { 
        if (this.leftDoor1.x <= this.stopLeft) {
            this.leftDoor1.body.stop();
        }
        if (this.rightDoor1.x >= this.stopRight) {
            this.rightDoor1.body.stop();
        }

        this.events.on('doorClosed', this.openDoor, this);
    }

    stopDoor(door1, door2) {
        door2.body.velocity.x = 0;
        door1.body.velocity.x = 0;
        
        this.events.emit('doorClosed');

    }

    openDoor() {
        this.leftDoor1.body.setVelocityX(-25);
        this.rightDoor1.body.setVelocityX(25);
    }
}