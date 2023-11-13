import { useRef, useEffect } from 'react';

export function Canvas(props) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        //drawing on the canvas
        context.fillStyle = 'red';
        context.fillRect(0, 0, props.width, props.height);

        //cleaning up the canvas
        const clickHandler = () => {
            context.fillStyle = 'blue';
            context.fillRect(0, 0, props.width, props.height);
        }

        //updating the canvas
        canvas.addEventListener('click', clickHandler);

        //Adding props to the canvas component
        return () => {
            canvas.removeEventListener('click', clickHandler);
        }
    }, []);

    return <canvas ref={canvasRef} width={props.width} height={props.height} />;
}