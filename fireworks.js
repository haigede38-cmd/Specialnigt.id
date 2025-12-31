const canvas = document.getElementById('fireworks');
const ctx = canvas.getContext('2d');

let W = window.innerWidth;
let H = window.innerHeight;
canvas.width = W;
canvas.height = H;

window.addEventListener('resize', () => {
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W;
    canvas.height = H;
});

// ========== FIREWORKS LOGIC START ==========

const colors = ['#ff6257','#ffd469','#00ffc6','#60a9f6', '#ffe6fb', '#cab8ff', '#ff8cde', '#ffc600'];
const gravity = 0.012;
const friction = 0.97;
const fireworks = [];
const particles = [];

function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

class Firework {
    constructor() {
        this.x = Math.random() * (W * 0.8) + W * 0.1;
        this.y = H;
        this.targetY = Math.random() * (H * 0.4) + H * 0.1;
        this.speed = Math.random() * 3 + 5;
        this.color = randomColor();
        this.exploded = false;
    }

    update() {
        if(!this.exploded) {
            this.y -= this.speed;
            this.speed -= gravity;
            if(this.y <= this.targetY) {
                this.exploded = true;
                this.explode();
            }
        }
    }

    draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2.6, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
    }

    explode() {
        let count = Math.floor(Math.random() * 20) + 40;
        for(let i = 0; i < count; i++) {
            let angle = (Math.PI * 2) * (i / count);
            let speed = Math.random() * 3 + 2;
            particles.push(new Particle(this.x, this.y, Math.cos(angle) * speed, Math.sin(angle) * speed, this.color));
        }
    }
}

class Particle {
    constructor(x, y, vx, vy, color) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.alpha = 1;
        this.size = Math.random() * 2.5 + 1.3;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= friction;
        this.vy *= friction;
        this.vy += gravity;
        this.alpha -= 0.012;
        if(this.alpha < 0) this.alpha = 0;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
    }
}

function loop() {
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#090a0f";
    ctx.fillRect(0, 0, W, H);
    ctx.globalAlpha = 1.0;

    // Launch new firework randomly
    if(Math.random() < 0.028) {
        fireworks.push(new Firework());
    }

    // Update/draw fireworks
    for (let i = fireworks.length - 1; i >= 0; i--) {
        fireworks[i].update();
        fireworks[i].draw();
        if (fireworks[i].exploded) {
            fireworks.splice(i, 1);
        }
    }

    // Update/draw particles
    for(let i = particles.length-1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].alpha <= 0.01) {
            particles.splice(i, 1);
        }
    }
    requestAnimationFrame(loop);
}

loop();