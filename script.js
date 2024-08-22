document.addEventListener('DOMContentLoaded', function() {
    const apiKey = '$2a$10$st.acJGoKc4lbSYAhnaIoOnc3gFoQGbxuv2hIGRkde2bvDaXybFuC';
    const binId = '66c73f65e41b4d34e423bd43';
    const binUrl = `https://api.jsonbin.io/v3/b/${binId}/latest`;

    let cube1Pos = { x: 100, y: 100 };
    let cube2Pos = { x: 300, y: 100 };

    const speed = 5;

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
        .then(response => response.json())
        .then(data => {
            console.log('Player data updated:', data);
        })
        .catch(error => {
            console.error('Error updating player data:', error);
        });
    }

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
            console.error('Error fetching player data:', error);
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
