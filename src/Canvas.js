import React, { useRef, useEffect, useState } from 'react';

export function Canvas(props) {
    const canvasRef = useRef(null);
    const [player, setPlayer] = useState(null);

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

        //clickHandler logic to update canvas
        const clickHandler = () => {
           /* example of logic to turn background blue on click event 
           context.fillStyle = 'blue';
            context.fillRect(0, 0, props.width, props.height);*/
        }

        //event listener to call clickHandler function
        canvas.addEventListener('click', clickHandler);

        //UseEffect Cleanup: Remove click event listener on unmount
        return () => {
            canvas.removeEventListener('click', clickHandler);
        }
    }, [props.width, props.height]);

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
    }, [player]);

    return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }
}
