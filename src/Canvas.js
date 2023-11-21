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
                const radius = Math.random() * (30 - 4) + 4;

                let x;
                let y;

                if (Math.random() < 0.5) {
                    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
                    y = Math.random() * canvas.height;
                } else {
                    x = Math.random() * canvas.width
                    y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
                };

                const color = 'green';
                const angle = Math.atan2(
                    canvas.height / 2 - y,
                    canvas.width / 2 - x
                );
                const velocity = {
                    x: Math.cos(angle), 
                    y: Math.sin(angle)
                };
                enemies.push(new Enemy(x, y, radius, color, velocity, canvas.getContext('2d')));
                console.log(enemies);
            }, 1000);
        };

        function animate() {
            animationFrame.current = requestAnimationFrame(animate);

            context.fillStyle = 'rgb(0, 0, 0, 0.1)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            player.draw();

            projectiles.forEach((projectile, index) => {
                projectile.update();

                //remove projectiles from array at edge of map
                if (projectile.x + projectile.radius < 0 || 
                    projectile.x - projectile.radius > canvas.width ||
                    projectile.y + projectile.radius < 0 ||
                    projectile.y - projectile.radius > canvas.height) {
                    setTimeout(() => {
                        projectiles.splice(index, 1)
                    }, 0)
                }
            });

            enemies.forEach((enemy, index) => {
                enemy.update();

                const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
                if (dist - enemy.radius - player.radius < 1) {
                    cancelAnimationFrame(animationFrame.current);
                }

                projectiles.forEach((projectile, projectileIndex) => {
                    const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
                    
                    if (dist - enemy.radius - projectile.radius < 1) {
                        setTimeout(() => {
                            enemies.splice(index, 1);
                            projectiles.splice(projectileIndex, 1);
                        }, 0);
                    }
                });
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
