import Canvas from './Canvas.js';
import './App.css';
import React from 'react';

function App() {
  return (
    <React.Fragment>
      <Canvas />
    </React.Fragment>
  );
}

export default App;

/*
this will go above Canvas component eventually
<div style={{
                position: 'absolute',
                color: 'red',
                padding: '8px',
                fontSize: '14px',
                userSelect: 'none'
            }}>
                <span>Score: <span id="scoreEl">0</span></span>
            </div>

            <div id="modal" style={{
                display: 'none',
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
                <label style={{ fontSize: '14px', color: 'grey' }}>Game Over</label>
                <h1 id="modalScore" style={{ fontSize: '48px', color: 'red', marginBottom: '0', marginTop: '8px' }}>0</h1>
                <p style={{ color: 'grey', margin: '0', fontSize: '13px' }}>POINTS</p>
                <button id="button" style={{
                    marginTop: '12px',
                    backgroundColor: 'blue',
                    border: 'none',
                    borderRadius: '15px',
                    color: 'white',
                    padding: '8px 16px',
                    cursor: 'pointer'
                }}>
                    RESTART
                </button>
                <div className="switch-container">
                    <label className="switch">
                        <input type="checkbox" defaultChecked />
                        <span className="slider round"></span>
                        <span className="switch-label">Music On/Off</span>
                    </label>
                </div>
            </div>

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