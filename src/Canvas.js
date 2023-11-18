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
}

const clickHandler = (event, canvas, projectiles) => {
    const newProjectile = new Projectile(
        canvas.width / 2,
        canvas.height / 2,
        5,
        'red',
        null,
        canvas.getContext('2d')
    );
    projectiles.push(newProjectile);
    console.log('click', event);
};

const Canvas = () => {
    const canvasRef = useRef(null);
    const animationFrame = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const projectiles = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const player = new Player(canvas.width / 2, canvas.height / 2, 30, 'blue', context);

        function animate() {
            animationFrame.current = requestAnimationFrame(animate);

            context.clearRect(0, 0, canvas.width, canvas.height);
            player.draw();

            projectiles.forEach((projectile) => {
                projectile.draw();
            });

            console.log('intervalId');
        }

        animate();

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
