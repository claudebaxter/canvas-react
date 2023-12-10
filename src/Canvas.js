import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import './App.css';

// Define prototypes and handlers outside the component function
class Player {
    constructor(x, y, radius, playerImage, context) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.image = playerImage;
        this.context = context;
    }
    draw() {
        this.context.drawImage(
            this.image, 
            this.x - this.radius, 
            this.y - this.radius, 
            this.radius * 2, 
            this.radius * 2)
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
    constructor(x, y, radius, color, velocity, enemyImage, context) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.enemyImage = enemyImage;
        this.context = context;
    }
    draw() {
        this.context.drawImage(
            this.enemyImage,
            this.x - this.radius,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        )
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y; 
    }
};

class Upgrade {
    constructor(x, y, radius, color, velocity, upgradeImage, context) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.upgradeImage = upgradeImage;
        this.acquired = false;
        this.context = context;
    }
    draw() {
        this.context.drawImage(
            this.upgradeImage,
            this.x - this.radius,
            this.y - this.radius,
            this.radius * 2,
            this.radius * 2
        )
    }
    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y; 
    }
    isAcquired() {
        return this.acquired;
    }
    setAcquired(value) {
        this.acquired = value;
    }
};

let scatterShotActive = false;
const clickHandler = (event, canvas, projectiles) => {
    const angle = Math.atan2(
        event.clientY - canvas.height / 2,
        event.clientX - canvas.width / 2)

    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }

    if (!scatterShotActive) {
        projectiles.push(new Projectile(
            canvas.width / 2, 
            canvas.height / 2, 
            5, 
            'white', 
            velocity,
            canvas.getContext('2d')
        ));
    } else {
        for (let i = 0; i < 5; i++) {
            const spreadAngle = (Math.PI / 25) * (i - 2);
            const spreadVelocity = {
                x: Math.cos(angle + spreadAngle) * 5,
                y: Math.sin(angle + spreadAngle) * 5
            }
            projectiles.push(new Projectile(
                canvas.width / 2, 
                canvas.height / 2, 
                5, 
                'white', 
                spreadVelocity,
                canvas.getContext('2d')
            ))
        }
    }

    
};

