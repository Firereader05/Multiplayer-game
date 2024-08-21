const binId = '66c3a552ad19ca34f8984862'; // Replace with your actual bin ID
const apiKey = '$2a$10$Uc0QY0btzASJ59ENNfoEsOFkgGVydhD5syUMRadzecBpGjC9DEQW2'; // Replace with your actual API key
const binUrl = `https://api.jsonbin.io/v3/b/66c3a552ad19ca34f8984862`;

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
        return { players: [] }; // Return a default value in case of error
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

    // Update the player position based on keys pressed
    if (keys['ArrowUp']) player.y -= speed;
    if (keys['ArrowDown']) player.y += speed;
    if (keys['ArrowLeft']) player.x -= speed;
    if (keys['ArrowRight']) player.x += speed;

    // Ensure player stays within bounds
    player.x = Math.max(0, Math.min(canvas.width - 50, player.x));
    player.y = Math.max(0, Math.min(canvas.height - 50, player.y));
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
    let player = gameState.players.find(p => p.id === playerId);
    if (!player) {
        player = { id: playerId, x: canvas.width / 2, y: canvas.height / 2 };
        gameState.players.push(player);
    }

    updatePlayerPosition();
    
    // Update the server with the new game state
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
