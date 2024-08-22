// Configuration for jsonbin.io
const apiKey = '$2a$10$st.acJGoKc4lbSYAhnaIoOnc3gFoQGbxuv2hIGRkde2bvDaXybFuC';  // Replace with your actual API key
const binId = '66c73f65e41b4d34e423bd43';  // Replace with your actual Bin ID
const binUrl = `https://api.jsonbin.io/v3/b/${binId}`; // URL for accessing the bin

// Initialize player data
const playerSprites = {
    'player1': createSprite(100, 200),
    'player2': createSprite(300, 200)
};

// Set player sprite properties
for (const playerId in playerSprites) {
    const player = playerSprites[playerId];
    player.shapeColor = playerId === 'player1' ? 'red' : 'blue'; // Different color for each player
    player.scale = 0.5;
}

// Function to send player data to the bin
function updatePlayerData(playerId, x, y, velocityX, velocityY) {
    fetch(binUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey
        },
        body: JSON.stringify({
            "players": {
                [playerId]: { "x": x, "y": y, "velocityX": velocityX, "velocityY": velocityY }
            }
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Player data updated:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to fetch player data from the bin
function fetchPlayerData() {
    fetch(`${binUrl}/latest`, {
        method: 'GET',
        headers: {
            'X-Master-Key': apiKey
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Fetched player data:', data.players);
        updateGameState(data.players);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Function to update game state with player data
function updateGameState(players) {
    for (const playerId in players) {
        const playerData = players[playerId];
        if (playerSprites[playerId]) {
            playerSprites[playerId].x = playerData.x;
            playerSprites[playerId].y = playerData.y;
            playerSprites[playerId].velocityX = playerData.velocityX;
            playerSprites[playerId].velocityY = playerData.velocityY;
        }
    }
}

// Function to handle player input and update player data
function handlePlayerInput(playerId, x, y, velocityX, velocityY) {
    // Update player data on the server
    updatePlayerData(playerId, x, y, velocityX, velocityY);
}

// Main draw loop
function draw() {
    background('white');

    // Example player movement handling
    if (keyIsDown(LEFT_ARROW)) {
        playerSprites['player1'].x -= 5;
    }
    if (keyIsDown(RIGHT_ARROW)) {
        playerSprites['player1'].x += 5;
    }
    if (keyIsDown(UP_ARROW)) {
        playerSprites['player1'].y -= 5;
    }
    if (keyIsDown(DOWN_ARROW)) {
        playerSprites['player1'].y += 5;
    }

    // Update player data with new positions
    const playerId = 'player1'; // For demonstration, this is player1
    const player = playerSprites[playerId];
    handlePlayerInput(playerId, player.x, player.y, player.velocityX, player.velocityY);

    // Apply collision and update game state
    for (const id in playerSprites) {
        playerSprites[id].collide(platform);
    }

    drawSprites();
}

// Fetch player data every 10 seconds
setInterval(fetchPlayerData, 10000);

// Send player data every 10 seconds
setInterval(() => {
    const playerId = 'player1'; // Replace with actual player ID
    const player = playerSprites[playerId];
    handlePlayerInput(playerId, player.x, player.y, player.velocityX, player.velocityY);
}, 10000);
