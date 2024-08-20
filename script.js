const binId = '66c3a552ad19ca34f8984862';
const apiKey = '$2a$10$Uc0QY0btzASJ59ENNfoEsOFkgGVydhD5syUMRadzecBpGjC9DEQW2';
const binUrl = `https://api.jsonbin.io/v3/b/${binId}`;

// Function to retrieve game state
async function getGameState() {
    const response = await fetch(`${binUrl}/latest`, {
        headers: {
            'X-Master-Key': apiKey
        }
    });
    const data = await response.json();
    return data.record;
}

// Function to update game state
async function updateGameState(newState) {
    await fetch(binUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': apiKey
        },
        body: JSON.stringify(newState)
    });
}

// Example usage
async function main() {
    let gameState = await getGameState();
    console.log("Current game state:", gameState);

    // Update the game state (e.g., add a player)
    gameState.players.push({ id: "player1", x: 100, y: 150 });
    await updateGameState(gameState);
}

main();
