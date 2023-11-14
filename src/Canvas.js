import React, { useRef, useEffect, useState } from 'react';

export function Canvas(props) {
    const canvasRef = useRef(null);
    const [player, setPlayer] = useState(null);
    const [projectiles, setProjectiles] = useState([]);

    //This hook is responsible for initializing the canvas and setting up intial event listeners
    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        //initial drawing on the canvas
        context.fillStyle = 'black';
        context.fillRect(0, 0, props.width, props.height);

        //instantiate the player in canvas center on component mount
        const centerX = props.width / 2;
        const centerY = props.height / 2;
        const newPlayer = new Player(centerX, centerY, 30, 'blue');
        setPlayer(newPlayer);

        //clickHandler logic to update canvas with projectiles
        const clickHandler = () => {
            const newProjectile = new Projectile(newPlayer.x, newPlayer.y, 5, 'red', { x: 1, y: 1 });
            setProjectiles([...projectiles, newProjectile]);
            console.log("projectiles", projectiles)
        }

        //event listener to call clickHandler function
        canvas.addEventListener('click', clickHandler);

        //UseEffect Cleanup: Remove click event listener on unmount
        return () => {
            canvas.removeEventListener('click', clickHandler);
        }
    }, [props.width, props.height]);

    //hook triggers when player state changes, draws player on the canvas
    useEffect(() => {
        //draw player when player state variable is not null
        if (player) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            context.beginPath();
            context.arc(player.x, player.y, player.radius, 0, Math.PI * 2, false);
            context.fillStyle = player.color;
            context.fill();
        }

        //draw projectiles (need to set up trigger event)
        if (projectiles.length > 0) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            for (const projectile of projectiles) {
                context.beginPath();
                context.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2, false);
                context.fillStyle = projectile.color;
                context.fill();
            }
        }
    }, [player, projectiles]);

    return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
};

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }
};