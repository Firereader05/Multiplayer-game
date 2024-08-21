// Selecting the cubes
const cube1 = document.getElementById('cube1');
const cube2 = document.getElementById('cube2');

// Initial positions
let cube1Pos = { x: 100, y: 100 };
let cube2Pos = { x: 300, y: 100 };

// Movement speed
const speed = 5;

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
});
