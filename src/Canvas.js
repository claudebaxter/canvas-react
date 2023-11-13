import { useRef, useEffect } from 'react';

export function Canvas(props) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        //initial drawing on the canvas
        context.fillStyle = 'red';
        context.fillRect(0, 0, props.width, props.height);

        //clickHandler logic to update canvas
        const clickHandler = () => {
            context.fillStyle = 'blue';
            context.fillRect(0, 0, props.width, props.height);
        }

        //event listener to call clickHandler function
        canvas.addEventListener('click', clickHandler);

        //UseEffect Cleanup: Remove click event listener on unmount
        return () => {
            canvas.removeEventListener('click', clickHandler);
        }
    }, []);

    return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}