const Canvas = ({ updateScore, score, setScore }) => {
    const [restartModal, setRestartModal] = useState(false);
    const [startModal, setStartModal] = useState(true);
    const [newGame, setNewGame] = useState(0);
    const [backgroundMusicLoaded, setBackgroundMusicLoaded] = useState(false);
    const [isMusicPlaying, setIsMusicPlaying] = useState(false);
    const [pauseMusic, setPauseMusic] = useState(false);
    const canvasRef = useRef(null);
    const animationFrame = useRef(null);
    const backgroundMusicRef = useRef(null);
    let enemySpawnInterval;
    let upgradeSpawnInterval;
    let scatterShotTimeoutId = null;

    function startScatterShot() {
        scatterShotActive = true;
        clearTimeout(scatterShotTimeoutId);
        scatterShotTimeoutId = setTimeout(() => {
            scatterShotActive = false;
        }, 10000)
    }

    const handlePlayerDeath = () => {
        setRestartModal(true);
        setIsMusicPlaying(false);
        clearInterval(enemySpawnInterval);
        clearInterval(upgradeSpawnInterval);
        backgroundMusicRef.current.pause();
        backgroundMusicRef.current.currentTime = 0;
    };

    const handleRestart = () => {
        setScore(0);
        setRestartModal(false);
        setIsMusicPlaying(true);
        setNewGame(newGame + 1);
    };

    const handleStart = () => {
        setStartModal(false);
        setIsMusicPlaying(true);
        setNewGame(newGame + 1);
    };

    const handleMusicPause = () => {
        if (!pauseMusic) {
            setPauseMusic(true);
        } else {
            setPauseMusic(false);
        }
    }

    const playBackgroundMusic = () => {
        if (backgroundMusicLoaded && isMusicPlaying && !pauseMusic) {
            backgroundMusicRef.current.play();
        } else if (pauseMusic) {
            backgroundMusicRef.current.pause();
            backgroundMusicRef.current.currentTime = 0;
        }
    };

    useEffect(() => {
        const music = new Audio('./Lexica-Tiger-Tracks.mp3');
        music.loop = true;
        music.oncanplaythrough = () => {
            // Set state to indicate that background music is loaded
            setBackgroundMusicLoaded(true);
        };
        backgroundMusicRef.current = music;
        
        if (startModal || restartModal) return;

        playBackgroundMusic();

        const enemyDir = "./enemies/";
        const enemyFiles = [
            "icon-ada.svg",
            "icon-atom.svg",
            "icon-bnb.svg",
            "icon-btc.svg",
            "icon-doge.svg",
            "icon-eth.svg",
            "icon-ltc.svg",
            "icon-shib.svg",
            "icon-sol.svg",
            "icon-trx.svg",
            "icon-usdt.svg",
            "icon-xmr.svg"
        ];

        const enemySprite = enemyFiles.map(file => enemyDir + file);

        const upgradeDir = "./upgrades/";
        const upgradeFiles = [
            "icon-afd.svg",
            "icon-algo.svg",
            "icon-dc.svg",
            "icon-grad.svg",
            "icon-ogs.svg",
            "icon-puddin.svg",
            "icon-trts.svg"
        ];

        const upgradeSprite = upgradeFiles.map(file => upgradeDir + file);

        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const projectiles = [];
        const enemies = [];
        const particles = [];
        const upgrades = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const image = new Image();
        image.src = './icon.svg';

        const player = new Player(
            canvas.width / 2, 
            canvas.height / 2, 
            20, 
            image, 
            context);

        function spawnEnemies() {
            enemySpawnInterval = setInterval(() => {
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

                const enemyImages = new Image();
                enemyImages.src = enemySprite[Math.floor(Math.random() * enemySprite.length)];
                enemies.push(new Enemy(x, y, radius, color, velocity, enemyImages, canvas.getContext('2d')));
                console.log('New Enemy: ', enemies);
            }, 1000);
        };

        function spawnUpgrades() {
            upgradeSpawnInterval = setInterval(() => {
                const radius = 20;

                let x;
                let y;

                if (Math.random() < 0.5) {
                    x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
                    y = Math.random() * canvas.height;
                } else {
                    x = Math.random() * canvas.width
                    y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius
                };

                const color = 'purple';
                const angle = Math.atan2(
                    canvas.height / 2 - y,
                    canvas.width / 2 - x
                );
                const velocity = {
                    x: Math.cos(angle), 
                    y: Math.sin(angle)
                };

                const upgradeImage = new Image();
                upgradeImage.src = upgradeSprite[Math.floor(Math.random() * upgradeSprite.length)];
                upgrades.push(new Upgrade(x, y, radius, color, velocity, upgradeImage, canvas.getContext('2d')));
                console.log('New Upgrade:', upgradeImage);
            }, 15000);
        };

        function animate() {
            animationFrame.current = requestAnimationFrame(animate);

            context.fillStyle = 'rgb(0, 0, 0, 0.1)';
            context.fillRect(0, 0, canvas.width, canvas.height);
            player.draw();

            for (let index = particles.length - 1; index >= 0; index--) {
                const particle = particles[index];
                if (particle.alpha <= 0) {
                    particles.splice(index, 1);
                } else {
                    particle.update();
                }
            };

            for (let index = projectiles.length - 1; index >= 0; index--) {
                const projectile = projectiles[index];
                projectile.update();

                //remove projectiles from array at edge of map
                if (projectile.x + projectile.radius < 0 || 
                    projectile.x - projectile.radius > canvas.width ||
                    projectile.y + projectile.radius < 0 ||
                    projectile.y - projectile.radius > canvas.height) {
                    projectiles.splice(index, 1)
                }
            };

            for (let index = upgrades.length - 1; index >= 0; index--) {
                const upgrade = upgrades[index];
                upgrade.update();
                
                //track distance between upgrades and player
                const dist = Math.hypot(player.x - upgrade.x, player.y - upgrade.y)
                if (dist - upgrade.radius - player.radius < 1 && !upgrade.isAcquired()) {
                    upgrade.setAcquired(true); // set flag to prevent multiple conditional triggers

                    let upgradeImage = upgrade.upgradeImage
                    //extract filename without extension to simplify conditions:
                    let acquiredUpgrade = upgradeImage.src.match(/\/([^/]+)\.[^.]+$/)[1];

                    gsap.to(upgrade, {
                        radius: upgrade.radius - 10,
                        onComplete: () => {
                            upgrades.splice(index, 1);
                            upgrade.setAcquired(false);
                            console.log('Upgrade acquired!');
                            updateScore(250);
                            if (acquiredUpgrade == "icon-afd") {
                                console.log('Scatter Shot Acquired!', upgrade.upgradeImage);
                                startScatterShot();
                            } else if (acquiredUpgrade == "icon-algo") {
                                console.log('Shield Acquired!', upgrade.upgradeImage);
                                startScatterShot();
                            } else if (acquiredUpgrade == "icon-dc") {
                                console.log('Rapid Fire Acquired!', upgrade.upgradeImage);
                                startScatterShot();
                            } else if (acquiredUpgrade == "icon-grad") {
                                console.log('Bombs Acquired!', upgrade.upgradeImage);
                                startScatterShot();
                            } else if (acquiredUpgrade == "icon-ogs") {
                                console.log('Gnomes Acquired!', upgrade.upgradeImage);
                                startScatterShot();
                            } else if (acquiredUpgrade == "icon-puddin") {
                                console.log('Rear Cannons Acquired!', upgrade.upgradeImage);
                                startScatterShot();
                            } else if (acquiredUpgrade == "icon-trts") {
                                console.log('Treats acquired:', upgrade.upgradeImage);
                                startScatterShot();
                            }
                        }
                    })   
                }
            }

            for (let index = enemies.length - 1; index >= 0; index--) {
                const enemy = enemies[index];
                enemy.update();

                const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
                //enemy player hit detection
                if (dist - enemy.radius - player.radius < 1) {
                    cancelAnimationFrame(animationFrame.current);
                    handlePlayerDeath();
                }

                for (let projectilesIndex = projectiles.length - 1; projectilesIndex >= 0; projectilesIndex--) {
                    const projectile = projectiles[projectilesIndex];
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
                            projectiles.splice(projectilesIndex, 1);
                        } else {
                            //update score & remove enemies when shot
                            updateScore(150);
                            enemies.splice(index, 1);
                            projectiles.splice(projectilesIndex, 1);
                        }
                    }
                };
            };

            //console.log('animationFrame');
        }

        animate();
        spawnEnemies();
        spawnUpgrades();

        const clickHandlerWrapper = (event) => clickHandler(event, canvas, projectiles);
        canvas.addEventListener('click', clickHandlerWrapper);

        return () => {
            canvas.removeEventListener('click', clickHandlerWrapper);
            cancelAnimationFrame(animationFrame.current);
        };
    }, [newGame]);

    return (
        <React.Fragment>
        {restartModal && (
            <div id="modal" style={{
                    display: 'block',
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
                    <label style={{ fontSize: '14px', 
                        color: 'grey' }}>Game Over</label>
                    <h1 id="modalScore" style={{ 
                        fontSize: '48px', 
                        color: 'red', 
                        marginBottom: '0', 
                        marginTop: '8px' }}>{score}</h1>
                    <p style={{ 
                        color: 'grey', 
                        margin: '0', 
                        fontSize: '13px' }}>POINTS</p>
                    <button id="button" style={{
                        marginTop: '12px',
                        backgroundColor: 'blue',
                        border: 'none',
                        borderRadius: '15px',
                        color: 'white',
                        padding: '8px 16px',
                        cursor: 'pointer'
                    }} 
                    onClick={() => {
                        handleRestart()
                        setIsMusicPlaying(true)}}>RESTART</button>
                    <div className="switch-container">
                        <label className="switch">
                            <input type="checkbox" 
                                checked={!pauseMusic} 
                                onClick={() => {
                                    handleMusicPause();
                                }}/>
                            <span className="slider round"></span>
                            <span className="switch-label">Music On/Off</span>
                        </label>
                    </div>
            </div>
        )}
        {startModal && (
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
                }}
                onClick={() => {
                    handleStart()
                    setIsMusicPlaying(true)}}>
                    START
                </button>
            </div>
        )}
        <canvas ref={canvasRef} />
        </React.Fragment>
    )
};

export default Canvas;
