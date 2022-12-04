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
    const ScoreDisplay = document.querySelector("#score");
    const StartButton = document.querySelector("#start-button");
    const width = 10;
    let nextRandom = 0;
    
    //Declare blocks 
    const lBlock = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ]

    const zBlock = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
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

    const blocks = [lBlock, zBlock, tBlock, oBlock, iBlock];

    let currentPosition = 4;
    let randomBlockIndex = Math.floor(Math.random() * blocks.length);
    let currentRotation = 0;
    let current = blocks[randomBlockIndex][0];

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

    timerID = setInterval(moveDown, 500);

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

    document.addEventListener('keyup', control);

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
            draw();
            displayNextUp();
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
    let nextUpIndex = 0;
    

    const blocksNoRotations = [
        [1, nextUpWidth+1, nextUpWidth*2+1, 2], //lBlock
        [0, nextUpWidth, nextUpWidth+1, nextUpWidth*2+1], //zBlock
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
    
})