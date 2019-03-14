// does not return.
//  "gameField" is "HTMLElement" and is being changed.
//  "newGameButton" is "HTMLElement" and is being changed.
//  "playPauseButton" is "HTMLElement" and is being changed.
function initGame(gameField, newGameButton, playPauseButton) {
    "use strict";

    // initialize or re-initialize all the game parameters.

    // using "Array.from" since HTMLElement.children is a "NodeList",
    //  which is not "array" and does not work for some reason.
    let gameFieldChildrenArray = Array.from(gameField.children);
    for (let child of gameFieldChildrenArray) {
        child.remove();
    }
    let movingsCount = document.getElementsByClassName("movings-count")[0].value;
    let minVerticalInterval = 1;
    let minHorizontalInterval = 1;
    let maxVerticalInterval = document.getElementsByClassName("vertical-interval")[0].value;
    let maxHorizontalInterval = document.getElementsByClassName("horizontal-interval")[0].value;
    let xFactor = document.getElementsByClassName("x-factor")[0].value;
    let height = document.getElementsByClassName("moving-height")[0].value;
    let width = document.getElementsByClassName("moving-width")[0].value;
    let radius = document.getElementsByClassName("moving-radius")[0].value;

    // initialize or re-initialize all the game objects.

    let movings = [];

    for (let i = 0; i < movingsCount; ++i) {
        let id = i;
        let color = {
            // the generated colors will be bright.
            h: Math.floor(Math.random() * 360),
            s: Math.floor(Math.random() * 100),
            l: Math.floor(Math.random() * 100 + 50)
        };
        // randomize the direction of move.
        let verticalDirection = (Math.round(Math.random()) * 2 - 1);
        let horizontalDirection = (Math.round(Math.random()) * 2 - 1);
        // randomize the intervals.
        let verticalInterval = Math.floor(Math.random() * (maxVerticalInterval - minVerticalInterval + 1)) + minVerticalInterval;
        let horizontalInterval = Math.floor(Math.random() * (maxHorizontalInterval - minHorizontalInterval + 1)) + minHorizontalInterval;

        movings.push(
            createMoving(
                id,
                height,
                width,
                radius,
                color,
                horizontalInterval,
                verticalInterval,
                verticalDirection,
                horizontalDirection,
                xFactor
            )
        );

        // validate if top and left do not
        //  overlap each other and the other,
        //  and then add them to element.
        let top = 0;
        let left = 0;
        do {
            top = Math.floor(
                Math.random() *
                (parseInt(window.getComputedStyle(gameField).height) -
                    height)
            );
            left = Math.floor(
                Math.random() *
                (parseInt(window.getComputedStyle(gameField).width) -
                    width)
            );
            movings[i].top = top;
            movings[i].left = left;
        } while (movings.find(function(m) {
                return movings[i].overlaps(m);
            }));

        movings[i].click(function() {
            // do not remove, when game is paused or not started.
            if (isRunning === true) {
                movings[i].element.remove();
                for (let m of movings) {
                    m.act();
                }
                if (gameField.children.length === 0) {
                    alert("Congratulations, you clicked them all out!");
                    window.clearInterval(setIntervalId);
                    isRunning = false;
                    playPauseButton.disabled = true;
                    newGameButton.disabled = false;
                    playPauseButton.childNodes[0].nodeValue = "Play";
                    startTime = 0;
                    document
                        .getElementsByClassName("game-time")[0]
                        .childNodes[0]
                        .nodeValue = startTime;
                }
            }
        });

        gameField.appendChild(movings[i].element);

        startTime = performance.now();
    }

    return movings;
}