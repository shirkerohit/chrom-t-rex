class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = 800;
        this.canvas.height = 300;

        this.dino = {
            x: 50,
            y: 250,
            width: 40,
            height: 40,
            jumping: false,
            velocity: 0
        };

        this.obstacles = [];
        this.score = 0;
        this.highScore = localStorage.getItem('highScore') || 0;
        this.gameSpeed = 5;
        this.gravity = 0.6;
        this.jumpForce = -13;
        this.isRunning = true;

        this.bindEvents();
        this.updateHighScore();
        this.gameLoop();
    }

    bindEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.dino.jumping) {
                this.jump();
            }
        });

        this.canvas.addEventListener('click', () => {
            if (!this.dino.jumping) {
                this.jump();
            }
        });
    }

    jump() {
        this.dino.jumping = true;
        this.dino.velocity = this.jumpForce;
    }

    update() {
        // Update dino
        if (this.dino.jumping) {
            this.dino.velocity += this.gravity;
            this.dino.y += this.dino.velocity;

            if (this.dino.y >= 250) {
                this.dino.y = 250;
                this.dino.jumping = false;
                this.dino.velocity = 0;
            }
        }

        // Generate obstacles
        if (Math.random() < 0.02) {
            this.obstacles.push({
                x: this.canvas.width,
                y: 250,
                width: 20,
                height: 40
            });
        }

        // Update obstacles
        this.obstacles.forEach((obstacle, index) => {
            obstacle.x -= this.gameSpeed;

            // Check collision
            if (this.checkCollision(this.dino, obstacle)) {
                this.gameOver();
            }

            // Remove off-screen obstacles
            if (obstacle.x + obstacle.width < 0) {
                this.obstacles.splice(index, 1);
                this.score++;
                document.getElementById('score').textContent = `Score: ${this.score}`;
            }
        });
    }

    checkCollision(dino, obstacle) {
        return dino.x < obstacle.x + obstacle.width &&
            dino.x + dino.width > obstacle.x &&
            dino.y < obstacle.y + obstacle.height &&
            dino.y + dino.height > obstacle.y;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw dino
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(this.dino.x, this.dino.y, this.dino.width, this.dino.height);

        // Draw obstacles
        this.ctx.fillStyle = '#666';
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        });

        // Draw ground
        this.ctx.beginPath();
        this.ctx.moveTo(0, 290);
        this.ctx.lineTo(800, 290);
        this.ctx.stroke();
    }

    gameLoop() {
        if (!this.isRunning) return;

        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }

    gameOver() {
        this.isRunning = false;
        this.updateHighScore();

        this.ctx.fillStyle = '#000';
        this.ctx.font = '30px Arial';
        this.ctx.fillText('Game Over! Click to restart', 250, 150);

        // Add click to restart
        const restartHandler = () => {
            this.obstacles = [];
            this.score = 0;
            document.getElementById('score').textContent = 'Score: 0';
            this.isRunning = true;
            this.gameLoop();
            this.canvas.removeEventListener('click', restartHandler);
        };

        this.canvas.addEventListener('click', restartHandler);
    }

    updateHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('highScore', this.highScore);
        }
        document.getElementById('highScore').textContent = `High Score: ${this.highScore}`;
    }
}

// Start the game when the page loads
window.onload = () => {
    new Game();
}; 