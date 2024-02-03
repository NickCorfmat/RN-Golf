class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
        this.i = 0
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 400
        this.SHOT_VELOCITY_Y_MIN = 700
        this.SHOT_VELOCITY_Y_MAX = 1000

        this.shots = 0
        this.score = 0
        this.stats = 0
    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)
        
        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width/2, width - wallA.width/2))
        wallA.body.setImmovable(true)

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width/2, width - wallB.width/2))
        wallB.body.setCollideWorldBounds(true)
        wallB.body.setBounce(1)
        wallB.body.setImmovable(true)
        wallB.setVelocityX(200)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width/2, height/4*3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width/2, width - this.oneWay.width/2))
        this.oneWay.body.setImmovable(true)
        this.oneWay.body.checkCollision.down = false

        // UI
        this.hsv = Phaser.Display.Color.HSVColorWheel()

        this.UIText = this.add.text(20, height - 150, 'Shots: ' + this.shots +
        `\nHoles: ` + this.score + `\nSucess Percentage: ` + this.stats + `%`, { font: "28px Arial Black", fill: "#fff" })
        this.UIText.setStroke('#00f', 4)
        this.UIText.setShadow(2, 2, "#333333", 2, true, true)

        // add pointer input
        this.input.on('pointerdown', (pointer) => {
            let shotDirectionX = pointer.x <= this.ball.x ? 1 : -1
            let shotDirectionY = pointer.y <= this.ball.y ? 1 : -1
            //this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            this.ball.body.setVelocityX(this.SHOT_VELOCITY_X * shotDirectionX)
            this.ball.body.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirectionY)

            // update shot counter and stats
            this.shots += 1
            this.stats = Phaser.Math.FloorTo(100 * Phaser.Math.RoundTo(this.score/this.shots, -2))
            this.UIText.text = 'Shots: ' + this.shots + `\nHoles: ` + this.score + `\nSucess Percentage: ` + this.stats + `%`
        })

        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.setPosition(width / 2, height - height / 10) // reset ball position
            ball.setVelocity(0)                               // reset ball velocity

            // update score and stats
            this.score += 1
            this.stats = Phaser.Math.FloorTo(100 * Phaser.Math.RoundTo(this.score/this.shots, -2))
            this.UIText.text = 'Shots: ' + this.shots + `\nHoles: ` + this.score + `\nSucess Percentage: ` + this.stats + `%`
        })

        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)
    }

    update() {

        // transitioning text colors
        this.UIText.setTint(this.hsv[this.i].color)
        this.i++;

        if (this.i == 360) {
            this.i = 0;
        }
    }
}

/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[ DONE ] Add ball reset logic on successful shot
[ DONE ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ DONE ] Make one obstacle move left/right and bounce against screen edges
[ DONE ] Create and display shot counter, score, and successful shot percentage
*/