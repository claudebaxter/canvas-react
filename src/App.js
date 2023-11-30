import React, { useRef, useState } from 'react';
import Canvas from './Canvas.js';
import './App.css';

function App() {
    const [score, setScore] = useState(0);

    const updateScore = (amount) => {
        setScore((prevScore) => prevScore + amount);
    };
  return (
    <React.Fragment>
        <div style={{
            position: 'absolute',
            color: 'red',
            padding: '8px',
            fontSize: '14px',
            userSelect: 'none'}}>
                <span>Score: <span id="scoreEl">{score}</span></span>
        </div>
        <Canvas 
            score={score}
            setScore={setScore}
            updateScore={updateScore}/>
    </React.Fragment>
  );
}

export default App;

/*
this will go above Canvas component eventually


            

            <div id="startModal" style={{
                position: 'absolute',
                backgroundColor: 'white',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                left: '50%',
                padding: '16px',
                maxWidth: '500px',
                width: '100%',
                textAlign: 'center',
                borderRadius: '15px'
            }}>
                <h1 style={{ fontSize: '24px', color: 'red', marginBottom: '0', marginTop: '8px' }}>ASAteroids</h1>
                <button id="startButton" style={{
                    marginTop: '12px',
                    backgroundColor: 'blue',
                    border: 'none',
                    borderRadius: '15px',
                    color: 'white',
                    padding: '8px 16px',
                    cursor: 'pointer'
                }}>
                    START
                </button>
            </div>

            <img id="playerImage" src="./icon.svg" style={{ display: 'none' }} />
            <audio id="backgroundMusic" src="./Lexica-Tiger-Tracks.mp3" loop />
*/