import React, { useState } from 'react';
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
            <img id="playerImage" src="./icon.svg" style={{ display: 'none' }} />
            <audio id="backgroundMusic" src="./Lexica-Tiger-Tracks.mp3" loop />
*/