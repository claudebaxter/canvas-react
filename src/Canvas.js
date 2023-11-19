import React, { useRef, useEffect } from 'react';

// Define prototypes and handlers outside the component function
class Player {
    constructor(x, y, radius, color, context) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.context = context;
    }
    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity, context) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.context = context;
    }
    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y; 
    }
};

class Enemy {
    constructor(x, y, radius, color, velocity, context) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.context = context;
    }
    draw() {
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y; 
    }
};

const clickHandler = (event, canvas, projectiles) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2)

    const velocity = {
        x: Math.cos(angle),
        y: Math.sin(angle)
    }

    projectiles.push(new Projectile(
        canvas.width / 2, 
        canvas.height / 2, 
        5, 
        'red', 
        velocity,
        canvas.getContext('2d')
    ));
    
    console.log('click', projectiles);
};

const Canvas = () => {
    const canvasRef = useRef(null);
    const animationFrame = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const projectiles = [];
        const enemies = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const player = new Player(canvas.width / 2, canvas.height / 2, 30, 'blue', context);

        function spawnEnemies() {
            setInterval(() => {
                const x = Math.random() * canvas.width;
                const y = Math.random() * canvas.height;
                const radius = 30;
                const color = 'green'
                const angle = Math.atan2(
                    canvas.height / 2 - y,
                    canvas.width / 2 - x
                );
                const velocity = {
                    x: Math.cos(angle), 
                    y: Math.sin(angle)
                }
                enemies.push(new Enemy(x, y, radius, color, velocity, canvas.getContext('2d')));
                console.log(enemies);
            }, 1000)
        };

        function animate() {
            animationFrame.current = requestAnimationFrame(animate);

            context.clearRect(0, 0, canvas.width, canvas.height);
            player.draw();

            projectiles.forEach((projectile) => {
                projectile.update();
            });

            enemies.forEach(enemy => {
                enemy.update();
            });

            console.log('animationFrame');
        }

        animate();
        spawnEnemies();

        const clickHandlerWrapper = (event) => clickHandler(event, canvas, projectiles);
        canvas.addEventListener('click', clickHandlerWrapper);

        return () => {
            canvas.removeEventListener('click', clickHandlerWrapper);
            cancelAnimationFrame(animationFrame.current);
        };
    }, []);

    return <canvas ref={canvasRef} />;
};

export default Canvas;
