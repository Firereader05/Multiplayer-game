document.addEventListener('DOMContentLoaded', function() {
    // Selecting the cubes
    const cube1 = document.getElementById('cube1');
    const cube2 = document.getElementById('cube2');

    // Initial positions
    let cube1Pos = { x: 100, y: 100 };
    let cube2Pos = { x: 300, y: 100 };

    // Movement speed
    const speed = 5;

    // Configuration for jsonbin.io
    const apiKey = '$2a$10$st.acJGoKc4lbSYAhnaIoOnc3gFoQGbxuv2hIGRkde2bvDaXybFuC';  // Replace with your actual API key
    const binId = '66c73f65e41b4d34e423bd43';  // Replace with your actual Bin ID
    const binUrl = `https://api.jsonbin.io/v3/b/${binId}/latest`;

    // Function to send player data to the bin
    function updatePlayerData(playerId, x, y) {
        fetch(binUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify({
                "players": {
                    [playerId]: { "x": x, "y": y }
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
        fetch(binUrl, {
            method: 'GET',
            headers: {
                'X-Master-Key': apiKey
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Fetched player data:', data.record.players);
            updateGameState(data.record.players);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Function to update game state with player data
    function updateGameState(players) {
        // Hide all cubes initially
        cube1.style.display = 'none';
        cube2.style.display = 'none';

        // Update positions and show cubes based on player data
        if (players['player1']) {
            cube1.style.left = `${players['player1'].x}px`;
            cube1.style.top = `${players['player1'].y}px`;
            cube1.style.display = 'block'; // Show cube1
            cube1Pos = { x: players['player1'].x, y: players['player1'].y };
        }
        if (players['player2']) {
            cube2.style.left = `${players['player2'].x}px`;
            cube2.style.top = `${players['player2'].y}px`;
            cube2.style.display = 'block'; // Show cube2
            cube2Pos = { x: players['player2'].x, y: players['player2'].y };
        }
    }

    // Function to handle player input and update player data
    function handlePlayerInput(playerId, x, y) {
        // Update player data on the server
        updatePlayerData(playerId, x, y);
    }

    // Key press handlers
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            // Controls for Cube 1 (WASD)
            case 'w':
                cube1Pos.y -= speed;
                break;
            case 'a':
                cube1Pos.x -= speed;
                break;
            case 's':
                cube1Pos.y += speed;
                break;
            case 'd':
                cube1Pos.x += speed;
                break;

            // Controls for Cube 2 (Arrow keys)
            case 'ArrowUp':
                cube2Pos.y -= speed;
                break;
            case 'ArrowLeft':
                cube2Pos.x -= speed;
                break;
            case 'ArrowDown':
                cube2Pos.y += speed;
                break;
            case 'ArrowRight':
                cube2Pos.x += speed;
                break;
        }

        // Update the position of the cubes
        cube1.style.left = `${cube1Pos.x}px`;
        cube1.style.top = `${cube1Pos.y}px`;

        cube2.style.left = `${cube2Pos.x}px`;
        cube2.style.top = `${cube2Pos.y}px`;

        // Send updated position to the server
        handlePlayerInput('player1', cube1Pos.x, cube1Pos.y);
        handlePlayerInput('player2', cube2Pos.x, cube2Pos.y);
    });

    // Fetch player data every 10 seconds
    setInterval(fetchPlayerData, 10000);

    // Initial fetch to set up the game state
    fetchPlayerData();
});
