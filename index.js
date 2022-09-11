const cellSize = 25
const gameFPS = 10

let frameCount = 0
let startX = 0
let startY = 0

const screen = document.getElementById('canvas')
const ctx = screen.getContext("2d")
const width = screen.width
const height = screen.height

// Intialize gridArray with false state for all cells
let gridArray = new Array(height / cellSize)
for (let i = 0; i < gridArray.length; i++) {
    gridArray[i] = new Array(width / cellSize)
    for (let j = 0; j < gridArray[i]; j++) {
        gridArray[i][j] = false
    }
}

function getCellState({ x, y }) {
    const minX = 0
    const maxX = width / cellSize
    const minY = 0
    const maxY = height / cellSize

    if (x >= minX && x < maxX && y >= minY && y < maxY) {
        return gridArray[x][y]
    } else {
        return false
    }
}

// Draw empty intial grid
for (let x = 0; x < gridArray.length; x++) {
    for (let y = 0; y < gridArray[x].length; y++) {
        ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
    }
}

// Place the intial cells
screen.addEventListener('click', (e) => {
    const mouseX = e.pageX
    const mouseY = e.pageY
    const gridX = Math.floor(mouseX / cellSize)
    const gridY = Math.floor(mouseY / cellSize)

    const cellState = gridArray[gridX][gridY]
    if(cellState) {
        gridArray[gridX][gridY] = false
        ctx.clearRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize)
        ctx.strokeRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize)
    } else {
        gridArray[gridX][gridY] = true
        ctx.fillRect(gridX * cellSize, gridY * cellSize, cellSize, cellSize)
    }
})

function animate() {
    const fpsCounter = document.getElementById('count')
    fpsCounter.textContent = frameCount
    frameCount++

    // Clear screen
    ctx.clearRect(0, 0, width, height)

    // Draw Grid
    for (let x = 0; x < gridArray.length; x++) {
        for (let y = 0; y < gridArray[x].length; y++) {
            const cellAlive = gridArray[x][y]
            if (cellAlive) {
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
            } else {
                ctx.strokeRect(x * cellSize, y * cellSize, cellSize, cellSize)
            }
        }
    }

    const updateGrid = new Array(height / cellSize)
    for (let i = 0; i < updateGrid.length; i++) {
        updateGrid[i] = new Array(width / cellSize)
        for (let j = 0; j < updateGrid[i]; j++) {
            updateGrid[i][j] = false
        }
    }

    for (let x = 0; x < gridArray.length; x++) {
        for (let y = 0; y < gridArray[x].length; y++) {
            const cellAlive = getCellState({ x: x, y: y })
            let numNeighbors = 0

            //Get all neighbors
            const northNeighbor = getCellState({ x: x, y: y - 1 })
            if (northNeighbor) numNeighbors++

            const westNeighbor = getCellState({ x: x - 1, y: y })
            if (westNeighbor) numNeighbors++

            const southNeighbor = getCellState({ x: x, y: y + 1 })
            if (southNeighbor) numNeighbors++

            const eastNeighbor = getCellState({ x: x + 1, y: y })
            if (eastNeighbor) numNeighbors++

            const northWestNeighbor = getCellState({ x: x - 1, y: y - 1 })
            if (northWestNeighbor) numNeighbors++

            const northEastNeighbor = getCellState({ x: x + 1, y: y - 1 })
            if (northEastNeighbor) numNeighbors++

            const southWestNeighbor = getCellState({ x: x - 1, y: y + 1 })
            if (southWestNeighbor) numNeighbors++

            const southEastNeighbor = getCellState({ x: x + 1, y: y + 1 })
            if (southEastNeighbor) numNeighbors++

            /*
             * 1. Any live cell with two or three live neighbours survives.
             * 2. Any dead cell with three live neighbours becomes a live cell.
             * 3. All other live cells die in the next generation. Similarly, all other dead cells stay dead.
            */
            if (cellAlive && (numNeighbors === 2 || numNeighbors === 3)) {
                updateGrid[x][y] = true
            } else if (!cellAlive && numNeighbors === 3) {
                updateGrid[x][y] = true
            } else {
                updateGrid[x][y] = false
            }
        }
    }

    // Apply update to gridArray
    gridArray = updateGrid

    setTimeout(() => {
        requestAnimationFrame(animate);
    }, 1000 / gameFPS);
}

// Start button can trigger animation
const startButton = document.getElementById('startButton')
let animationStarted = false
startButton.addEventListener('click', () => {
    if (!animationStarted) {
        animate()
        animationStarted = true
    }
})