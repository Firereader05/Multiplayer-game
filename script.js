// Configuration for jsonbin.io
const apiKey = '$2a$10$st.acJGoKc4lbSYAhnaIoOnc3gFoQGbxuv2hIGRkde2bvDaXybFuC';  // Replace with your actual API key
const binId = '66c73f65e41b4d34e423bd43';  // Replace with your actual Bin ID
const binUrl = `https://api.jsonbin.io/v3/b/${binId}`; // URL for accessing the bin

// Initialize request counter
let requestCount = 0;

// Get the HTML elements
const sendDataButton = document.getElementById('sendData');
const fetchDataButton = document.getElementById('fetchData');
const output = document.getElementById('output');

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
        requestCount++; // Increment request count
        console.log('Player data updated:', data);
        output.textContent = `Data sent successfully! Request count: ${requestCount}`;
    })
    .catch(error => {
        console.error('Error:', error);
        output.textContent = `Error sending data: ${error.message}`;
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
        requestCount++; // Increment request count
        output.textContent = `Fetched Data: ${JSON.stringify(data.players)}. Request count: ${requestCount}`;
        updateGameState(data.players);
    })
    .catch(error => {
        console.error('Error:', error);
        output.textContent = `Error fetching data: ${error.message}`;
    });
}

// Function to update game state with player data
function updateGameState(players) {
    for (const playerId in players) {
        const playerData = players[playerId];
        // Update player sprite positions and velocities
        // Example:
        // playerSprites[playerId].x = playerData.x;
        // playerSprites[playerId].y = playerData.y;
        // playerSprites[playerId].velocityX = playerData.velocityX;
        // playerSprites[playerId].velocityY = playerData.velocityY;
    }
}

// Function to handle player input and update player data
function handlePlayerInput(playerId, x, y, velocityX, velocityY) {
    // Update player data on the server
    updatePlayerData(playerId, x, y, velocityX, velocityY);
}

// Fetch player data every 1 second
setInterval(fetchPlayerData, 1000);

// Event listeners for the buttons
sendDataButton.addEventListener('click', () => {
    // Example player data for testing
    const playerId = 'player1'; // Replace with actual player ID
    const x = Math.random() * 500; // Example x position
    const y = Math.random() * 500; // Example y position
    const velocityX = Math.random() * 10; // Example velocityX
    const velocityY = Math.random() * 10; // Example velocityY
    handlePlayerInput(playerId, x, y, velocityX, velocityY);
});

fetchDataButton.addEventListener('click', fetchPlayerData);
