import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

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

const friction = 0.94;
class Particle {
    constructor(x, y, radius, color, velocity, context) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = 1;
        this.context = context;
    }
    draw() {
        this.context.save();
        this.globalAlpha = this.alpha;
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.context.fillStyle = this.color;
        this.context.fill();
        this.context.restore();
    }
    update() {
        this.draw();
        this.velocity.x *= friction;
        this.velocity.y *= friction;
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y; 
        this.alpha -= 0.01;
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
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }

    projectiles.push(new Projectile(
        canvas.width / 2, 
        canvas.height / 2, 
        5, 
        'white', 
        velocity,
        canvas.getContext('2d')
    ));
    
    console.log('click', projectiles);
};

const Canvas = ({ updateScore }) => {
    const canvasRef = useRef(null);
    const animationFrame = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const projectiles = [];
        const enemies = [];
        const particles = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const player = new Player(canvas.width / 2, canvas.height / 2, 10, 'white', context);

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

                const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
                const angle = Math.atan2(
                    canvas.height / 2 - y,
                    canvas.width / 2 - x
                );
                const velocity = {
                    x: Math.cos(angle), 
                    y: Math.sin(angle)
                };
                enemies.push(new Enemy(x, y, radius, color, velocity, canvas.getContext('2d')));
                //console.log(enemies);
            }, 1000);
        };

        function animate() {
            animationFrame.current = requestAnimationFrame(animate);

            context.fillStyle = 'rgb(0, 0, 0, 0.1)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            player.draw();

            particles.forEach((particle, index) => {
                if (particle.alpha <= 0) {
                    particles.splice(index, 1);
                } else {
                    particle.update();
                }
            });

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
                //enemy player hit detection
                if (dist - enemy.radius - player.radius < 1) {
                    cancelAnimationFrame(animationFrame.current);
                }

                projectiles.forEach((projectile, projectileIndex) => {
                    const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
                    
                    //projectile enemy hit detection
                    if (dist - enemy.radius - projectile.radius < 1) {
                        for (let i = 0; i < enemy.radius * 2; i++) {
                            particles.push(
                                new Particle(
                                    projectile.x, 
                                    projectile.y, 
                                    Math.random() * 2, 
                                    enemy.color, 
                                    {
                                        x: (Math.random() - 0.5) * (Math.random() * 8), 
                                        y: (Math.random() - 0.5) * (Math.random() * 8)
                                    }, 
                                    canvas.getContext('2d')))
                        }
                        if (enemy.radius - 10 > 5) {
                            updateScore(100);
                            gsap.to(enemy, {
                                radius: enemy.radius - 10
                            });
                            setTimeout(() => {
                                projectiles.splice(projectileIndex, 1);
                            }, 0);
                        } else {
                            //update score & remove enemies when shot
                            updateScore(150);
                            setTimeout(() => {
                                enemies.splice(index, 1);
                                projectiles.splice(projectileIndex, 1);
                            }, 0);
                        }
                    }
                });
            });

            //console.log('animationFrame');
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
