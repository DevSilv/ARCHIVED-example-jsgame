let isRunning = false;
let setIntervalId = 0;
let time = 0;

// Returns "object".
//  "id" is an arbitral integer (may also be 0 and less).
//  "height" is in pixels.
//  "width" is in pixels.
//  "radius" is in pixels.
//  "color" is a custom color object of format {r,g,b},
//      where r,g,b are integers from 0 to 255.
//  "verticalInterval" is in pixels.
//  "horizontalInterval" is in pixels.
function createMoving(
    id,
    height,
    width,
    radius,
    color,
    verticalInterval,
    horizontalInterval,
    verticalDirection,
    horizontalDirection,
    xFactor
) {
    "use strict";

    let element = document.createElement("div");
    element.classList.add("moving");
    element.style.height = height + "px";
    element.style.width = width + "px";
    element.style.borderRadius = radius + "px";
    element.style.backgroundColor = "hsl(" + color.h + "," + color.s + "%," + color.l + "%)";

    return {
        "id": id,
        "element": element,
        "verticalInterval": verticalInterval,
        "horizontalInterval": horizontalInterval,
        "verticalDirection": verticalDirection,
        "horizontalDirection": horizontalDirection,
        "adjustTop": function(gameFieldHeight) {
            // Is reversed for loop faster indeed?
            for (let i = this.verticalInterval; i > 0; --i) {
                let top = parseInt(this.element.style.top);
                if ((top >=
                        gameFieldHeight -
                        parseInt(this.element.getBoundingClientRect().height)) || top <= 0) {
                    this.verticalDirection = -this.verticalDirection;
                }
                this.element.style.top = (top + this.verticalDirection) + "px";
            }
        },
        "adjustLeft": function(gameFieldWidth) {
            //  Is reversed for loop faster indeed?
            for (let i = this.horizontalInterval; i > 0; --i) {
                let left = parseInt(this.element.style.left);
                if ((left >=
                        gameFieldWidth -
                        parseInt(this.element.getBoundingClientRect().width)) || left <= 0) {
                    this.horizontalDirection = -this.horizontalDirection;
                }
                this.element.style.left = (left + this.horizontalDirection) + "px";
            }
        },
        "action": function() {
            // Minimum size is 1px.
            let style = this.element.style;
            let newWidth = parseInt(style.width) - xFactor;
            let newHeight = parseInt(style.height) - xFactor;
            if (newHeight > 0) {
                this.element.style.height = newHeight + "px";
            }
            if (newWidth > 0) {
                this.element.style.width = newWidth + "px";
            }
        }
    };
}

// Returns "window.setInterval" function.
//  "gameFieldRef" is "HTMLElement".
//  "movingsRef" is "array" of "moving" objects.
//  "intervalTime" is "integer" and in miliseconds.
function game(gameFieldRef, movingsRef, intervalTime) {
    "use strict";

    return window.setInterval(function() {
        ++time;

        for (let m of movingsRef) {
            let gameFieldComputedStyle = window.getComputedStyle(gameFieldRef);
            m.adjustTop(parseInt(gameFieldComputedStyle.height));
            m.adjustLeft(parseInt(gameFieldComputedStyle.width));
        }

        if (time % (1000 / intervalTime) === 0) {
            document
                .getElementsByClassName("game-time")[0]
                .childNodes[0]
                .nodeValue = time / (1000 / intervalTime);
        }
    }, intervalTime);
}

// Does not return.
//  "gameFieldRef" is "HTMLElement" and is being changed.
//  "newGameButtonRef" is "HTMLElement" and is being changed.
//  "playPauseButtonRef" is "HTMLElement" and is being changed.
function initGame(gameFieldRef, newGameButtonRef, playPauseButtonRef) {
    "use strict";

    // Initialize or re-initialize all the game parameters.

    // Using "Array.from" since HTMLElement.children is a NodeList,
    //  which is not "array" and does not work for some reason
    let gameFieldChildrenArray = Array.from(gameFieldRef.children);
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

    // Initialize or re-initialize all the game objects.

    let movings = [];
    for (let i = 0; i < movingsCount; ++i) {
        let id = i;
        let color = {
            // Generate colors that are not dark.
            h: Math.floor(Math.random() * 360),
            s: Math.floor(Math.random() * 100),
            l: Math.floor(Math.random() * 100 + 50)
        };
        // Randomize the direction of move.
        let verticalDirection = (Math.round(Math.random()) * 2 - 1);
        let horizontalDirection = (Math.round(Math.random()) * 2 - 1);
        // Randomize the intervals.
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

        let top = Math.floor(
            Math.random() *
            (parseInt(window.getComputedStyle(gameFieldRef).height) -
                (parseInt(movings[i].element.style.height)))
        );
        let left = Math.floor(
            Math.random() *
            (parseInt(window.getComputedStyle(gameFieldRef).width) -
                (parseInt(movings[i].element.style.width)))
        );
        movings[i].element.style.top = top + "px";
        movings[i].element.style.left = left + "px";
        // movings[i].element.appendChild(document.createTextNode(id));
        movings[i].element.addEventListener("click", function() {
            // Do not remove, when game is paused or not started.
            if (isRunning === true) {
                movings[i].element.remove();
                for (let m of movings) {
                    m.action();
                }
                if (gameFieldRef.children.length === 0) {
                    alert("Congratulations, you clicked them all out!");
                    window.clearInterval(setIntervalId);
                    isRunning = false;
                    playPauseButtonRef.disabled = true;
                    newGameButtonRef.disabled = false;
                    playPauseButtonRef.childNodes[0].nodeValue = "Play";
                    time = 0;
                    document
                        .getElementsByClassName("game-time")[0]
                        .childNodes[0]
                        .nodeValue = time;
                }
            }
        });

        gameFieldRef.appendChild(movings[i].element);
    }

    return movings;
}

window.addEventListener("load", function() {
    "use strict";

    let gameFieldRef = document.getElementsByClassName("game-field")[0];
    let newGameButtonRef =
        document.getElementsByClassName("new-game-button")[0];
    let playPauseButtonRef =
        document.getElementsByClassName("play-pause-button")[0];
    let movings = [];
    let intervalTime = 10; // miliseconds

    newGameButtonRef.addEventListener("click", function() {
        movings = initGame(gameFieldRef, newGameButtonRef, playPauseButtonRef);
        playPauseButtonRef.disabled = false;
        playPauseButtonRef.childNodes[0].nodeValue = "Play";
        time = 0;
        document
            .getElementsByClassName("game-time")[0]
            .childNodes[0]
            .nodeValue = time;
    });

    playPauseButtonRef.addEventListener("click", function() {
        if (isRunning === true) {
            // Pause the game.
            isRunning = false;
            window.clearInterval(setIntervalId);
            playPauseButtonRef.childNodes[0].nodeValue = "Resume";
            newGameButtonRef.disabled = false;
        } else {
            // Resume or play the game the first time.
            isRunning = true;
            setIntervalId = game(gameFieldRef, movings, intervalTime);
            playPauseButtonRef.childNodes[0].nodeValue = "Pause";
            newGameButtonRef.disabled = true;
        }
    });
});