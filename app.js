document.addEventListener('DOMContentLoaded', () => {
    //Create Grid
    const container = document.getElementById("grid");
    for(var i = 0; i < 200; i++){
        container.innerHTML +=  '<div>' + '</div>';
    }
    for(var i = 0; i < 10; i++){
        container.innerHTML +=  '<div class="taken">' + '</div>';
    }

    const nextUpContainer = document.getElementById("next-up-grid");
    for(var i = 0; i < 15; i++){
        nextUpContainer.innerHTML +=  '<div>' + '</div>';
    }

    const grid = document.querySelector(".grid");
    var squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisplay = document.querySelector("#score");
    const startButton = document.querySelector("#start-button");
    const width = 10;
    var nextRandom = 0;
    var timerID;
    var score = 0;
    var moveDownTime = 0;
    
    //Declare blocks 
    const lBlock = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const backwardsLBlock = [
        [0, 1, width+1, width*2+1],
        [width, width+1, width+2, 2],
        [1, width+1, width*2+1, width*2 + 2],
        [width, width + 1, width + 2, width*2]
    ]

    const zBlock = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ]

    const backwardsZBlock = [
        [1,width,width+1,width*2],
        [width, width+1,width*2+1,width*2+2],
        [1,width,width+1,width*2],
        [width, width+1,width*2+1,width*2+2],
    ]

    const tBlock = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ]

    const oBlock = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ]

    const iBlock = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]

    const blocks = [lBlock, backwardsLBlock, zBlock, backwardsZBlock, tBlock, oBlock, iBlock];

    var currentPosition = 4;
    var randomBlockIndex = Math.floor(Math.random() * blocks.length);
    var currentRotation = 0;
    var current = blocks[randomBlockIndex][0];

    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add("block");
        })
    }

    function erase() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove("block")
        })
    }

    function control(e) {
        if(e.keyCode === 37) {
            moveLeft();
        } else if (e.keyCode === 38) {
            rotate();
        } else if (e.keyCode === 39) {
            moveRight();
        } else if (e.keyCode === 40) {
            moveDown();
        }
    }

    document.addEventListener('keydown', control);

    function moveDown() {
        erase();
        currentPosition += width;
        draw();
        stop();
    }

    function stop() {
        if(current.some(index => squares[currentPosition + index + width]
                                    .classList.contains("taken"))) {
            current.forEach(index => squares[currentPosition + index]
                                    .classList.add("taken"));
            randomBlockIndex = nextRandom;
            nextRandom = Math.floor(Math.random() * blocks.length);
            currentRotation = 0;
            current = blocks[randomBlockIndex][currentRotation];
            currentPosition = 4;
            moveDownTime = moveDownTime - 1;
            console.log(moveDownTime);
            clearInterval(timerID);
            timerID = setInterval(moveDown, moveDownTime);
            draw();
            displayNextUp();
            addScore();
            gameOver();
        }
    }

    function moveLeft() {
        erase();
        const atLeftEdge = current.some(index => (currentPosition + index) % width === 0);
        if(!atLeftEdge && !current.some(index => squares[currentPosition + index - 1]
            .classList.contains("taken"))) {
            currentPosition -= 1;
        }

        draw();
    }

    function moveRight() {
        erase();
        const atRightEdge = current.some(index => 
                    (currentPosition + index) % width === width - 1);
        if(!atRightEdge && !current.some(index => squares[currentPosition + index + 1]
            .classList.contains("taken"))) {
            currentPosition += 1;
        }
        
        draw();
    }

    function rotate() {
        erase();
        currentRotation++;
        if (currentRotation === current.length) {
            currentRotation = 0;
        }
        current = blocks[randomBlockIndex][currentRotation];
        draw();
    }

    const nextUpSquares = Array.from(document.querySelectorAll(".next-up-grid div")); 
    const nextUpWidth = 4;
    var nextUpIndex = 0;
    

    const blocksNoRotations = [
        [1, nextUpWidth+1, nextUpWidth*2+1, 2], //lBlock
        [0, 1, nextUpWidth+1, nextUpWidth*2+1], //backwardsLBlock
        [0, nextUpWidth, nextUpWidth+1, nextUpWidth*2+1], //zBlock
        [1,nextUpWidth,nextUpWidth+1,nextUpWidth*2], //backwardsZBlock
        [1, nextUpWidth, nextUpWidth+1, nextUpWidth+2], //tBlock
        [0, 1, nextUpWidth, nextUpWidth+1], //oBlock
        [1, nextUpWidth+1, nextUpWidth*2+1, nextUpWidth*3+1] //iBlock
      ]

    function displayNextUp() {
        nextUpSquares.forEach(square => {
            square.classList.remove('block');
        });
        blocksNoRotations[nextRandom].forEach(index => {
            nextUpSquares[nextUpIndex + index].classList.add('block');
        })
    }
    
    startButton.addEventListener("click", () => {
        if(timerID) {
            //Stop
            timerID = null;
            endGame();
        } else {
            //Start
            draw();
            moveDownTime = 1000;
            timerID = setInterval(moveDown, moveDownTime);
            nextRandom = Math.floor(Math.random() * blocks.length);
            displayNextUp();           
        }
    });

    function addScore() {
        for (var i = 0; i < 199; i += width) {
            const row = [];
            for (var j = 0; j < 10; j++) {
                row.push(i + j);
            }
            //const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9];

            if (row.every(index => squares[index].classList.contains("taken"))) {
                score += 10;    
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove("taken");
                    squares[index].classList.remove('block');
                });
                const squaresRemoved = squares.splice(i, width);
                squares = squaresRemoved.concat(squares);
                squares.forEach(cell => grid.appendChild(cell));
            }
        }
    }

    function gameOver() {
        if(current.some(index => squares[currentPosition + index].classList.contains("taken"))) {
            endGame();
        }
    }

    function endGame() {
        grid.innerHTML = "<h2>GAME OVER!</h2>";
        clearInterval(timerID);
    }

})