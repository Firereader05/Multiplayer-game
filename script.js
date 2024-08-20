const binId = '66c3a552ad19ca34f8984862';
const apiKey = '$2a$10$Uc0QY0btzASJ59ENNfoEsOFkgGVydhD5syUMRadzecBpGjC9DEQW2';
const binUrl = `https://api.jsonbin.io/v3/b/${binId}`;

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let playerId = `player_${Math.floor(Math.random() * 10000)}`;
let gameState = { players: [] };
let speed = 5;
let keys = {};

// Set up the key listeners for movement
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

async function getGameState() {
    try {
        const response = await fetch(`${binUrl}/latest`, {
            headers: {
                'X-Master-Key': apiKey
            }
        });
        const data = await response.json();
        return data.record;
    } catch (error) {
        console.error('Failed to retrieve game state:', error);
    }
}

async function updateGameState(newState) {
    try {
        await fetch(binUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify(newState)
        });
    } catch (error) {
        console.error('Failed to update game state:', error);
    }
}

function updatePlayerPosition() {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return;

    if (keys['ArrowUp']) player.y -= speed;
    if (keys['ArrowDown']) player.y += speed;
    if (keys['ArrowLeft']) player.x -= speed;
    if (keys['ArrowRight']) player.x += speed;
}

function drawPlayers() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    gameState.players.forEach(player => {
        ctx.fillStyle = 'gray';
        ctx.fillRect(player.x, player.y, 50, 50);
    });
}

async function gameLoop() {
    gameState = await getGameState();

    // Ensure the current player is in the game state
    if (!gameState.players.some(p => p.id === playerId)) {
        gameState.players.push({ id: playerId, x: canvas.width / 2, y: canvas.height / 2 });
    }

    updatePlayerPosition();

    await updateGameState(gameState);
    drawPlayers();

    requestAnimationFrame(gameLoop);
}

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start the game loop
gameLoop();
