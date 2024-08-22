document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '$2a$10$st.acJGoKc4lbSYAhnaIoOnc3gFoQGbxuv2hIGRkde2bvDaXybFuC';
    const binId = '66c73f65e41b4d34e423bd43';
    const binUrl = `https://api.jsonbin.io/v3/b/${binId}/latest`;

    const cube1 = document.getElementById('cube1');
    const cube2 = document.getElementById('cube2');

    let cube1Pos = { x: 100, y: 100 };
    let cube2Pos = { x: 300, y: 100 };

    const speed = 5;

    function logToConsole(message) {
        const consoleDiv = document.getElementById('console');
        const newMessage = document.createElement('div');
        newMessage.textContent = message;
        consoleDiv.appendChild(newMessage);
        consoleDiv.scrollTop = consoleDiv.scrollHeight; // Scroll to bottom
    }

    function updatePlayerData() {
        fetch(binUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-Master-Key': apiKey
            },
            body: JSON.stringify({
                players: {
                    player1: { x: cube1Pos.x, y: cube1Pos.y },
                    player2: { x: cube2Pos.x, y: cube2Pos.y }
                }
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to update data. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            logToConsole('Data sent successfully');
        })
        .catch(error => {
            logToConsole(`Error sending data: ${error.message}`);
        });
    }

    function fetchPlayerData() {
        fetch(binUrl, {
            method: 'GET',
            headers: {
                'X-Master-Key': apiKey
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch data. Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            logToConsole('Data fetched successfully');
            if (data && data.record && data.record.players) {
                updateGameState(data.record.players);
            } else {
                logToConsole('No player data found in the fetched record.');
            }
        })
        .catch(error => {
            logToConsole(`Error fetching data: ${error.message}`);
        });
    }

    function updateGameState(players) {
        if (players.player1) {
            cube1.style.left = `${players.player1.x}px`;
            cube1.style.top = `${players.player1.y}px`;
        }
        if (players.player2) {
            cube2.style.left = `${players.player2.x}px`;
            cube2.style.top = `${players.player2.y}px`;
        }
    }

    document.addEventListener('keydown', (e) => {
        switch(e.key) {
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
        updatePlayerData();
    });

    setInterval(fetchPlayerData, 10000);
    fetchPlayerData();
});
